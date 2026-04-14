def analyze_claim(text: str) -> dict:
    text_lower = text.lower()

    absurd_keywords = [
        "aliens", "time travel", "mind control",
        "quantum signals", "secretly controlling",
        "conspiracy", "hidden forces"
    ]

    suspicious_patterns = [
        "breaking", "shocking", "they don't want you to know",
        "viral", "rumor", "unverified"
    ]

    absurd_score = sum(1 for w in absurd_keywords if w in text_lower)
    suspicious_score = sum(1 for w in suspicious_patterns if w in text_lower)

    score = max(absurd_score * 0.4, suspicious_score * 0.3)
    score = min(score, 1.0)

    if score > 0.5:
        return {
            "verdict": "suspicious",
            "confidence": score,
            "reason": "Contains unrealistic or conspiracy-like claim"
        }

    return {
        "verdict": "realistic",
        "confidence": 1 - score,
        "reason": "No major misinformation patterns detected"
    }