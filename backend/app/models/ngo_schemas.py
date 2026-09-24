from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict

# ==========================================
# NGO CRUD Schemas
# ==========================================

class NGOCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    darpan_id: Optional[str] = None
    fssai_number: Optional[str] = None

class NGOUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    darpan_id: Optional[str] = None
    fssai_number: Optional[str] = None

class NGOResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    darpan_id: Optional[str] = None
    fssai_number: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

# ==========================================
# Single Identifier Verification Requests
# ==========================================

class DarpanVerificationRequest(BaseModel):
    darpan_id: str = Field(..., min_length=3, max_length=100)

class FSSAIVerificationRequest(BaseModel):
    fssai_number: str = Field(..., min_length=5, max_length=100)

class NGOVerificationRequest(BaseModel):
    verify_darpan: bool = True
    verify_fssai: bool = True

# ==========================================
# Combined 3-Field NGO Credentials Request
# ==========================================

class VerifyNGOCredentialsRequest(BaseModel):
    name: str = Field(..., min_length=2, description="NGO or Organization Legal Name")
    darpan_id: str = Field(..., min_length=3, description="NITI Aayog NGO Darpan Registration ID (e.g. DL/2026/000001)")
    fssai_number: str = Field(..., min_length=5, description="FSSAI 14-digit License or Registration number")

# ==========================================
# Verification Results
# ==========================================

class VerificationResult(BaseModel):
    success: bool
    verification_type: str
    identifier: str
    status: str
    source: str
    organization_name: Optional[str] = None
    license_status: Optional[str] = None
    message: Optional[str] = None
    fallback_used: bool = False
    verified_at: datetime

class VerificationHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ngo_id: int
    verification_type: str
    identifier: str
    status: str
    source: str
    message: Optional[str] = None
    organization_name: Optional[str] = None
    license_status: Optional[str] = None
    fallback_used: bool = False
    created_at: datetime

class VerifyNGOCredentialsResponse(BaseModel):
    success: bool
    is_registered: bool
    is_verified: bool
    overall_status: str
    message: str
    ngo: Optional[dict] = None
    darpan_result: dict
    fssai_result: dict
    name_matched: bool
