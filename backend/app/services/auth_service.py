import os
import uuid
import random
import bcrypt
import jwt
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Tuple

from app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory storage for active Two-Step Verification (2FA) sessions
# Format: session_token -> { user_id, email, phone, code_hash, raw_code, expires_at, attempts }
TWO_STEP_SESSIONS: Dict[str, Dict[str, Any]] = {}

# =========================================================================
# 1. BCRYPT PASSWORD HASHING & VERIFICATION
# =========================================================================

def hash_password(plain_password: str) -> str:
    """
    Hashes a plaintext password using bcrypt with a secure cost factor (12 rounds).
    """
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a bcrypt hashed password.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception as e:
        logger.error(f"bcrypt verification error: {e}")
        return False

# =========================================================================
# 2. JWT ACCESS TOKEN GENERATION & DECODING
# =========================================================================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a signed JWT access token containing claims and expiration.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "iss": settings.APP_NAME
    })
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> dict:
    """
    Decodes and validates a JWT access token.
    Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError if invalid.
    """
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

# =========================================================================
# 3. TWO-STEP VERIFICATION (2FA OTP) ENGINE
# =========================================================================

def generate_otp_code() -> str:
    """Generates a secure 6-digit numeric OTP code."""
    return f"{random.randint(100000, 999999)}"

def create_two_step_session(user_id: str, email: str, phone: str) -> Tuple[str, str]:
    """
    Initiates a Two-Step Verification session.
    Generates a session token and a 6-digit OTP code, valid for 5 minutes.
    """
    session_token = f"2fa_{uuid.uuid4().hex}"
    code = generate_otp_code()
    
    # Store bcrypt hash of code along with raw code for audit
    code_hash = hash_password(code)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    TWO_STEP_SESSIONS[session_token] = {
        "user_id": user_id,
        "email": email,
        "phone": phone,
        "code_hash": code_hash,
        "raw_code": code,
        "expires_at": expires_at,
        "attempts": 0
    }
    
    logger.info(f"[2FA] Session created for {email}. Session: {session_token}, OTP Code: {code}")
    return session_token, code

def verify_two_step_code(session_token: str, code: str) -> Optional[Dict[str, Any]]:
    """
    Validates a submitted 6-digit OTP against the 2FA session.
    Returns session dict if valid, or None if expired/invalid.
    """
    session = TWO_STEP_SESSIONS.get(session_token)
    if not session:
        logger.warning(f"[2FA] Invalid or unknown session token: {session_token}")
        return None
    
    # Check expiration
    if datetime.now(timezone.utc) > session["expires_at"]:
        logger.warning(f"[2FA] Session expired for {session['email']}")
        TWO_STEP_SESSIONS.pop(session_token, None)
        return None
    
    # Check max attempts (rate limiting)
    session["attempts"] += 1
    if session["attempts"] > 5:
        logger.warning(f"[2FA] Too many failed attempts for {session['email']}")
        TWO_STEP_SESSIONS.pop(session_token, None)
        return None
    
    clean_code = str(code).strip()
    
    # Verify using bcrypt checkpw
    if verify_password(clean_code, session["code_hash"]) or clean_code == session["raw_code"]:
        # Pop session so code cannot be reused (replay prevention)
        return TWO_STEP_SESSIONS.pop(session_token)
    
    return None

async def dispatch_two_step_whatsapp(phone: str, code: str, user_name: str = "Partner") -> dict:
    """
    Sends the 6-digit OTP code directly to the user's WhatsApp number via Twilio.
    """
    from app.services.twilio_service import send_twilio_whatsapp
    
    target_phone = phone or settings.DEFAULT_RESTAURANT_NUMBER
    msg = (
        f"🔐 Surplus-to-Shelter Security Verification\n\n"
        f"Namaste {user_name}! 🙏\n"
        f"Your 2-Step Login Code is: *{code}*\n\n"
        f"• Code valid for 5 minutes.\n"
        f"• Do NOT share this code with anyone.\n\n"
        f"If you did not attempt to sign in, please disregard this message."
    )
    
    try:
        res = await send_twilio_whatsapp(to_number=target_phone, message=msg)
        logger.info(f"[2FA] WhatsApp OTP dispatched to {target_phone}. Status: {res.get('status')}")
        return res
    except Exception as e:
        logger.error(f"[2FA] Failed to send WhatsApp OTP: {e}")
        return {"success": False, "error": str(e)}

def mask_phone_number(phone: str) -> str:
    """Masks phone number for security in API responses (e.g. +91******7512)."""
    if not phone or len(phone) < 6:
        return "+91******7512"
    clean = phone.strip()
    return f"{clean[:3]}******{clean[-4:]}"
