# AgriGuardian AI – AI Co-Pilot for Farmers

A modern smart agriculture platform that helps farmers detect crop diseases early, predict pest outbreaks, monitor crop health using satellite imagery, and interact with an AI farming assistant using voice or chat.

## Features

- **AI Crop Disease Detection**: Upload leaf images to detect diseases using CNN models
- **Satellite Crop Stress Detection**: Monitor crop health with NDVI from Sentinel-2 data
- **Pest Outbreak Prediction**: ML models predict pest risks based on weather data
- **AI Chatbot**: Get farming advice in simple language
- **Voice AI Assistant**: Voice interaction in multiple languages (English, Hindi, Kannada, Telugu, Tamil)
- **Offline Mode**: Local disease detection and cached knowledge
- **Smart Pest Risk Map**: Interactive maps showing outbreak zones
- **IoT Integration**: Dashboard for sensor data
- **Farmer Community**: Report and share pest alerts
- **Passwordless Authentication**: OTP-based login via phone number

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React.js with Next.js
- **Database**: PostgreSQL
- **ML**: TensorFlow, Scikit-learn
- **Maps**: Leaflet.js
- **Satellite**: Google Earth Engine API
- **Voice**: Whisper, gTTS
- **Deployment**: Docker, AWS

## Project Structure

```
AgriGuardian/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Main FastAPI app
│   │   ├── models/         # Pydantic models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Frontend utilities
│   ├── package.json
│   └── Dockerfile
├── ml/                      # Machine learning models
│   ├── models/             # Trained models
│   └── notebooks/          # Jupyter notebooks
├── database/                # Database schemas
├── docs/                    # Documentation
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Docker (optional)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables (create .env file):
   ```
   DATABASE_URL=postgresql://user:password@localhost/agri_guardian
   SECRET_KEY=your-secret-key
   GOOGLE_EARTH_ENGINE_PROJECT=your-gee-project
   TWILIO_SID=your-twilio-sid
   TWILIO_TOKEN=your-twilio-token
   TWILIO_PHONE=your-twilio-phone
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE agri_guardian;
   ```

2. Run the schema:
   ```bash
   psql -d agri_guardian -f database/schema.sql
   ```

### ML Models

1. Navigate to ml directory:
   ```bash
   cd ml
   ```

2. Train disease detection model:
   ```bash
   python notebooks/train_disease_model.py
   ```

3. Train pest prediction model:
   ```bash
   python notebooks/train_pest_model.py
   ```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Deployment

### Using Docker

1. Build and run backend:
   ```bash
   cd backend
   docker build -t agriguardian-backend .
   docker run -p 8000:8000 agriguardian-backend
   ```

2. Build and run frontend:
   ```bash
   cd frontend
   docker build -t agriguardian-frontend .
   docker run -p 3000:3000 agriguardian-frontend
   ```

### AWS Deployment

- Backend: Deploy to AWS Lambda or EC2
- Frontend: Deploy to AWS S3 + CloudFront
- Database: AWS RDS PostgreSQL
- ML Models: AWS SageMaker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Contact

For questions or support, please contact the development team.