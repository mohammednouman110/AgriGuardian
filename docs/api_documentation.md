# AgriGuardian AI API Documentation

## Overview

AgriGuardian AI provides RESTful APIs for smart agriculture applications. The API is built with FastAPI and includes authentication, disease detection, pest prediction, and satellite data integration.

Base URL: `http://localhost:8000` (development)

## Authentication

All API endpoints except authentication require JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Send OTP
Send OTP to phone number for authentication.

**Endpoint:** `POST /auth/send-otp`

**Request Body:**
```json
{
  "phone_number": "string"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "expires_in": 300
}
```

### Verify OTP
Verify OTP and get access token.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phone_number": "string",
  "otp_code": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

### Get Profile
Get user profile information.

**Endpoint:** `GET /auth/profile`

**Response:**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "village": "Sample Village",
  "preferred_language": "english",
  "farm_size": 5.5,
  "crops_grown": ["rice", "wheat"],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Profile
Update user profile information.

**Endpoint:** `PUT /auth/profile`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "village": "New Village",
  "preferred_language": "hindi",
  "farm_size": 6.0,
  "crops_grown": ["rice", "wheat", "tomato"]
}
```

## Disease Detection

### Detect Disease
Upload an image to detect crop diseases.

**Endpoint:** `POST /disease/detect`

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file`: Image file (JPEG/PNG)

**Response:**
```json
{
  "disease": "Early Blight",
  "confidence": 87.5,
  "treatment": "Apply copper-based fungicides. Remove infected leaves.",
  "organic_pesticide": "Neem oil spray, baking soda solution",
  "recommendation": "If confidence is low, please try again with a clearer image."
}
```

## Pest Prediction

### Predict Pest Risk
Predict pest outbreak risk based on weather conditions.

**Endpoint:** `POST /pest/predict`

**Request Body:**
```json
{
  "temperature": 28.5,
  "humidity": 75.0,
  "rainfall": 12.5,
  "crop_type": "tomato",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

**Response:**
```json
{
  "risk_level": "high",
  "risk_probability": 82.3,
  "alert_message": "⚠ High pest risk expected within 3 days.",
  "potential_pests": ["Aphids", "Whiteflies"],
  "recommendations": [
    "Apply preventive pesticides",
    "Monitor crops daily",
    "Use pheromone traps"
  ],
  "predicted_date": "2024-03-16"
}
```

## Chatbot

### Chat with AI
Send a message to the agricultural chatbot.

**Endpoint:** `POST /chatbot/chat`

**Request Body:**
```json
{
  "message": "Why are my tomato leaves turning yellow?",
  "language": "english"
}
```

**Response:**
```json
{
  "response": "Yellow leaves can indicate nitrogen deficiency, overwatering, or pest problems. Check soil moisture and consider adding nitrogen-rich fertilizer.",
  "language": "english"
}
```

### Voice Query
Process voice queries (speech-to-text + AI response).

**Endpoint:** `POST /chatbot/voice-query`

**Request Body:**
```json
{
  "audio_data": "base64_encoded_audio",
  "language": "english"
}
```

**Response:**
```json
{
  "transcribed_text": "Why are my tomato leaves turning yellow?",
  "response": "Yellow leaves can indicate nitrogen deficiency...",
  "audio_response": "base64_encoded_audio_response",
  "language": "english"
}
```

### Get Chat History
Get user's chat history.

**Endpoint:** `GET /chatbot/history`

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "message": "Why are my tomato leaves turning yellow?",
      "response": "Yellow leaves can indicate...",
      "is_voice": false,
      "language": "english",
      "created_at": "2024-03-14T10:00:00Z"
    }
  ]
}
```

## Satellite Data

### Get Crop Health (NDVI)
Get NDVI data for crop health monitoring.

**Endpoint:** `POST /satellite/ndvi`

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "start_date": "2024-03-01",
  "end_date": "2024-03-14"
}
```

**Response:**
```json
{
  "average_ndvi": 0.68,
  "overall_health": "healthy",
  "stress_distribution": {
    "healthy": 7,
    "moderate": 2,
    "high": 1
  },
  "data_points": [
    {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "ndvi": 0.72,
      "stress_level": "healthy",
      "date": "2024-03-14"
    }
  ],
  "recommendations": [
    "Continue current farming practices",
    "Monitor regularly for changes"
  ]
}
```

### Get Map Data
Get crop health data for map visualization.

**Endpoint:** `GET /satellite/map-data`

**Response:**
```json
{
  "data_points": [
    {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "ndvi": 0.72,
      "stress_level": "healthy",
      "date": "2024-03-14T00:00:00Z"
    }
  ]
}
```

## Reports

### Report Pest Outbreak
Report a pest outbreak in the area.

**Endpoint:** `POST /reports/pest`

**Request Body:**
```json
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "pest_type": "Aphids",
  "severity": "high",
  "description": "Heavy aphid infestation on tomato crops",
  "image_url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "message": "Pest report submitted successfully",
  "report_id": 123,
  "alert_message": "Pest alert sent to nearby farmers within 5km radius"
}
```

### Get Pest Alerts
Get pest alerts in the user's area.

**Endpoint:** `GET /reports/pest-alerts?latitude=12.9716&longitude=77.5946&radius_km=5`

**Response:**
```json
{
  "alerts": [
    {
      "id": 1,
      "pest_type": "Aphids",
      "severity": "high",
      "description": "Heavy infestation reported",
      "latitude": 12.9816,
      "longitude": 77.6046,
      "distance_km": 1.2,
      "reported_at": "2024-03-14T10:00:00Z",
      "recommendations": [
        "Apply neem oil spray",
        "Introduce ladybugs"
      ]
    }
  ],
  "total_alerts": 1,
  "radius_km": 5
}
```

### Get Farm Dashboard
Get comprehensive farm dashboard data.

**Endpoint:** `GET /reports/dashboard`

**Response:**
```json
{
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
    }
  ],
  "recommendations": [
    "Monitor tomato fields for aphids",
    "Irrigate rice fields in evening"
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid input data"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Invalid token"
}
```

**404 Not Found:**
```json
{
  "detail": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- API endpoints: 100 requests per minute per user
- Image upload: 10 requests per minute per user

## Data Formats

- Dates: ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- Coordinates: Decimal degrees (latitude, longitude)
- Images: JPEG/PNG formats, max 10MB
- Languages: english, hindi, kannada, telugu, tamil

## WebSocket Support

Real-time pest alerts are available via WebSocket at `/ws/alerts`

## Versioning

API version is included in the URL path: `/v1/...`

Current version: v1