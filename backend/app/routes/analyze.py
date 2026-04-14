from fastapi import APIRouter
from pydantic import BaseModel

from app.services.fake_news import analyze_fake_news
from app.services.ai_detector import detect_ai_content

router = APIRouter()


class AnalyzeRequest(BaseModel):
    text: str


@router.post("/")
async def analyze_text(req: AnalyzeRequest):
    text = req.text

    # 🔹 AI Detection
    ai_result = await detect_ai_content(text)

    # 🔹 Fake News Detection (THIS IS WHERE YOUR FIX IS USED)
    fake_result = analyze_fake_news(text)

    print("🔥 FINAL FAKE RESULT:", fake_result)   # DEBUG

    return {
        "ai": ai_result,
        "fake": fake_result
    }