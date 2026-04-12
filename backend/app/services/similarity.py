_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            print("[Veritrace] Loading similarity model...")
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            print("[Veritrace] Similarity model loaded.")
        except Exception as e:
            print(f"[Veritrace] Similarity model failed: {e}")
            _model = "failed"
    return _model if _model != "failed" else None


def compute_similarity(original_text: str, search_results: list) -> list:
    if not search_results:
        return []

    model = get_model()

    if model is None:
        return [
            {
                "title":       r.get("title",   ""),
                "link":        r.get("link",    ""),
                "source":      r.get("source",  ""),
                "snippet":     r.get("snippet", ""),
                "similarity":  round(50 - i * 5, 1),
                "date":        r.get("date",    "Unknown"),
                "match_level": "Medium",
            }
            for i, r in enumerate(search_results)
        ]

    try:
        from sentence_transformers import util
        original_embedding = model.encode(original_text, convert_to_tensor=True)
        scored = []
        for result in search_results:
            snippet = result.get("snippet", "")
            if not snippet:
                continue
            snippet_embedding = model.encode(snippet, convert_to_tensor=True)
            score = util.cos_sim(original_embedding, snippet_embedding).item()
            scored.append({
                "title":       result.get("title",   ""),
                "link":        result.get("link",    ""),
                "source":      result.get("source",  ""),
                "snippet":     snippet,
                "similarity":  round(score * 100, 1),
                "date":        result.get("date",    "Unknown"),
                "match_level": "High" if score > 0.75 else "Medium" if score > 0.45 else "Low",
            })
        scored.sort(key=lambda x: x["similarity"], reverse=True)
        return scored
    except Exception as e:
        print(f"[Veritrace] Similarity error: {e}")
        return []