from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from PIL import Image
import io
import numpy as np
import tensorflow as tf
from app.database import get_db
from app.models.user import User
from app.main import get_current_user

router = APIRouter()

# Load disease detection model (mock for demo)
# In production, load a trained EfficientNet model
def load_disease_model():
    # Mock model - in reality, load from ml/models/
    class MockModel:
        def predict(self, img):
            # Mock predictions
            diseases = [
                "Healthy",
                "Bacterial Spot",
                "Early Blight",
                "Late Blight",
                "Leaf Mold",
                "Septoria Leaf Spot",
                "Spider Mites",
                "Target Spot",
                "Tomato Yellow Leaf Curl Virus",
                "Tomato Mosaic Virus"
            ]
            # Random prediction for demo
            import random
            disease = random.choice(diseases)
            confidence = random.uniform(0.7, 0.95)
            return disease, confidence

    return MockModel()

model = load_disease_model()

# Treatment recommendations
TREATMENTS = {
    "Healthy": "No treatment needed. Continue good farming practices.",
    "Bacterial Spot": "Apply copper-based fungicides. Remove infected leaves. Improve air circulation.",
    "Early Blight": "Use fungicides containing chlorothalonil or mancozeb. Mulch around plants.",
    "Late Blight": "Apply fungicides immediately. Remove infected plants. Improve drainage.",
    "Leaf Mold": "Increase ventilation. Apply fungicides. Avoid overhead watering.",
    "Septoria Leaf Spot": "Remove infected leaves. Apply fungicides. Rotate crops.",
    "Spider Mites": "Use insecticidal soap or neem oil. Increase humidity.",
    "Target Spot": "Apply fungicides. Remove infected plant debris. Rotate crops.",
    "Tomato Yellow Leaf Curl Virus": "Remove infected plants. Control whitefly vectors. Use resistant varieties.",
    "Tomato Mosaic Virus": "Remove infected plants. Disinfect tools. Use virus-free seeds."
}

ORGANIC_PESTICIDES = {
    "Bacterial Spot": "Neem oil spray, copper fungicide",
    "Early Blight": "Baking soda spray, compost tea",
    "Late Blight": "Copper fungicide, milk spray",
    "Leaf Mold": "Baking soda solution, neem oil",
    "Septoria Leaf Spot": "Neem oil, compost extract",
    "Spider Mites": "Neem oil, insecticidal soap",
    "Target Spot": "Copper spray, neem oil",
    "Tomato Yellow Leaf Curl Virus": "Neem oil for whiteflies",
    "Tomato Mosaic Virus": "Neem oil, diatomaceous earth"
}

@router.post("/detect")
async def detect_disease(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Preprocess image (resize to 224x224 for EfficientNet)
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict disease
    disease, confidence = model.predict(img_array)

    # Get treatment
    treatment = TREATMENTS.get(disease, "Consult local agricultural expert")
    organic_pesticide = ORGANIC_PESTICIDES.get(disease, "Neem oil or consult expert")

    return {
        "disease": disease,
        "confidence": round(confidence * 100, 2),
        "treatment": treatment,
        "organic_pesticide": organic_pesticide,
        "recommendation": "If confidence is low, please try again with a clearer image or consult a local expert."
    }