from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import requests
import json
from app.database import get_db
from app.models.user import User, CropHealthData
from app.main import get_current_user

router = APIRouter()

class SatelliteRequest(BaseModel):
    latitude: float
    longitude: float
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD

class CropHealthPoint(BaseModel):
    latitude: float
    longitude: float
    ndvi: float
    stress_level: str

# Mock Google Earth Engine API (in production, use actual GEE)
def get_ndvi_data(lat: float, lon: float, start_date: str, end_date: str):
    # Mock NDVI data - in reality, query Sentinel-2 data via GEE
    import random
    ndvi_values = []
    for i in range(10):  # Mock 10 data points
        ndvi = random.uniform(0.2, 0.8)
        stress_level = "healthy" if ndvi > 0.6 else "moderate" if ndvi > 0.4 else "high"
        ndvi_values.append({
            "latitude": lat + random.uniform(-0.01, 0.01),
            "longitude": lon + random.uniform(-0.01, 0.01),
            "ndvi": round(ndvi, 4),
            "stress_level": stress_level,
            "date": f"2024-03-{10+i:02d}"
        })
    return ndvi_values

@router.post("/ndvi")
async def get_crop_health(
    request: SatelliteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get NDVI data
    ndvi_data = get_ndvi_data(
        request.latitude,
        request.longitude,
        request.start_date,
        request.end_date
    )

    # Save to database
    for data_point in ndvi_data:
        health_data = CropHealthData(
            user_id=current_user.id,
            latitude=data_point["latitude"],
            longitude=data_point["longitude"],
            ndvi_value=data_point["ndvi"],
            stress_level=data_point["stress_level"]
        )
        db.add(health_data)
    db.commit()

    # Calculate summary
    avg_ndvi = sum(d["ndvi"] for d in ndvi_data) / len(ndvi_data)
    stress_counts = {
        "healthy": sum(1 for d in ndvi_data if d["stress_level"] == "healthy"),
        "moderate": sum(1 for d in ndvi_data if d["stress_level"] == "moderate"),
        "high": sum(1 for d in ndvi_data if d["stress_level"] == "high")
    }

    overall_health = "healthy" if avg_ndvi > 0.6 else "moderate" if avg_ndvi > 0.4 else "high"

    return {
        "average_ndvi": round(avg_ndvi, 4),
        "overall_health": overall_health,
        "stress_distribution": stress_counts,
        "data_points": ndvi_data,
        "recommendations": get_health_recommendations(overall_health)
    }

def get_health_recommendations(health_level: str) -> List[str]:
    if health_level == "healthy":
        return [
            "Continue current farming practices",
            "Monitor regularly for changes",
            "Maintain proper irrigation and fertilization"
        ]
    elif health_level == "moderate":
        return [
            "Increase monitoring frequency",
            "Check for pest or disease signs",
            "Consider additional fertilization",
            "Ensure proper irrigation"
        ]
    else:  # high stress
        return [
            "Immediate attention required",
            "Check for drought, pests, or diseases",
            "Apply appropriate treatments",
            "Consider consulting local agricultural expert",
            "Implement immediate irrigation if needed"
        ]

@router.get("/map-data")
async def get_map_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get recent crop health data for user
    recent_data = db.query(CropHealthData).filter(
        CropHealthData.user_id == current_user.id
    ).order_by(CropHealthData.captured_at.desc()).limit(100).all()

    return {
        "data_points": [
            {
                "latitude": data.latitude,
                "longitude": data.longitude,
                "ndvi": float(data.ndvi_value),
                "stress_level": data.stress_level,
                "date": data.captured_at.isoformat()
            } for data in recent_data
        ]
    }