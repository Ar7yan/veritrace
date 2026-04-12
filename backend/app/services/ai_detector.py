import os
import re
from dotenv import load_dotenv

load_dotenv()

GPTZERO_API_KEY = os.getenv("GPTZERO_API_KEY")

def _mock_score(text: str) -> float:
    score = 0.5
    text_lower = text.lower()

    ai_phrases = [
        "furthermore", "in conclusion", "it is worth noting",
        "it is important to", "in today's world", "delve into",
        "as an ai", "i cannot", "certainly!", "absolutely!",
        "in summary", "to summarize", "it is essential",
        "i'd be happy to", "of course!", "it's worth noting",
    ]
    ai_hits = sum(1 for p in ai_phrases if p in text_lower)
    score += ai_hits * 0.07

    sentences = [s.strip() for s in text.split('.') if s.strip()]
    if sentences:
        avg_len = sum(len(s.split()) for s in sentences) / len(sentences)
        if avg_len > 25:
            score += 0.15
        elif avg_len < 10:
            score -= 0.15

    slang = ["lol","tbh","ngl","gonna","wanna","idk","omg","wtf","bruh","lmao"]
    if any(s in text_lower for s in slang):
        score -= 0.25

    return max(0.05, min(0.97, round(score, 2)))


async def detect_ai_content(text: str) -> dict:
    if not GPTZERO_API_KEY or GPTZERO_API_KEY == "your_gptzero_key_here":
        ai_prob    = _mock_score(text)
        human_prob = round(1 - ai_prob, 2)
        is_ai      = ai_prob > 0.5
        return {
            "is_ai_generated":   is_ai,
            "ai_probability":    ai_prob,
            "human_probability": human_prob,
            "label":      "AI Generated" if is_ai else "Human Written",
            "confidence": "High" if ai_prob > 0.75 or ai_prob < 0.25 else "Medium",
            "note":       "Heuristic detection — add GPTZero API key for ML results",
        }

    import httpx
    url     = "https://api.gptzero.me/v2/predict/text"
    headers = {"x-api-key": GPTZERO_API_KEY, "Content-Type": "application/json"}
    payload = {"document": text}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        data     = response.json()

    doc     = data.get("documents", [{}])[0]
    ai_prob = doc.get("average_generated_prob", 0)

    return {
        "is_ai_generated":   ai_prob > 0.5,
        "ai_probability":    round(ai_prob, 2),
        "human_probability": round(1 - ai_prob, 2),
        "label":      "AI Generated" if ai_prob > 0.5 else "Human Written",
        "confidence": "High" if ai_prob > 0.75 or ai_prob < 0.25 else "Medium",
    }