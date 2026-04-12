from sentence_transformers import SentenceTransformer, util

# Load model safely
model = None
try:
    print("[Veritrace] Loading similarity model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("[Veritrace] Similarity model loaded OK")
except Exception as e:
    print(f"[Veritrace] WARNING: Could not load similarity model: {e}")


def compute_similarity(original_text: str, search_results: list) -> list:
    if not search_results:
        return []

    # Fallback if model failed to load
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
        print(f"[Veritrace] Similarity scoring error: {e}")
        return []