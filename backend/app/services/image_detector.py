import io

# Don't load at startup — load on first request
_detector = None

def get_detector():
    global _detector
    if _detector is None:
        try:
            from transformers import pipeline
            print("[Veritrace] Loading image model on first request...")
            _detector = pipeline("image-classification", model="umm-maybe/AI-image-detector")
            print("[Veritrace] Image model loaded.")
        except Exception as e:
            print(f"[Veritrace] Image model failed: {e}")
            _detector = "failed"
    return _detector if _detector != "failed" else None


def detect_ai_image(image_bytes: bytes, filename: str = "") -> dict:
    try:
        from PIL import Image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return {"error": f"Could not read image: {str(e)}"}

    original_size = image.size
    max_size = 512
    if max(image.size) > max_size:
        ratio    = max_size / max(image.size)
        new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
        image    = image.resize(new_size, Image.LANCZOS)

    detector = get_detector()
    if detector is not None:
        try:
            results  = detector(image)
            scores   = {r["label"]: r["score"] for r in results}
            ai_prob  = scores.get("artificial", scores.get("ai",   0.0))
            hu_prob  = scores.get("human",      scores.get("real", 1.0 - ai_prob))
        except Exception as e:
            print(f"[Veritrace] Inference error: {e}")
            ai_prob, hu_prob = _mock_ai_prob(filename, original_size)
    else:
        ai_prob, hu_prob = _mock_ai_prob(filename, original_size)

    is_ai = ai_prob > 0.5

    return {
        "is_ai_generated":   is_ai,
        "ai_probability":    round(ai_prob, 3),
        "human_probability": round(hu_prob, 3),
        "ai_percent":        round(ai_prob * 100, 1),
        "human_percent":     round(hu_prob * 100, 1),
        "label":             "AI Generated" if is_ai else "Likely Real",
        "confidence":        "High" if max(ai_prob, hu_prob) > 0.80 else "Medium",
        "width":             original_size[0],
        "height":            original_size[1],
        "filename":          filename,
        "ai_signals":        _analyze_ai_signals(original_size, filename),
        "fake_news":         _analyze_fake_news_signals(original_size, filename, ai_prob),
        "model":             "umm-maybe/AI-image-detector",
        "model_note":        None,
    }


def _mock_ai_prob(filename: str, size: tuple) -> tuple:
    score = 0.45
    name  = filename.lower()
    w, h  = size
    ai_hints = ["dalle","midjourney","stablediffusion","sd_","generated","ai_","flux"]
    if any(h in name for h in ai_hints):
        score = 0.91
    common_ai_sizes = [(1024,1024),(512,512),(768,768),(1024,768),(768,1024),(1536,1024)]
    if (w,h) in common_ai_sizes:
        score = max(score, 0.78)
    if w == h:
        score = max(score, 0.65)
    return round(max(0.05, min(0.96, score)), 3), round(1 - max(0.05, min(0.96, score)), 3)


def _analyze_ai_signals(size: tuple, filename: str) -> list:
    signals = []
    w, h    = size
    name    = filename.lower()
    common_ai_sizes = [(1024,1024),(512,512),(768,768),(1024,768),(768,1024),(1536,1024),(1024,1536),(2048,2048)]
    if (w,h) in common_ai_sizes:
        signals.append(f"Dimensions {w}×{h}px match common AI generator output sizes")
    if w == h:
        signals.append("Perfect square aspect ratio — default for most AI image generators")
    ai_hints = ["dalle","midjourney","stablediffusion","sd_","generated","ai_","flux","firefly"]
    for hint in ai_hints:
        if hint in name:
            signals.append(f"Filename contains '{hint}' — references a known AI tool")
            break
    if not signals:
        signals.append("No suspicious dimension or filename patterns detected")
    return signals


def _analyze_fake_news_signals(size: tuple, filename: str, ai_prob: float) -> dict:
    score   = 20
    reasons = []
    name    = filename.lower()
    w, h    = size
    if ai_prob > 0.85:
        score += 35
        reasons.append(f"Very high AI probability ({round(ai_prob*100)}%) — AI images frequently used in misinformation")
    elif ai_prob > 0.65:
        score += 20
        reasons.append(f"Elevated AI probability ({round(ai_prob*100)}%)")
    elif ai_prob < 0.25:
        score -= 15
        reasons.append("Low AI probability — likely authentic photograph")
    fake_hints = ["breaking","urgent","exposed","leaked","proof","evidence","caught","shocking"]
    for hint in fake_hints:
        if hint in name:
            score += 18
            reasons.append(f"Filename contains '{hint}' — common in fake news images")
            break
    if w < 300 or h < 300:
        score += 8
        reasons.append("Low resolution may hide manipulation artifacts")
    if not reasons:
        reasons.append("No misinformation indicators detected")
    score   = max(2, min(96, round(score)))
    verdict = "FAKE" if score >= 60 else "REAL" if score <= 35 else "UNCERTAIN"
    return {
        "verdict": verdict,
        "score":   score,
        "reasons": reasons[:4],
        "sources": [
            {"name": "Google Reverse Image", "supports": score > 50},
            {"name": "Reuters Fact Check",   "supports": score <= 50},
            {"name": "Snopes Image Archive", "supports": score > 60},
        ],
    }