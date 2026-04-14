import httpx
from app.utils.text_cleaner import extract_query

async def search_propagation(text: str) -> dict:
    query = extract_query(text)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.duckduckgo.com/",
                params={
                    "q": query,
                    "format": "json",
                    "no_redirect": "1",
                    "no_html": "1",
                    "skip_disambig": "1",
                },
                timeout=15,
                headers={"User-Agent": "Veritrace/2.0"},
            )
            data = response.json()

        results = []

        # RelatedTopics give real links
        for item in data.get("RelatedTopics", []):
            if isinstance(item, dict) and item.get("FirstURL") and item.get("Text"):
                url = item["FirstURL"]
                source = url.split("/")[2].replace("www.", "") if "//" in url else "duckduckgo.com"
                results.append({
                    "title":    item.get("Text", "")[:80],
                    "link":     url,
                    "snippet":  item.get("Text", "")[:300],
                    "source":   source,
                    "position": len(results) + 1,
                    "date":     "Recent",
                })
            if len(results) >= 8:
                break

        # fallback: use Abstract if no RelatedTopics
        if not results and data.get("AbstractURL"):
            results.append({
                "title":    data.get("Heading", query),
                "link":     data.get("AbstractURL", ""),
                "snippet":  data.get("Abstract", "")[:300],
                "source":   data.get("AbstractSource", ""),
                "position": 1,
                "date":     "Recent",
            })

        return {
            "query":       query,
            "results":     results,
            "total_found": len(results),
        }

    except Exception as e:
        print(f"[Veritrace] Search error: {e}")
        return {"query": query, "results": [], "total_found": 0}