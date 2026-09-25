import os
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import create_engine, text
import bcrypt

logger = logging.getLogger(__name__)

# Connect to the newly created surplus_to_shelter.db in PostgreSQL
POSTGRES_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:Shorya%4011%40sql@localhost:5432/surplus_to_shelter.db"
)
clean_url = POSTGRES_URL.split("?")[0]
if clean_url.startswith("postgresql://"):
    clean_url = clean_url.replace("postgresql://", "postgresql+psycopg2://", 1)

pg_engine = create_engine(
    clean_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with pg_engine.connect() as conn:
        row = conn.execute(
            text('SELECT id, email, name, phone, role, "passwordHash", "createdAt" FROM "User" WHERE LOWER(email) = LOWER(:email)'),
            {"email": email.strip()}
        ).mappings().first()
        return dict(row) if row else None

def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    with pg_engine.connect() as conn:
        row = conn.execute(
            text('SELECT id, email, name, phone, role, "createdAt" FROM "User" WHERE id = :id'),
            {"id": user_id.strip()}
        ).mappings().first()
        return dict(row) if row else None

def find_user_by_phone(phone: Optional[str]) -> Optional[Dict[str, Any]]:
    if not phone:
        return None
    with pg_engine.connect() as conn:
        row = conn.execute(
            text('SELECT id, email, name, phone, role FROM "User" WHERE phone = :phone'),
            {"phone": phone.strip()}
        ).mappings().first()
        return dict(row) if row else None

def create_user_record(name: str, email: str, phone: Optional[str], role: str, password_hash: str) -> Dict[str, Any]:
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    clean_phone = phone.strip() if phone else None
    with pg_engine.begin() as conn:
        conn.execute(
            text('''
                INSERT INTO "User" (id, name, email, phone, role, "passwordHash", "createdAt", "updatedAt")
                VALUES (:id, :name, :email, :phone, CAST(:role AS "Role"), :passwordHash, :createdAt, :updatedAt)
            '''),
            {
                "id": user_id,
                "name": name.strip(),
                "email": email.strip().lower(),
                "phone": clean_phone,
                "role": role.upper(),
                "passwordHash": password_hash,
                "createdAt": now,
                "updatedAt": now
            }
        )
    return {
        "id": user_id,
        "name": name,
        "email": email.lower(),
        "phone": clean_phone,
        "role": role.upper(),
        "createdAt": now.isoformat()
    }

def create_recipient_for_user(
    user_id: str,
    org_name: str,
    reg_num: Optional[str] = None,
    fssai_num: Optional[str] = None,
    address: Optional[str] = None,
    phone: Optional[str] = None
) -> str:
    rec_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    with pg_engine.begin() as conn:
        conn.execute(
            text('''
                INSERT INTO "Recipient" (
                    id, "userId", "organizationName", "registrationNumber", "fssaiNumber",
                    address, latitude, longitude, "capacityMeals", "dietaryPreference",
                    "contactPerson", phone, "verificationStatus", "verifiedAt", "createdAt", "updatedAt"
                ) VALUES (
                    :id, :userId, :orgName, :regNum, :fssaiNum,
                    :addr, 26.8521, 75.8054, 250, CAST('BOTH' AS "DietaryType"),
                    :contact, :phone, CAST('APPROVED' AS "VerificationStatus"), :vAt, :now, :now
                )
            '''),
            {
                "id": rec_id,
                "userId": user_id,
                "orgName": org_name or "Shelter Organization",
                "regNum": reg_num or f"DARPAN-RJ-{uuid.uuid4().hex[:6].upper()}",
                "fssaiNum": fssai_num or f"2222107400{uuid.uuid4().hex[:4]}",
                "addr": address or "Sector 4, Malviya Nagar, Jaipur",
                "contact": org_name or "Coordinator",
                "phone": phone or "+919829400000",
                "vAt": now,
                "now": now
            }
        )
    logger.info(f"[PostgreSQL] Created Recipient profile {rec_id} for user {user_id}")
    return rec_id

def create_driver_for_user(
    user_id: str,
    full_name: str,
    phone: Optional[str] = None,
    vehicle_type: Optional[str] = None,
    vehicle_number: Optional[str] = None
) -> str:
    drv_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    with pg_engine.begin() as conn:
        conn.execute(
            text('''
                INSERT INTO "Driver" (
                    id, "userId", "fullName", phone, "vehicleType", "vehicleNumber",
                    "isAvailable", "currentLat", "currentLng", "isOtpVerified", "createdAt", "updatedAt"
                ) VALUES (
                    :id, :userId, :fullName, :phone, :vType, :vNum,
                    true, 26.8850, 75.7920, true, :now, :now
                )
            '''),
            {
                "id": drv_id,
                "userId": user_id,
                "fullName": full_name or "Rescue Driver",
                "phone": phone or "+919829400000",
                "vType": vehicle_type or "FOUR_WHEELER",
                "vNum": vehicle_number or f"RJ-14-EA-{uuid.uuid4().hex[:4].upper()}",
                "now": now
            }
        )
    logger.info(f"[PostgreSQL] Created Driver profile {drv_id} for user {user_id}")
    return drv_id

def init_postgres():
    """Verifies connection to surplus_to_shelter.db in PostgreSQL and ensures default users exist."""
    try:
        demo_users = [
            ("admin@surplus.org", "Admin Coordinator", "ADMIN", "+919829407512", "AdminPassword@123"),
            ("contact@greenfuture.org", "Green Future Foundation", "NGO", "+919829407513", "NgoPassword@123"),
            ("rajesh.driver@surplus.org", "Rajesh Kumar (Volunteer Driver)", "DRIVER", "+919829407514", "DriverPassword@123"),
        ]
        
        for email, name, role, phone, raw_pw in demo_users:
            existing = find_user_by_email(email)
            if not existing:
                h = bcrypt.hashpw(raw_pw.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")
                create_user_record(name=name, email=email, phone=phone, role=role, password_hash=h)
                logger.info(f"[PostgreSQL] Created demo user: {email} ({role})")

        # Seed Recipient (NGO), Donor, Driver & Donation if not present
        with pg_engine.begin() as conn:
            # 1. Recipient Profile
            ngo_user = conn.execute(text('SELECT id FROM "User" WHERE email = :email'), {"email": "contact@greenfuture.org"}).mappings().first()
            if ngo_user:
                rec = conn.execute(text('SELECT id FROM "Recipient" WHERE "userId" = :uid'), {"uid": ngo_user["id"]}).first()
                if not rec:
                    rec_id = str(uuid.uuid4())
                    now = datetime.now(timezone.utc)
                    conn.execute(
                        text('''
                            INSERT INTO "Recipient" (
                                id, "userId", "organizationName", "registrationNumber", "fssaiNumber",
                                address, latitude, longitude, "capacityMeals", "dietaryPreference",
                                "contactPerson", phone, "verificationStatus", "verifiedAt", "createdAt", "updatedAt"
                            ) VALUES (
                                :id, :userId, :orgName, :regNum, :fssaiNum,
                                :addr, :lat, :lng, :capacity, CAST(:dietary AS "DietaryType"),
                                :contact, :phone, CAST(:vstatus AS "VerificationStatus"), :vAt, :now, :now
                            )
                        '''),
                        {
                            "id": rec_id,
                            "userId": ngo_user["id"],
                            "orgName": "Green Future Foundation",
                            "regNum": "RJ/2019/0241982",
                            "fssaiNum": "22221074000456",
                            "addr": "Sector 4, Malviya Nagar, Jaipur",
                            "lat": 26.8521,
                            "lng": 75.8054,
                            "capacity": 300,
                            "dietary": "BOTH",
                            "contact": "Anjali Sharma",
                            "phone": "+919829407513",
                            "vstatus": "APPROVED",
                            "vAt": now,
                            "now": now
                        }
                    )
                    logger.info("[PostgreSQL] Seeded Recipient profile for Green Future Foundation.")

            # 2. Donor Profile
            donor = conn.execute(text('SELECT id FROM "Donor" WHERE phone = :phone'), {"phone": "+919829407512"}).mappings().first()
            donor_id = None
            now = datetime.now(timezone.utc)
            if not donor:
                donor_id = str(uuid.uuid4())
                conn.execute(
                    text('''
                        INSERT INTO "Donor" (
                            id, name, phone, "organizationType", address, latitude, longitude, "isBlocked", "createdAt", "updatedAt"
                        ) VALUES (
                            :id, :name, :phone, :orgType, :addr, :lat, :lng, :isBlocked, :now, :now
                        )
                    '''),
                    {
                        "id": donor_id,
                        "name": "The Grand Palace Banquet & Kitchen",
                        "phone": "+919829407512",
                        "orgType": "RESTAURANT",
                        "addr": "Plot 42, Civil Lines, Jaipur",
                        "lat": 26.9124,
                        "lng": 75.7873,
                        "isBlocked": False,
                        "now": now
                    }
                )
                logger.info("[PostgreSQL] Seeded Donor profile for The Grand Palace Banquet.")
            else:
                donor_id = donor["id"]

            # 3. Driver Profile
            drv_user = conn.execute(text('SELECT id FROM "User" WHERE email = :email'), {"email": "rajesh.driver@surplus.org"}).mappings().first()
            if drv_user:
                drv = conn.execute(text('SELECT id FROM "Driver" WHERE "userId" = :uid'), {"uid": drv_user["id"]}).first()
                if not drv:
                    drv_id = str(uuid.uuid4())
                    now = datetime.now(timezone.utc)
                    conn.execute(
                        text('''
                            INSERT INTO "Driver" (
                                id, "userId", "fullName", phone, "vehicleType", "vehicleNumber",
                                "isAvailable", "currentLat", "currentLng", "isOtpVerified", "createdAt", "updatedAt"
                            ) VALUES (
                                :id, :userId, :fullName, :phone, :vType, :vNum,
                                :isAvail, :lat, :lng, :otpVer, :now, :now
                            )
                        '''),
                        {
                            "id": drv_id,
                            "userId": drv_user["id"],
                            "fullName": "Rajesh Kumar (Volunteer Driver)",
                            "phone": "+919829407514",
                            "vType": "FOUR_WHEELER",
                            "vNum": "RJ14-EA-4492",
                            "isAvail": True,
                            "lat": 26.8850,
                            "lng": 75.7920,
                            "otpVer": True,
                            "now": now
                        }
                    )
                    logger.info("[PostgreSQL] Seeded Driver profile for Rajesh Kumar.")

            # 4. Sample Donation
            if donor_id:
                don = conn.execute(text('SELECT id FROM "Donation" WHERE "donorId" = :did'), {"did": donor_id}).mappings().first()
                now = datetime.now(timezone.utc)
                if not don:
                    don_id = str(uuid.uuid4())
                    conn.execute(
                        text('''
                            INSERT INTO "Donation" (
                                id, "donorId", "foodTitle", "foodType", "quantityKg", "estimatedMeals",
                                "preparedAt", "safeUntil", "pickupAddress", "pickupLat", "pickupLng",
                                notes, status, "sourceChannel", "submissionTimestamp", "createdAt", "updatedAt"
                            ) VALUES (
                                :id, :donorId, :foodTitle, CAST(:foodType AS "FoodType"), :quantityKg, :estimatedMeals,
                                :prepAt, :safeUntil, :pickupAddr, :pickupLat, :pickupLng,
                                :notes, CAST(:status AS "DonationStatus"), CAST(:sourceChannel AS "SourceChannel"), :now, :now, :now
                            )
                        '''),
                        {
                            "id": don_id,
                            "donorId": donor_id,
                            "foodTitle": "50 Fresh Dal Makhani & Jeera Rice Meals",
                            "foodType": "VEG_COOKED",
                            "quantityKg": 25.0,
                            "estimatedMeals": 50,
                            "prepAt": now,
                            "safeUntil": now,
                            "pickupAddr": "Plot 42, Civil Lines, Jaipur",
                            "pickupLat": 26.9124,
                            "pickupLng": 75.7873,
                            "notes": "Packed in food-grade insulated containers",
                            "status": "PENDING",
                            "sourceChannel": "WHATSAPP",
                            "now": now
                        }
                    )
                    logger.info("[PostgreSQL] Seeded sample Donation in surplus_to_shelter.db.")
                else:
                    don_id = don["id"]

                # 5. Sample Match
                rec_row = conn.execute(text('SELECT id FROM "Recipient" LIMIT 1')).mappings().first()
                mat_id = None
                if rec_row and don_id:
                    sample_rec_id = rec_row["id"]
                    mat = conn.execute(text('SELECT id FROM "Match" WHERE "donationId" = :did'), {"did": don_id}).mappings().first()
                    if not mat:
                        mat_id = str(uuid.uuid4())
                        conn.execute(
                            text('''
                                INSERT INTO "Match" (
                                    id, "donationId", "recipientId", score, "distanceKm",
                                    "capacityFitScore", "urgencyScore", "dietaryScore", status,
                                    "proposedAt", "respondedAt", "createdAt", "updatedAt"
                                ) VALUES (
                                    :id, :donId, :recId, :score, :dist,
                                    :capScore, :urgScore, :dietScore, CAST(:status AS "MatchStatus"),
                                    :now, :now, :now, :now
                                )
                            '''),
                            {
                                "id": mat_id,
                                "donId": don_id,
                                "recId": sample_rec_id,
                                "score": 96.5,
                                "dist": 3.2,
                                "capScore": 98.0,
                                "urgScore": 95.0,
                                "dietScore": 100.0,
                                "status": "ACCEPTED",
                                "now": now
                            }
                        )
                        logger.info("[PostgreSQL] Seeded sample Match.")
                    else:
                        mat_id = mat["id"]

                    # 6. Sample Certificate
                    cert = conn.execute(text('SELECT id FROM "Certificate" WHERE "donationId" = :did'), {"did": don_id}).first()
                    if not cert:
                        cert_id = str(uuid.uuid4())
                        conn.execute(
                            text('''
                                INSERT INTO "Certificate" (
                                    id, "donationId", "recipientId", "donorSubmissionTimestamp",
                                    "ngoAcceptanceTimestamp", "ngoAuthorizedUserId", "fssaiClauseCited",
                                    "qrCodeData", "verificationSlug", "pdfPath", "issuedAt", "isValid"
                                ) VALUES (
                                    :id, :donId, :recId, :subAt, :accAt, :authUid, :clause,
                                    :qr, :slug, :pdf, :now, :isValid
                                )
                            '''),
                            {
                                "id": cert_id,
                                "donId": don_id,
                                "recId": sample_rec_id,
                                "subAt": now,
                                "accAt": now,
                                "authUid": ngo_user["id"] if ngo_user else "admin",
                                "clause": "FSSAI (Recovery and Distribution of Surplus Food) Regulations, 2019 - Clause 3(1) Good Samaritan Protection",
                                "qr": f"https://surplus-to-shelter.org/verify/{cert_id[:8]}",
                                "slug": f"fssai-cert-{cert_id[:8]}",
                                "pdf": "/certificates/FSSAI_Certificate_Pilot_2026.pdf",
                                "now": now,
                                "isValid": True
                            }
                        )
                        logger.info("[PostgreSQL] Seeded sample Certificate.")

                    # 7. Sample DriverAssignment
                    drv_row = conn.execute(text('SELECT id FROM "Driver" LIMIT 1')).mappings().first()
                    if drv_row and don_id:
                        asgn = conn.execute(text('SELECT id FROM "DriverAssignment" WHERE "donationId" = :did'), {"did": don_id}).first()
                        if not asgn:
                            asgn_id = str(uuid.uuid4())
                            conn.execute(
                                text('''
                                    INSERT INTO "DriverAssignment" (
                                        id, "donationId", "matchId", "driverId", status,
                                        "assignedAt", "driverNotes", "createdAt", "updatedAt"
                                    ) VALUES (
                                        :id, :donId, :matchId, :driverId, CAST(:status AS "DriverAssignmentStatus"),
                                        :now, :notes, :now, :now
                                    )
                                '''),
                                {
                                    "id": asgn_id,
                                    "donId": don_id,
                                    "matchId": mat_id,
                                    "driverId": drv_row["id"],
                                    "status": "ASSIGNED",
                                    "notes": "Pickup from kitchen back alley, contact chef on arrival.",
                                    "now": now
                                }
                            )
                            logger.info("[PostgreSQL] Seeded sample DriverAssignment.")

                    # 8. Sample VerificationDocument
                    vdoc = conn.execute(text('SELECT id FROM "VerificationDocument" WHERE "recipientId" = :rid'), {"rid": sample_rec_id}).first()
                    if not vdoc:
                        doc_id = str(uuid.uuid4())
                        conn.execute(
                            text('''
                                INSERT INTO "VerificationDocument" (
                                    id, "recipientId", "documentType", "fileUrl", "fileName", "fileSize", "uploadedAt"
                                ) VALUES (
                                    :id, :recId, :docType, :fileUrl, :fileName, :fileSize, :now
                                )
                            '''),
                            {
                                "id": doc_id,
                                "recId": sample_rec_id,
                                "docType": "FSSAI_REGISTRATION",
                                "fileUrl": "/docs/FSSAI_Registration_22221074000456.pdf",
                                "fileName": "FSSAI_Registration_22221074000456.pdf",
                                "fileSize": 245000,
                                "now": now
                            }
                        )
                        logger.info("[PostgreSQL] Seeded sample VerificationDocument.")

        logger.info("[PostgreSQL] surplus_to_shelter.db tables initialized and verified.")
    except Exception as e:
        logger.error(f"[PostgreSQL] Init error: {e}")
