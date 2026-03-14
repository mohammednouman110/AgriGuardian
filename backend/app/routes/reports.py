from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.user import User, PestReport
from app.main import get_current_user

router = APIRouter()

class PestReportRequest(BaseModel):
    latitude: float
    longitude: float
    pest_type: str
    severity: str  # low, medium, high
    description: str
    image_url: Optional[str] = None

@router.post("/pest")
async def report_pest(
    request: PestReportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create pest report
    report = PestReport(
        user_id=current_user.id,
        latitude=request.latitude,
        longitude=request.longitude,
        pest_type=request.pest_type,
        severity=request.severity,
        description=request.description,
        image_url=request.image_url
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "message": "Pest report submitted successfully",
        "report_id": report.id,
        "alert_message": f"Pest alert sent to nearby farmers within 5km radius"
    }

@router.get("/pest-alerts")
async def get_pest_alerts(
    latitude: float,
    longitude: float,
    radius_km: float = 5.0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mock nearby pest reports (in production, use geospatial query)
    # For demo, return some mock alerts
    mock_alerts = [
        {
            "id": 1,
            "pest_type": "Aphids",
            "severity": "high",
            "description": "Heavy aphid infestation on tomato crops",
            "latitude": latitude + 0.01,
            "longitude": longitude + 0.01,
            "distance_km": 1.2,
            "reported_at": "2024-03-14T10:00:00Z",
            "recommendations": ["Apply neem oil spray", "Introduce ladybugs", "Remove heavily infested leaves"]
        },
        {
            "id": 2,
            "pest_type": "Whiteflies",
            "severity": "medium",
            "description": "Whitefly population increasing",
            "latitude": latitude - 0.005,
            "longitude": longitude + 0.008,
            "distance_km": 0.8,
            "reported_at": "2024-03-13T15:30:00Z",
            "recommendations": ["Use yellow sticky traps", "Apply insecticidal soap"]
        }
    ]

    return {
        "alerts": mock_alerts,
        "total_alerts": len(mock_alerts),
        "radius_km": radius_km
    }

@router.get("/dashboard")
async def get_farm_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mock dashboard data
    return {
        "weather": {
            "temperature": 28.5,
            "humidity": 65,
            "rainfall_today": 0.0,
            "forecast": "Sunny with occasional clouds"
        },
        "crop_health_summary": {
            "average_ndvi": 0.68,
            "overall_status": "healthy",
            "stress_areas": 2
        },
        "pest_alerts": {
            "active_alerts": 3,
            "high_risk_zones": 1
        },
        "recent_reports": [
            {
                "type": "pest_report",
                "message": "Aphid outbreak reported 2km away",
                "timestamp": "2024-03-14T08:00:00Z"
            },
            {
                "type": "health_check",
                "message": "Crop health: 72% healthy areas",
                "timestamp": "2024-03-13T14:00:00Z"
            }
        ],
        "recommendations": [
            "Monitor tomato fields for aphids",
            "Irrigate rice fields in evening",
            "Apply nitrogen fertilizer to wheat"
        ]
    }