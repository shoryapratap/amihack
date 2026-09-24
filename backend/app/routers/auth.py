from fastapi import APIRouter, HTTPException, status, Header
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any

from app.db.postgres import find_user_by_email, find_user_by_id, create_user_record
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    create_two_step_session,
    verify_two_step_code,
    dispatch_two_step_whatsapp,
    mask_phone_number
)

router = APIRouter(prefix="/auth", tags=["Authentication & 2-Step Verification"])

# =========================================================================
# Request & Response Schemas
# =========================================================================

class LoginRequest(BaseModel):
    email: str
    password: str
    two_step: bool = False  # Set to True to require 2-step verification code

class TwoStepVerifyRequest(BaseModel):
    session_token: str = Field(..., description="Session token returned from Step 1 login")
    code: str = Field(..., min_length=6, max_length=6, description="6-digit verification OTP code")

class ResendOTPRequest(BaseModel):
    session_token: str

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str
    password: str = Field(..., min_length=6)
    phone: Optional[str] = "+919829407512"
    role: str = "NGO"  # ADMIN, NGO, DRIVER
    # Optional NGO profile fields
    organization_name: Optional[str] = None
    darpan_id: Optional[str] = None
    fssai_number: Optional[str] = None
    address: Optional[str] = "Civil Lines, Jaipur"

# =========================================================================
# Helper: Format User Response
# =========================================================================

def _format_user_dict(user: Dict[str, Any]) -> dict:
    created = user.get("createdAt")
    if hasattr(created, "isoformat"):
        created = created.isoformat()
    return {
        "id": str(user.get("id")),
        "email": user.get("email"),
        "name": user.get("name"),
        "phone": user.get("phone"),
        "role": str(user.get("role")),
        "createdAt": created
    }

# =========================================================================
# 1. SIGNUP ENDPOINT (BCRYPT HASHING + POSTGRESQL + JWT)
# =========================================================================

@router.post("/signup", summary="User Registration with bcrypt & JWT")
def signup(payload: SignupRequest):
    # Check if email is already taken
    existing = find_user_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An account with email '{payload.email}' already exists."
        )

    # Secure bcrypt password hash
    hashed_pw = hash_password(payload.password)

    # Role validation
    clean_role = payload.role.upper()
    if clean_role not in ["ADMIN", "NGO", "DRIVER"]:
        clean_role = "NGO"

    # Create user record in PostgreSQL
    new_user = create_user_record(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        role=clean_role,
        password_hash=hashed_pw
    )

    # If NGO, also register recipient profile and sync to SQLite registry
    if clean_role == "NGO" and payload.darpan_id:
        try:
            from app.database import SessionLocal
            from app.models.ngo_models import NGO
            
            db_sql = SessionLocal()
            existing_ngo = db_sql.query(NGO).filter(NGO.darpan_id == payload.darpan_id.strip()).first()
            if not existing_ngo:
                new_ngo = NGO(
                    name=payload.organization_name or payload.name,
                    email=payload.email,
                    phone=payload.phone,
                    address=payload.address,
                    darpan_id=payload.darpan_id,
                    fssai_number=payload.fssai_number,
                    status="pending"
                )
                db_sql.add(new_ngo)
                db_sql.commit()
            db_sql.close()
        except Exception as e:
            print(f"[Auth] Notice syncing to NGO directory: {e}")

    # Generate JWT access token
    token = create_access_token({
        "sub": new_user["id"],
        "email": new_user["email"],
        "role": new_user["role"],
        "name": new_user["name"]
    })

    return {
        "success": True,
        "message": "User registered successfully.",
        "accessToken": token,
        "tokenType": "bearer",
        "user": _format_user_dict(new_user)
    }

# =========================================================================
# 2. LOGIN ENDPOINT (SUPPORTS DIRECT JWT & TWO-STEP VERIFICATION)
# =========================================================================

