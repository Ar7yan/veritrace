import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

MOCK_PROPAGATION = [
    {
        "title":       "Viral image fact-checked — AI generated photo spreads on social media",
        "link":        "https://reuters.com/fact-check/ai-generated-image",
        "snippet":     "Fact checkers confirmed this image was generated using AI tools and does not depict a real event.",
        "source":      "reuters.com",
        "similarity":  91.2,
        "match_level": "High",
        "date":        "2024-11-10",
    },
    {
        "title":       "Same image posted across multiple Facebook groups with false claims",
        "link":        "https://snopes.com/fact-check/viral-ai-image",
        "snippet":     "This image has been shared thousands of times with misleading context. Analysis shows it was AI generated.",
        "source":      "snopes.com",
        "similarity":  84.7,
        "match_level": "High",
        "date":        "2024-11-08",
    },
    {
        "title":       "AI-generated images in political misinformation — a growing trend",
        "link":        "https://apnews.com/article/ai-images-misinformation",
        "snippet":     "AP analysis found over 200 instances of AI-generated images being used to spread false political narratives.",
        "source":      "apnews.com",
        "similarity":  67.3,
        "match_level": "Medium",
        "date":        "2024-10-22",
    },
    {
        "title":       "How to spot AI-generated images spreading as real news",
        "link":        "https://bbc.com/news/technology/ai-images-guide",
        "snippet":     "The BBC explains common signs that an image has been created by artificial intelligence tools.",
        "source":      "bbc.com",
        "similarity":  52.1,
        "match_level": "Medium",
        "date":        "2024-09-15",
    },
    {
        "title":       "Digital media literacy — verifying images in the age of AI",
        "link":        "https://medium.com/media-literacy/ai-image-verification",
        "snippet":     "Experts recommend using multiple verification tools when encountering viral images.",
        "source":      "medium.com",
        "similarity":  31.4,
        "match_level": "Low",
        "date":        "2024-08-30",
    },
]


async def reverse_image_search(image_bytes: bytes) -> dict:
    """
    Searches for visually similar images.
    Requires SerpAPI key with Google Lens access.
    Falls back to mock data if no key is set.
    """

    # ── Always use mock if no API key ──
    if not SERP_API_KEY or SERP_API_KEY == "your_serpapi_key_here":
        print("[Veritrace] No SerpAPI key — using mock propagation data")
        return {
            "results":     MOCK_PROPAGATION,
            "total_found": len(MOCK_PROPAGATION),
            "note":        "Mock data — add SerpAPI key in .env for live reverse image search",
        }

    # ── With API key — upload image to a temp URL first ──
    # SerpAPI Google Lens requires a public URL, not base64
    # For now use mock — real implementation needs image hosting
    try:
        import tempfile, os

        # Save image to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        # SerpAPI Google Lens with file upload
        async with httpx.AsyncClient(timeout=30) as client:
            with open(tmp_path, "rb") as img_file:
                response = await client.post(
                    "https://serpapi.com/search",
                    data={"engine": "google_lens", "api_key": SERP_API_KEY},
                    files={"encoded_image": img_file},
                )
            data = response.json()

        os.unlink(tmp_path)

        visual_matches = data.get("visual_matches", [])
        results = []

        for item in visual_matches[:8]:
            link       = item.get("link", "")
            source     = item.get("source", "")
            if not source and "/" in link:
                source = link.split("/")[2]
            position   = item.get("position", 99)
            similarity = max(10, round(95 - position * 8, 1))
            match_level= "High" if similarity > 75 else "Medium" if similarity > 45 else "Low"

            results.append({
                "title":       item.get("title",   "Unknown Source"),
                "link":        link,
                "snippet":     item.get("snippet", ""),
                "source":      source,
                "similarity":  similarity,
                "match_level": match_level,
                "date":        item.get("date",    "Unknown"),
            })

        return {"results": results, "total_found": len(results)}

    except Exception as e:
        print(f"[Veritrace] Reverse image search failed: {e} — falling back to mock")
        return {
            "results":     MOCK_PROPAGATION,
            "total_found": len(MOCK_PROPAGATION),
            "note":        "Live search unavailable — showing mock data",
        }