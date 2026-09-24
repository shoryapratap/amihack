from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base

class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    darpan_id = Column(String(100), unique=True, nullable=True, index=True)
    fssai_number = Column(String(100), unique=True, nullable=True, index=True)
    status = Column(String(50), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    verifications = relationship(
        "Verification",
        back_populates="ngo",
        cascade="all, delete-orphan"
    )

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    verification_type = Column(String(50), nullable=False)
    identifier = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    source = Column(String(100), nullable=False)
    message = Column(Text, nullable=True)
    organization_name = Column(String(255), nullable=True)
    license_status = Column(String(100), nullable=True)
    raw_data = Column(Text, nullable=True)
    fallback_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    ngo = relationship("NGO", back_populates="verifications")
