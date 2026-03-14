from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from jose import jwt

from app.database import get_db, engine
from app.models import user as user_model
from app.routes import auth, disease_detection, pest_prediction, chatbot, satellite, reports

# Load environment variables
load_dotenv()

# Create database tables
user_model.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriGuardian AI API",
    description="AI Co-Pilot for Farmers - Smart Agriculture Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(disease_detection.router, prefix="/disease", tags=["Disease Detection"])
app.include_router(pest_prediction.router, prefix="/pest", tags=["Pest Prediction"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])
app.include_router(satellite.router, prefix="/satellite", tags=["Satellite"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {"message": "Welcome to AgriGuardian AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        phone_number: str = payload.get("sub")
        if phone_number is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(user_model.User).filter(user_model.User.phone_number == phone_number).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)