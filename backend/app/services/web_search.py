import os
import httpx
from dotenv import load_dotenv
from app.utils.text_cleaner import extract_query

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

async def search_propagation(text: str) -> dict:
    query = extract_query(text)

    if not TAVILY_API_KEY or TAVILY_API_KEY == "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":
        return {
            "query": query,
            "results": [],
            "total_found": 0,
            "note": "No Tavily API key set",
        }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "search_depth": "basic",
                "max_results": 8,
                "include_answer": False,
            },
            timeout=20,
        )
        data = response.json()

    results = []
    for item in data.get("results", []):
        url = item.get("url", "")
        source = url.split("/")[2].replace("www.", "") if url else ""
        results.append({
            "title":    item.get("title", ""),
            "link":     url,
            "snippet":  item.get("content", "")[:300],
            "source":   source,
            "position": len(results) + 1,
            "date":     item.get("published_date", "Unknown"),
        })

    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
    }