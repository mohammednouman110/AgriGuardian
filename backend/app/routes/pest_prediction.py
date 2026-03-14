from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import joblib
import numpy as np
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.main import get_current_user

router = APIRouter()

class PestPredictionRequest(BaseModel):
    temperature: float
    humidity: float
    rainfall: float
    crop_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

# Mock pest prediction model
def load_pest_model():
    # In production, load trained RandomForest or XGBoost model
    class MockPestModel:
        def predict_proba(self, features):
            # Mock prediction based on conditions
            temp, hum, rain = features[0], features[1], features[2]
            # High risk if high humidity and moderate temperature
            if hum > 70 and 20 <= temp <= 30:
                risk_prob = 0.8
            elif hum > 60 and rain > 50:
                risk_prob = 0.6
            else:
                risk_prob = 0.2
            return np.array([[1 - risk_prob, risk_prob]])

    return MockPestModel()

model = load_pest_model()

PEST_TYPES = {
    "rice": ["Brown Plant Hopper", "Rice Stem Borer", "Rice Leaf Folder"],
    "wheat": ["Wheat Aphid", "Hessian Fly", "Wheat Stem Sawfly"],
    "cotton": ["Cotton Bollworm", "Pink Bollworm", "Whitefly"],
    "tomato": ["Tomato Fruitworm", "Aphids", "Whiteflies"],
    "maize": ["Fall Armyworm", "Corn Borer", "Corn Earworm"]
}

@router.post("/predict")
async def predict_pest_risk(
    request: PestPredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Prepare features
    features = np.array([[request.temperature, request.humidity, request.rainfall]])

    # Predict risk probability
    probabilities = model.predict_proba(features)
    risk_probability = probabilities[0][1]

    # Determine risk level
    if risk_probability > 0.7:
        risk_level = "high"
        alert_message = f"⚠ High pest risk expected within 3 days for {request.crop_type}."
    elif risk_probability > 0.4:
        risk_level = "medium"
        alert_message = f"⚠ Medium pest risk expected within 5 days for {request.crop_type}."
    else:
        risk_level = "low"
        alert_message = f"✓ Low pest risk for {request.crop_type}."

    # Get potential pests for crop
    potential_pests = PEST_TYPES.get(request.crop_type.lower(), ["General pests"])

    # Recommendations
    recommendations = []
    if risk_level == "high":
        recommendations = [
            "Apply preventive pesticides",
            "Monitor crops daily",
            "Use pheromone traps",
            "Consider biological control methods"
        ]
    elif risk_level == "medium":
        recommendations = [
            "Increase monitoring frequency",
            "Prepare pest control materials",
            "Check weather forecasts"
        ]
    else:
        recommendations = [
            "Continue regular monitoring",
            "Maintain good field sanitation"
        ]

    return {
        "risk_level": risk_level,
        "risk_probability": round(risk_probability * 100, 2),
        "alert_message": alert_message,
        "potential_pests": potential_pests,
        "recommendations": recommendations,
        "predicted_date": (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d")
    }