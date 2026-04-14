import os
import httpx
from dotenv import load_dotenv
from app.utils.text_cleaner import extract_query

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

async def search_propagation(text: str) -> dict:
    query = extract_query(text)

    if not NEWS_API_KEY:
        return {"query": query, "results": [], "total_found": 0}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": query,
                    "apiKey": NEWS_API_KEY,
                    "pageSize": 8,
                    "sortBy": "relevancy",
                    "language": "en",
                },
                timeout=15,
            )
            data = response.json()

        results = []
        for item in data.get("articles", []):
            url = item.get("url", "")
            source = item.get("source", {}).get("name", url.split("/")[2].replace("www.", "") if url else "")
            results.append({
                "title":    item.get("title", "")[:120],
                "link":     url,
                "snippet":  item.get("description", "") or item.get("content", "")[:300],
                "source":   source,
                "position": len(results) + 1,
                "date":     (item.get("publishedAt", "") or "")[:10],
            })

        return {
            "query":       query,
            "results":     results,
            "total_found": len(results),
        }

    except Exception as e:
        print(f"[Veritrace] Search error: {e}")
        return {"query": query, "results": [], "total_found": 0}