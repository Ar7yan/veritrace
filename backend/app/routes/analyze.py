from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/")
async def analyze_text(req: AnalyzeRequest):
    text = req.text.lower()

    # 🔹 AI detection (dummy but working)
    ai_probability = 10

    # 🔹 Fake detection logic
    if any(x in text for x in ["secret", "conspiracy", "they don't want", "hidden"]):
        fake_score = 75
        verdict = "FAKE"
        reasons = ["Suspicious / conspiracy-like language detected"]
    else:
        fake_score = 20
        verdict = "REAL"
        reasons = ["No strong misinformation patterns"]

    # 🔹 Propagation (dummy but visible)
    propagation = {
        "query": text,
        "results": [
            {
                "title": "Reuters - AI content report",
                "link": "https://www.reuters.com",
                "snippet": "AI-generated content statistics study",
                "source": "reuters.com"
            },
            {
                "title": "BBC News - AI growth",
                "link": "https://www.bbc.com",
                "snippet": "Discussion on AI-generated articles",
                "source": "bbc.com"
            }
        ],
        "total_found": 2
    }

    return {
        "ai": {
            "ai_probability": ai_probability,
            "label": "Human Written"
        },
        "fake": {
            "verdict": verdict,
            "score": fake_score,
            "reasons": reasons,
            "sources": [
                {"name": "Reuters", "supports": verdict != "FAKE"},
                {"name": "AP News", "supports": verdict != "FAKE"},
                {"name": "FactCheck.org", "supports": verdict == "FAKE"},
            ]
        },
        "propagation": propagation
    }