from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, ARRAY, Text, Boolean
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.database import Base

# SQLAlchemy Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    village = Column(String(255))
    preferred_language = Column(String(50), default="english")
    farm_size = Column(DECIMAL(10, 2))
    crops_grown = Column(ARRAY(String))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(20), nullable=False)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PestReport(Base):
    __tablename__ = "pest_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    pest_type = Column(String(255))
    severity = Column(String(20))
    description = Column(Text)
    image_url = Column(String(500))
    reported_at = Column(DateTime(timezone=True), server_default=func.now())

class CropHealthData(Base):
    __tablename__ = "crop_health_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    ndvi_value = Column(DECIMAL(5, 4))
    stress_level = Column(String(20))
    captured_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    message = Column(Text, nullable=False)
    response = Column(Text)
    is_voice = Column(Boolean, default=False)
    language = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Models
class UserBase(BaseModel):
    full_name: str
    phone_number: str
    village: Optional[str] = None
    preferred_language: str = "english"
    farm_size: Optional[float] = None
    crops_grown: Optional[List[str]] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class OTPCreate(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    otp_code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone_number: Optional[str] = None