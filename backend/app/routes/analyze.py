from fastapi import APIRouter
from pydantic import BaseModel

from app.services.fake_news import analyze_fake_news
from app.services.ai_detector import detect_ai_content
from app.services.web_search import search_propagation  # ✅ FIXED IMPORT

router = APIRouter()


class AnalyzeRequest(BaseModel):
    text: str


@router.post("/")
async def analyze_text(req: AnalyzeRequest):
    text = req.text

    # 🔹 AI Detection
    ai_result = await detect_ai_content(text)

    # 🔹 Fake News Detection
    fake_result = analyze_fake_news(text)

    # 🔹 Propagation Search (THIS WAS BREAKING BEFORE)
    propagation_result = await search_propagation(text)

    # 🔥 FINAL RESPONSE
    return {
        "ai": ai_result,
        "fake": fake_result,
        "propagation": propagation_result
    }