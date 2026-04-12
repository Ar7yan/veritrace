from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_detector import detect_ai_content
from app.services.similarity  import compute_similarity
from app.services.web_search  import search_propagation
from app.services.fake_news   import analyze_fake_news
import traceback

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/")
async def analyze_content(request: AnalyzeRequest):
    try:
        if not request.text or len(request.text.strip()) < 30:
            raise HTTPException(
                status_code=400,
                detail="Text too short. Please provide at least 30 characters."
            )

        text = request.text.strip()
        print(f"[Veritrace] Analyzing text: {text[:60]}...")

        print("[Veritrace] Running AI detection...")
        ai_result = await detect_ai_content(text)
        print(f"[Veritrace] AI detection done: {ai_result['label']}")

        print("[Veritrace] Running web search...")
        search_result = await search_propagation(text)
        print(f"[Veritrace] Search done: {search_result['total_found']} results")

        print("[Veritrace] Computing similarity...")
        similarity_result = compute_similarity(text, search_result.get("results", []))
        print(f"[Veritrace] Similarity done: {len(similarity_result)} scored")

        print("[Veritrace] Running fake news analysis...")
        fake_news_result = analyze_fake_news(text, similarity_result)
        print(f"[Veritrace] Fake news done: {fake_news_result['verdict']} ({fake_news_result['score']}%)")

        return {
            "ai_detection": ai_result,
            "propagation":  search_result,
            "similarity":   similarity_result,
            "fake_news":    fake_news_result,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Veritrace] UNEXPECTED ERROR in analyze: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")