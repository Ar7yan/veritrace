from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(original_text: str, search_results: list) -> list:
    if not search_results:
        return []

    snippets = [r.get("snippet", "") for r in search_results if r.get("snippet")]
    if not snippets:
        return []

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        all_texts  = [original_text] + snippets
        matrix     = vectorizer.fit_transform(all_texts)
        scores     = cosine_similarity(matrix[0:1], matrix[1:]).flatten()

        scored = []
        snippet_index = 0
        for result in search_results:
            snippet = result.get("snippet", "")
            if not snippet:
                continue
            score = float(scores[snippet_index])
            snippet_index += 1
            scored.append({
                "title":       result.get("title",   ""),
                "link":        result.get("link",    ""),
                "source":      result.get("source",  ""),
                "snippet":     snippet,
                "similarity":  round(score * 100, 1),
                "date":        result.get("date",    "Unknown"),
                "match_level": "High" if score > 0.3 else "Medium" if score > 0.1 else "Low",
            })

        scored.sort(key=lambda x: x["similarity"], reverse=True)
        return scored

    except Exception as e:
        print(f"[Veritrace] Similarity error: {e}")
        return []