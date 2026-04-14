import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

async def search_propagation(text: str) -> dict:
    query = text[:100]

    if SERP_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://serpapi.com/search",
                    params={"q": query, "api_key": SERP_API_KEY}
                )
                data = response.json()

            results = []

            for item in data.get("organic_results", []):
                results.append({
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "snippet": item.get("snippet"),
                    "source": item.get("displayed_link"),
                })

            return {
                "query": query,
                "results": results[:5],
                "total_found": len(results),
            }

        except Exception as e:
            print("Search error:", e)

    return {
        "query": query,
        "results": [],
        "total_found": 0,
    }