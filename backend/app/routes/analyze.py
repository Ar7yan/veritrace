from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/")
async def analyze_text(req: AnalyzeRequest):
    text = req.text

    # 🔥 SIMPLE SAFE RESPONSE (NO CRASH)
    return {
        "ai": {
            "ai_probability": 10,
            "label": "Human Written"
        },
        "fake": {
            "verdict": "FAKE" if "secret" in text.lower() else "REAL",
            "score": 70 if "secret" in text.lower() else 20,
            "reasons": ["Basic detection"],
            "sources": []
        },
        "propagation": {
            "query": text,
            "results": [
                {
                    "title": "Demo Source",
                    "link": "https://example.com",
                    "snippet": "Sample propagation",
                    "source": "example.com"
                }
            ],
            "total_found": 1
        }
    }