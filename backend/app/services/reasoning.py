from transformers import pipeline

# 🔥 Load model once (important)
classifier = pipeline(
    "zero-shot-classification",
    model="valhalla/distilbart-mnli-12-1"   # 🔥 lighter + faster
)

def analyze_claim(text: str) -> dict:
    """
    Classify whether a claim is realistic or fake using HuggingFace
    """

    labels = [
        "realistic news",
        "misinformation or fake news",
        "conspiracy or absurd claim"
    ]

    try:
        result = classifier(text, labels)

        top_label = result["labels"][0]
        confidence = result["scores"][0]

        if "conspiracy" in top_label or "fake" in top_label:
            verdict = "suspicious"
        else:
            verdict = "realistic"

        return {
            "verdict": verdict,
            "confidence": round(confidence, 3),
            "reason": f"Classified as '{top_label}' ({round(confidence*100,1)}% confidence)"
        }

    except Exception as e:
        print(f"[HF Error] {e}")

        return {
            "verdict": "unknown",
            "confidence": 0.5,
            "reason": "Could not analyze claim"
        }