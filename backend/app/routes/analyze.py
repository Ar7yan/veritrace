from fastapi import APIRouter
from pydantic import BaseModel

from app.services.fake_news import analyze_fake_news
from app.services.ai_detector import detect_ai_content
from app.services.search import search_propagation

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/")
async def analyze_text(req: AnalyzeRequest):
    text = req.text

    ai_result = await detect_ai_content(text)
    fake_result = analyze_fake_news(text)
    search_result = await search_propagation(text)

    return {
        "ai": ai_result,
        "fake": fake_result,
        "propagation": search_result
    }