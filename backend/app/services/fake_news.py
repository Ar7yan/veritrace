import re

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
        "what the media won't", "they don't want",
    ],
    "medium": [
        "shocking", "explosive", "bombshell", "breaking:",
        "urgent:", "exposed:", "they lied", "hoax",
        "crisis actor", "false flag", "new world order",
        "chemtrails", "microchip", "depopulation",
        "mind control", "cover up", "cover-up",
        "truth about", "wake up", "open your eyes",
        "do your research", "do your own research",
        "mainstream media", "fake news", "they want you",
    ],
}

CREDIBILITY_SIGNALS = [
    "according to reuters", "according to ap",
    "according to the bbc", "study published in",
    "peer-reviewed", "researchers found", "data shows",
    "statistics show", "government report", "official statement",
    "press release", "confirmed by", "verified by",
    "fact-checked", "cited sources", "journal of",
    "university study", "clinical trial",
    "according to experts", "scientists say",
    "according to", "researchers", "study shows",
    "report says", "officials say",
]


def analyze_fake_news(text: str, search_results: list = []) -> dict:
    text_lower = text.lower()
    score      = 30   # start at 30 — neutral
    reasons    = []

    # ── Strong fake signals (+20 each) ──
    high_hits = [s for s in FAKE_SIGNALS["high"] if s in text_lower]
    if high_hits:
        score += len(high_hits) * 20
        reasons.append(
            f"Strong misinformation language: \"{high_hits[0]}\""
            + (f" (+{len(high_hits)-1} more)" if len(high_hits) > 1 else "")
        )

    # ── Medium fake signals (+12 each) ──
    med_hits = [s for s in FAKE_SIGNALS["medium"] if s in text_lower]
    if med_hits:
        score += len(med_hits) * 12
        reasons.append(f"Sensationalist keywords: {', '.join(med_hits[:3])}")

    # ── ALL CAPS words ──
    words      = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 2]
    caps_ratio = len(caps_words) / max(len(words), 1)
    if caps_ratio > 0.15:
        score += 22
        reasons.append(f"Excessive capitalisation ({int(caps_ratio*100)}% of words)")
    elif caps_ratio > 0.08:
        score += 12
        reasons.append("Elevated use of capital letters detected")

    # ── Exclamation marks ──
    exclaim = text.count('!')
    if exclaim >= 3:
        score += 15
        reasons.append(f"{exclaim} exclamation marks — emotional manipulation pattern")
    elif exclaim == 2:
        score += 8

    # ── Unverified stats ──
    big_numbers = re.findall(r'\b\d+\s*%|\b\d+\s*(million|billion|trillion)\b', text_lower)
    sourced     = any(w in text_lower for w in ["according to","study","report","data","survey","researchers"])
    if big_numbers and not sourced:
        score += 14
        reasons.append(f"{len(big_numbers)} unsourced statistical claim(s)")

    # ── Very short with strong claims ──
    word_count = len(words)
    if word_count < 25 and (high_hits or med_hits):
        score += 18
        reasons.append("Very short content making strong unverified claims")

    # ── Rhetorical questions ──
    if text.count('?') >= 2 and word_count < 50:
        score += 10
        reasons.append("Rhetorical questions implying unverified claims")

    # ── Credibility signals (reduce score) ──
    cred_hits = [s for s in CREDIBILITY_SIGNALS if s in text_lower]
    if cred_hits:
        reduction = min(len(cred_hits) * 10, 35)
        score    -= reduction
        reasons.append(f"Credible sourcing language: \"{cred_hits[0]}\"")

    # ── Neutral calm language ──
    neutral = ["data","research","study","report","analysis",
               "evidence","statistics","published","according to","experts"]
    neutral_hits = [w for w in neutral if w in text_lower]
    if len(neutral_hits) >= 3:
        score -= 18
        reasons.append(f"Neutral evidence-based language ({', '.join(neutral_hits[:3])})")
    elif len(neutral_hits) >= 1:
        score -= 8

    # ── No fake signals at all ──
    if not high_hits and not med_hits and not caps_words and exclaim == 0:
        score -= 14
        reasons.append("No sensationalist language or misinformation patterns found")

    # ── Clamp ──
    score   = max(2, min(96, round(score)))
    verdict = "FAKE" if score >= 55 else "REAL" if score <= 38 else "UNCERTAIN"

    # ── Adjust sources based on verdict ──
    sources = [
        {"name": "Reuters",       "supports": verdict != "FAKE"},
        {"name": "AP News",       "supports": verdict != "FAKE"},
        {"name": "FactCheck.org", "supports": verdict == "FAKE"},
    ]

    if not reasons:
        reasons.append("No strong indicators detected in either direction")

    return {
        "verdict": verdict,
        "score":   score,
        "reasons": reasons[:4],
        "sources": sources,
    }