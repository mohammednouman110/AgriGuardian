from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string
import os
from twilio.rest import Client
from jose import JWTError, jwt

from app.database import get_db
from app.models.user import User, OTP, UserCreate, OTPCreate, OTPVerify, Token, TokenData
from app.utils.auth import create_access_token

router = APIRouter()

# Twilio client (mock for demo)
def send_otp_sms(phone_number: str, otp: str):
    # In production, use Twilio
    # account_sid = os.getenv('TWILIO_SID')
    # auth_token = os.getenv('TWILIO_TOKEN')
    # client = Client(account_sid, auth_token)
    # message = client.messages.create(
    #     body=f"Your AgriGuardian OTP is: {otp}",
    #     from_=os.getenv('TWILIO_PHONE'),
    #     to=phone_number
    # )
    print(f"SMS sent to {phone_number}: Your OTP is {otp}")
    return True

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

@router.post("/send-otp", response_model=dict)
async def send_otp(otp_request: OTPCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.phone_number == otp_request.phone_number).first()

    # Generate OTP
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    # Save OTP to database
    db_otp = OTP(
        phone_number=otp_request.phone_number,
        otp_code=otp_code,
        expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)

    # Send SMS (mock)
    send_otp_sms(otp_request.phone_number, otp_code)

    return {"message": "OTP sent successfully", "expires_in": 300}

@router.post("/verify-otp", response_model=Token)
async def verify_otp(otp_verify: OTPVerify, db: Session = Depends(get_db)):
    # Find OTP
    otp_record = db.query(OTP).filter(
        OTP.phone_number == otp_verify.phone_number,
        OTP.otp_code == otp_verify.otp_code,
        OTP.expires_at > datetime.utcnow()
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Check if user exists, if not create
    user = db.query(User).filter(User.phone_number == otp_verify.phone_number).first()
    if not user:
        # For first-time users, we need more info, but for demo we'll create with minimal info
        user = User(
            full_name="New User",
            phone_number=otp_verify.phone_number
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Delete used OTP
    db.delete(otp_record)
    db.commit()

    # Create access token
    access_token = create_access_token(data={"sub": user.phone_number})

    return Token(access_token=access_token, token_type="bearer")

@router.post("/register", response_model=User)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.phone_number == user_data.phone_number).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create user
    db_user = User(**user_data.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/profile", response_model=User)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user

@router.put("/profile", response_model=User)
async def update_profile(user_data: UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for key, value in user_data.dict().items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user