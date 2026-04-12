from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.image_detector import detect_ai_image
from app.services.image_search   import reverse_image_search

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

@router.post("/")
async def analyze_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload JPG, PNG, or WEBP.")

    image_bytes = await file.read()

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    ai_result = detect_ai_image(image_bytes, file.filename or "")
    if "error" in ai_result:
        raise HTTPException(status_code=422, detail=ai_result["error"])

    search_result = await reverse_image_search(image_bytes)
    similarity    = search_result.get("results", [])

    return {
        "ai_detection": {
            "is_ai_generated":   ai_result["is_ai_generated"],
            "ai_probability":    ai_result["ai_probability"],
            "human_probability": ai_result["human_probability"],
            "ai_percent":        ai_result["ai_percent"],
            "human_percent":     ai_result["human_percent"],
            "label":             ai_result["label"],
            "confidence":        ai_result["confidence"],
            "signals":           ai_result["ai_signals"],
            "model":             ai_result["model"],
            "width":             ai_result["width"],
            "height":            ai_result["height"],
        },
        "fake_news":   ai_result["fake_news"],
        "similarity":  similarity,
        "propagation": {
            "total_found": search_result["total_found"],
            "note":        search_result.get("note", ""),
        },
    }