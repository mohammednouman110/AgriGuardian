from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User, ChatHistory
from app.main import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: str = "english"

class VoiceQueryRequest(BaseModel):
    audio_data: str  # Base64 encoded audio
    language: str = "english"

# Mock chatbot responses
CHAT_RESPONSES = {
    "yellow leaves": "Yellow leaves can indicate nitrogen deficiency, overwatering, or pest problems. Check soil moisture and consider adding nitrogen-rich fertilizer.",
    "brown spots": "Brown spots on leaves often indicate fungal diseases like early blight. Remove affected leaves and apply copper-based fungicide.",
    "wilting": "Wilting can be caused by underwatering, root rot, or vascular diseases. Check soil moisture and drainage.",
    "holes in leaves": "Holes in leaves are usually caused by insect pests. Look for caterpillars or beetles and use appropriate insecticides.",
    "fertilizer": "For most crops, use NPK 10-10-10 fertilizer. Apply every 2-3 weeks during growing season.",
    "watering": "Water deeply but infrequently to encourage deep root growth. Check soil moisture 2 inches deep before watering.",
    "pests": "Common pests include aphids, caterpillars, and mites. Use neem oil or insecticidal soap for organic control.",
    "disease": "Many plant diseases can be prevented with proper spacing, good air circulation, and crop rotation."
}

def get_chatbot_response(message: str, language: str = "english") -> str:
    message_lower = message.lower()

    # Simple keyword matching
    for keyword, response in CHAT_RESPONSES.items():
        if keyword in message_lower:
            return response

    # Default response
    return "I'm here to help with your farming questions. Please provide more details about your crop problem or question."

@router.post("/chat")
async def chat_with_bot(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response = get_chatbot_response(request.message, request.language)

    # Save to chat history
    chat_entry = ChatHistory(
        user_id=current_user.id,
        message=request.message,
        response=response,
        language=request.language
    )
    db.add(chat_entry)
    db.commit()

    return {
        "response": response,
        "language": request.language
    }

@router.post("/voice-query")
async def voice_query(
    request: VoiceQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mock speech-to-text (in production, use Whisper)
    # For demo, assume the audio is transcribed to text
    transcribed_text = "What fertilizer should I use for rice?"  # Mock transcription

    response = get_chatbot_response(transcribed_text, request.language)

    # Mock text-to-speech (in production, use gTTS)
    # Return audio data or URL
    audio_response = f"Audio response for: {response}"  # Mock

    # Save to chat history
    chat_entry = ChatHistory(
        user_id=current_user.id,
        message=transcribed_text,
        response=response,
        is_voice=True,
        language=request.language
    )
    db.add(chat_entry)
    db.commit()

    return {
        "transcribed_text": transcribed_text,
        "response": response,
        "audio_response": audio_response,
        "language": request.language
    }

@router.get("/history")
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).order_by(ChatHistory.created_at.desc()).limit(50).all()
    return {"history": history}