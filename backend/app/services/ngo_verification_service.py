import json
import re
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.ngo_models import NGO, Verification
from app.services.darpan_service import verify_darpan
from app.services.fssai_service import verify_fssai

def _normalize_name(name: str) -> str:
    if not name:
        return ""
    # Strip whitespace, punctuation, common suffixes for resilient matching
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', name).lower().strip()
    return " ".join(cleaned.split())

def _names_match(name1: str, name2: str) -> bool:
    if not name1 or not name2:
        return False
    n1 = _normalize_name(name1)
    n2 = _normalize_name(name2)
    return n1 == n2 or n1 in n2 or n2 in n1

def save_verification(db: Session, ngo_id: int, result: dict) -> Verification:
    verification = Verification(
        ngo_id=ngo_id,
        verification_type=result["verification_type"],
        identifier=result["identifier"],
        status=result["status"],
        source=result["source"],
        message=result.get("message"),
        organization_name=result.get("organization_name"),
        license_status=result.get("license_status"),
        raw_data=json.dumps(result, default=str),
        fallback_used=result.get("fallback_used", False),
        created_at=datetime.utcnow()
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return verification

async def verify_ngo_by_credentials(
    db: Session,
    name: str,
    darpan_id: str,
    fssai_number: str
) -> dict:
    clean_name = name.strip()
    clean_darpan = darpan_id.strip()
    clean_fssai = fssai_number.strip()

    # 1. Check if registered in local NGO database
    ngo = db.query(NGO).filter(
        (NGO.darpan_id == clean_darpan) |
        (NGO.fssai_number == clean_fssai) |
        (func.lower(NGO.name) == clean_name.lower())
    ).first()

    is_registered = ngo is not None

    # 2. Run Darpan verification
    darpan_res = verify_darpan(clean_darpan)

    # 3. Run FSSAI verification
    fssai_res = await verify_fssai(clean_fssai)

    # 4. Check name matching across registries
    darpan_org = darpan_res.get("organization_name") or ""
    fssai_org = fssai_res.get("organization_name") or ""

    name_matched = False
    if darpan_org and _names_match(clean_name, darpan_org):
        name_matched = True
    elif fssai_org and _names_match(clean_name, fssai_org):
        name_matched = True
    elif is_registered and _names_match(clean_name, ngo.name):
        name_matched = True

    # 5. Determine overall verification status
    is_darpan_ok = darpan_res.get("success", False)
    is_fssai_ok = fssai_res.get("success", False)
    is_verified = is_darpan_ok and is_fssai_ok and name_matched

    if is_registered:
        if is_verified:
            overall_status = "VERIFIED"
            ngo.status = "verified"
            message = f"✓ NGO '{ngo.name}' is officially registered and 100% verified with active NITI Aayog Darpan ({clean_darpan}) and FSSAI license ({clean_fssai})."
        elif is_darpan_ok or is_fssai_ok:
            overall_status = "PARTIALLY_VERIFIED"
            ngo.status = "partially_verified"
            message = f"⚠ NGO '{ngo.name}' is registered, but only partially verified. (Darpan: {'Valid' if is_darpan_ok else 'Invalid'}, FSSAI: {'Valid' if is_fssai_ok else 'Invalid'})."
        else:
            overall_status = "NOT_VERIFIED"
            ngo.status = "not_verified"
            message = f"✗ NGO '{ngo.name}' is registered in database, but credentials could not be verified in official registries."

        db.commit()
        db.refresh(ngo)

        # Log verifications to audit history
        save_verification(db, ngo.id, darpan_res)
        save_verification(db, ngo.id, fssai_res)
    else:
        if is_verified:
            overall_status = "CREDENTIALS_VALID_UNREGISTERED"
            message = f"ℹ Credentials are legally valid and active, but organization '{clean_name}' is not yet registered in the local NGO directory."
        else:
            overall_status = "NOT_FOUND"
            message = f"✗ Organization '{clean_name}' is neither registered in local directory nor found with active credentials."

    ngo_dict = None
    if ngo:
        ngo_dict = {
            "id": ngo.id,
            "name": ngo.name,
            "email": ngo.email,
            "phone": ngo.phone,
            "address": ngo.address,
            "darpan_id": ngo.darpan_id,
            "fssai_number": ngo.fssai_number,
            "status": ngo.status,
            "registered_at": ngo.created_at.isoformat() if ngo.created_at else None
        }

    return {
        "success": True,
        "is_registered": is_registered,
        "is_verified": is_verified,
        "overall_status": overall_status,
        "message": message,
        "ngo": ngo_dict,
        "darpan_result": darpan_res,
        "fssai_result": fssai_res,
        "name_matched": name_matched
    }
