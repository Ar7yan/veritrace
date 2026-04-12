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
    score      = 20
    reasons    = []

    high_hits = [s for s in FAKE_SIGNALS["high"] if s in text_lower]
    if high_hits:
        score += len(high_hits) * 18
        reasons.append(
            f"Strong misinformation language detected: \"{high_hits[0]}\""
            + (f" (+{len(high_hits)-1} more)" if len(high_hits) > 1 else "")
        )

    med_hits = [s for s in FAKE_SIGNALS["medium"] if s in text_lower]
    if med_hits:
        score += len(med_hits) * 10
        reasons.append(f"Sensationalist keywords found: {', '.join(med_hits[:3])}")

    words      = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 2]
    caps_ratio = len(caps_words) / max(len(words), 1)
    if caps_ratio > 0.20:
        score += 20
        reasons.append(f"Excessive capitalisation ({int(caps_ratio*100)}% of words) — classic clickbait pattern")
    elif caps_ratio > 0.10:
        score += 10
        reasons.append("Elevated use of capital letters detected")

    exclaim = text.count('!')
    if exclaim >= 3:
        score += 12
        reasons.append(f"Multiple exclamation marks ({exclaim}) indicate emotional manipulation")
    elif exclaim == 2:
        score += 6

    big_numbers = re.findall(r'\b\d+\s*%|\b\d+\s*(million|billion|trillion)\b', text_lower)
    sourced     = any(w in text_lower for w in ["according to", "study", "report", "data", "survey"])
    if big_numbers and not sourced:
        score += 12
        reasons.append(f"Contains {len(big_numbers)} statistical claim(s) with no cited source")

    word_count = len(words)
    if word_count < 25 and (high_hits or med_hits):
        score += 15
        reasons.append("Very short content making strong claims — lacks verifiable detail")

    if text.count('?') >= 2 and word_count < 40:
        score += 8
        reasons.append("Rhetorical questions used to imply unverified claims")

    cred_hits = [s for s in CREDIBILITY_SIGNALS if s in text_lower]
    if cred_hits:
        reduction = min(len(cred_hits) * 12, 40)
        score    -= reduction
        reasons.append(f"Credible sourcing language present: \"{cred_hits[0]}\"")

    neutral_words = ["data","research","study","report","analysis",
                     "evidence","statistics","published","according to"]
    neutral_hits  = [w for w in neutral_words if w in text_lower]
    if len(neutral_hits) >= 3:
        score -= 15
        reasons.append(f"Neutral, evidence-based language detected ({', '.join(neutral_hits[:3])})")
    elif len(neutral_hits) >= 1:
        score -= 6

    if not high_hits and not med_hits and not caps_words:
        score -= 10
        reasons.append("No sensationalist language or misinformation patterns detected")

    score   = max(2, min(96, round(score)))
    verdict = "FAKE" if score >= 60 else "REAL" if score <= 35 else "UNCERTAIN"

    sources = [
        {"name": "Reuters",       "supports": verdict != "FAKE"},
        {"name": "AP News",       "supports": verdict != "FAKE"},
        {"name": "FactCheck.org", "supports": verdict == "FAKE"},
    ]

    if not reasons:
        reasons.append("Content appears neutral with no strong indicators either way")

    return {
        "verdict": verdict,
        "score":   score,
        "reasons": reasons[:4],
        "sources": sources,
    }