@router.post("/login", summary="Login with bcrypt & optional Two-Step Verification")
async def login(payload: LoginRequest):
    # Look up user in PostgreSQL
    user = find_user_by_email(payload.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Verify password with bcrypt
    is_valid_pw = verify_password(payload.password, user.get("passwordHash", ""))
    if not is_valid_pw:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # If Two-Step Verification is requested (Step 1 -> Dispatch OTP)
    if payload.two_step:
        phone = user.get("phone") or "+919829407512"
        session_token, otp_code = create_two_step_session(
            user_id=user["id"],
            email=user["email"],
            phone=phone
        )

        # Dispatch 6-digit OTP code to user's WhatsApp
        await dispatch_two_step_whatsapp(phone=phone, code=otp_code, user_name=user["name"])

        return {
            "success": True,
            "two_step_required": True,
            "session_token": session_token,
            "email": user["email"],
            "masked_phone": mask_phone_number(phone),
            "debug_otp": otp_code,  # Provided for easy evaluation in dev mode
            "message": f"Step 1 verified. A 6-digit Two-Step Verification code has been sent to {mask_phone_number(phone)} via WhatsApp."
        }

    # Standard Login (Issue JWT token directly)
    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
        "name": user["name"]
    })

    return {
        "success": True,
        "two_step_required": False,
        "accessToken": token,
        "tokenType": "bearer",
        "user": _format_user_dict(user)
    }

# =========================================================================
# 3. TWO-STEP VERIFICATION ENDPOINTS (STEP 2: OTP -> JWT)
# =========================================================================

@router.post("/2fa/start", summary="Initiate Two-Step Verification (Step 1)")
async def start_two_step(payload: LoginRequest):
    """Explicitly triggers two-step verification flow and sends OTP."""
    payload.two_step = True
    return await login(payload)

@router.post("/2fa/verify", summary="Verify Two-Step Code & Issue JWT Token (Step 2)")
def verify_two_step(payload: TwoStepVerifyRequest):
    """
    Step 2 of Two-Step Verification:
    Validates the 6-digit OTP code and issues the official JWT access token.
    """
    session = verify_two_step_code(payload.session_token, payload.code)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired Two-Step Verification code. Please check the code or request a new one."
        )

    user = find_user_by_id(session["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated user account was not found."
        )

    # Issue full JWT access token
    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
        "name": user["name"],
        "two_step_verified": True
    })

    return {
        "success": True,
        "message": "Two-Step Verification complete! Identity verified.",
        "accessToken": token,
        "tokenType": "bearer",
        "user": _format_user_dict(user)
    }

@router.post("/2fa/resend", summary="Resend Two-Step OTP Code")
async def resend_otp(payload: ResendOTPRequest):
    """Generates a fresh OTP code and resends via WhatsApp."""
    from app.services.auth_service import TWO_STEP_SESSIONS
    session = TWO_STEP_SESSIONS.get(payload.session_token)
    if not session:
        raise HTTPException(status_code=400, detail="Two-step session has expired or is invalid.")

    from app.services.auth_service import generate_otp_code, hash_password
    new_code = generate_otp_code()
    session["raw_code"] = new_code
    session["code_hash"] = hash_password(new_code)
    session["attempts"] = 0

    await dispatch_two_step_whatsapp(phone=session["phone"], code=new_code)

    return {
        "success": True,
        "message": f"A new 6-digit verification code was sent to {mask_phone_number(session['phone'])}.",
        "debug_otp": new_code
    }

# =========================================================================
# 4. GET ME (VALIDATES JWT TOKEN)
# =========================================================================

@router.get("/me", summary="Get Authenticated User from JWT Token")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Bearer token required."
        )

    token = authorization.split("Bearer ")[1].strip()
    try:
        payload = decode_access_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired JWT token: {str(e)}"
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT claims: missing subject identifier."
        )

    user = find_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in registry."
        )

    return {
        "success": True,
        "user": _format_user_dict(user)
    }
