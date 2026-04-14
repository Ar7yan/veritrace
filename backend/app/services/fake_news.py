import re
from app.services.reasoning import analyze_claim


FAKE_SIGNALS = {
    "high": [
        "you won't believe", "mainstream media won't tell you",
        "they don't want you to know", "share before deleted",
        "share before they delete", "doctors hate",
        "secret they hide", "what they don't tell you",
        "government is hiding", "deep state", "wake up sheeple",
        "plandemic", "they're lying", "real truth",
        "100% proven", "miracle cure", "big pharma",
        "suppressed by", "censored by", "banned information",
    ],
    "medium": [
        "shocking", "explosive", "bombshell", "breaking:",
        "urgent:", "exposed:", "they lied", "hoax",
        "crisis actor", "false flag", "new world order",
        "chemtrails", "microchip", "depopulation",
        "mind control", "cover up", "cover-up",
        "they don't want", "truth about",
    ],
    "low": [
        "sources say", "reportedly", "allegedly",
        "according to insiders", "anonymous sources",
    ],
}


CREDIBILITY_SIGNALS = [
    "according to reuters", "according to ap", "according to the bbc",
    "study published in", "peer-reviewed", "researchers found",
    "data shows", "statistics show", "government report",
    "official statement", "press release", "confirmed by",
    "verified by", "fact-checked", "cited sources",
    "journal of", "university study", "clinical trial",
    "according to experts", "scientists say",
]


def analyze_fake_news(text: str, search_results: list = []) -> dict:
    text_lower = text.lower()
    score = 20
    reasons = []

    # -------------------------------
    # 🔹 RULE-BASED ANALYSIS
    # -------------------------------
    high_hits = [s for s in FAKE_SIGNALS["high"] if s in text_lower]
    if high_hits:
        score += len(high_hits) * 18
        reasons.append(f"Strong misinformation language: {high_hits[0]}")

    med_hits = [s for s in FAKE_SIGNALS["medium"] if s in text_lower]
    if med_hits:
        score += len(med_hits) * 10
        reasons.append(f"Sensational keywords: {', '.join(med_hits[:2])}")

    words = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 2]
    caps_ratio = len(caps_words) / max(len(words), 1)

    if caps_ratio > 0.2:
        score += 20
        reasons.append("Excessive capital letters")

    exclaim = text.count("!")
    if exclaim >= 3:
        score += 12
        reasons.append("Too many exclamation marks")

    # -------------------------------
    # 🔹 HUGGINGFACE REASONING (KEY FIX)
    # -------------------------------
    try:
        reasoning = analyze_claim(text)
        print("🔥 REASONING:", reasoning)   # DEBUG

        if reasoning["verdict"] == "suspicious":
            boost = int(reasoning["confidence"] * 60)
            score += boost

            reasons.append(
                f"AI detected suspicious/absurd claim ({int(reasoning['confidence']*100)}%)"
            )

    except Exception as e:
        print("❌ Reasoning failed:", e)
        reasoning = {
            "verdict": "unknown",
            "confidence": 0.5,
            "reason": "Reasoning unavailable"
        }

    # -------------------------------
    # 🔹 FINAL SCORING
    # -------------------------------
    score = max(2, min(96, round(score)))

    # 🔥 FORCE CORRECT VERDICT USING AI
    if reasoning["verdict"] == "suspicious" and reasoning["confidence"] > 0.5:
        verdict = "FAKE"
    else:
        if score >= 60:
            verdict = "FAKE"
        elif score <= 35:
            verdict = "REAL"
        else:
            verdict = "UNCERTAIN"

    # -------------------------------
    # 🔹 SOURCES MOCK
    # -------------------------------
    sources = [
        {"name": "Reuters", "supports": verdict != "FAKE"},
        {"name": "AP News", "supports": verdict != "FAKE"},
        {"name": "FactCheck.org", "supports": verdict == "FAKE"},
    ]

    if not reasons:
        reasons.append("No strong signals detected")

    # -------------------------------
    # 🔹 FINAL OUTPUT
    # -------------------------------
    return {
        "verdict": verdict,
        "score": score,
        "reasons": reasons[:4],
        "sources": sources,
        "reasoning": reasoning["reason"],   # 🔥 IMPORTANT FOR UI
    }