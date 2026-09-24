from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    NGO = "NGO"
    DRIVER = "DRIVER"

class VerificationStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class DietaryTypeEnum(str, Enum):
    VEG = "VEG"
    NON_VEG = "NON_VEG"
    BOTH = "BOTH"

class FoodTypeEnum(str, Enum):
    VEG_COOKED = "VEG_COOKED"
    NON_VEG_COOKED = "NON_VEG_COOKED"
    PACKAGED_GROCERY = "PACKAGED_GROCERY"
    RAW_PRODUCE = "RAW_PRODUCE"
    BAKERY = "BAKERY"
    DAIRY = "DAIRY"

class DonationStatusEnum(str, Enum):
    PENDING = "PENDING"
    MATCHED = "MATCHED"
    ACCEPTED = "ACCEPTED"
    PICKED_UP = "PICKED_UP"
    DELIVERED = "DELIVERED"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"

# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: RoleEnum = RoleEnum.NGO
    # NGO fields
    organizationName: Optional[str] = None
    registrationNumber: Optional[str] = None
    fssaiNumber: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacityMeals: Optional[int] = 100
    dietaryPreference: Optional[DietaryTypeEnum] = DietaryTypeEnum.BOTH
    # Driver fields
    vehicleType: Optional[str] = "TWO_WHEELER"
    vehicleNumber: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: RoleEnum
    createdAt: datetime

class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: UserResponse

# Donation Schemas
class DonationCreate(BaseModel):
    donorName: str
    donorPhone: str
    foodTitle: str
    foodType: FoodTypeEnum = FoodTypeEnum.VEG_COOKED
    quantityKg: float
    estimatedMeals: int
    safeUntil: datetime
    pickupAddress: str
    pickupLat: float
    pickupLng: float
    notes: Optional[str] = None
    rawMessageText: Optional[str] = None

class DonationResponse(BaseModel):
    id: str
    donorId: str
    donorName: Optional[str] = None
    foodTitle: str
    foodType: FoodTypeEnum
    quantityKg: float
    estimatedMeals: int
    safeUntil: datetime
    pickupAddress: str
    pickupLat: float
    pickupLng: float
    notes: Optional[str] = None
    status: DonationStatusEnum
    submissionTimestamp: datetime
    createdAt: datetime

# Recipient / NGO Schemas
class RecipientResponse(BaseModel):
    id: str
    userId: str
    organizationName: str
    registrationNumber: str
    fssaiNumber: Optional[str] = None
    address: str
    latitude: float
    longitude: float
    capacityMeals: int
    dietaryPreference: DietaryTypeEnum
    contactPerson: str
    phone: str
    verificationStatus: VerificationStatusEnum
    verifiedAt: Optional[datetime] = None
    rejectionReason: Optional[str] = None
    createdAt: datetime

class RecipientReviewAction(BaseModel):
    decision: VerificationStatusEnum # APPROVED or REJECTED
    rejectionReason: Optional[str] = None

# Driver Schemas
class DriverResponse(BaseModel):
    id: str
    userId: str
    fullName: str
    phone: str
    vehicleType: str
    vehicleNumber: Optional[str] = None
    isAvailable: bool
    isOtpVerified: bool
    currentLat: Optional[float] = None
    currentLng: Optional[float] = None
    createdAt: datetime

# Matching Schemas
class MatchResponse(BaseModel):
    id: str
    donationId: str
    recipientId: str
    recipientName: Optional[str] = None
    score: float
    distanceKm: float
    capacityFitScore: float
    urgencyScore: float
    status: str
    proposedAt: datetime

# Certificate Schemas
class CertificateResponse(BaseModel):
    id: str
    donationId: str
    recipientId: str
    donorName: str
    recipientName: str
    donorSubmissionTimestamp: datetime
    ngoAcceptanceTimestamp: datetime
    fssaiClauseCited: str
    verificationUrl: str
    qrCodeData: str
    issuedAt: datetime
    isValid: bool

# WhatsApp Webhook Schemas
class WhatsAppInboundMessage(BaseModel):
    From: str
    Body: str
    NumMedia: Optional[str] = "0"
    MediaUrl0: Optional[str] = None
    MediaContentType0: Optional[str] = None
