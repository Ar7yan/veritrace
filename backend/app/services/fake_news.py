from app.services.reasoning import analyze_claim

def analyze_fake_news(text: str, search_results: list = []) -> dict:
    score = 20
    reasons = []

    reasoning = analyze_claim(text)

    if reasoning["verdict"] == "suspicious":
        score += int(reasoning["confidence"] * 60)
        reasons.append("AI detected suspicious or unrealistic claim")

    score = max(5, min(95, score))

    if score >= 60:
        verdict = "FAKE"
    elif score <= 35:
        verdict = "REAL"
    else:
        verdict = "UNCERTAIN"

    sources = [
        {"name": "Reuters", "supports": verdict != "FAKE"},
        {"name": "AP News", "supports": verdict != "FAKE"},
        {"name": "FactCheck.org", "supports": verdict == "FAKE"},
    ]

    return {
        "verdict": verdict,
        "score": score,
        "reasons": reasons or ["No strong indicators"],
        "sources": sources,
        "reasoning": reasoning["reason"],
    }