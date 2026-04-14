import os
import httpx
from dotenv import load_dotenv
from app.utils.text_cleaner import extract_query

load_dotenv()

NEWS_API_KEY  = os.getenv("NEWS_API_KEY")
SERP_API_KEY  = os.getenv("SERP_API_KEY")

async def search_propagation(text: str) -> dict:
    query = extract_query(text, max_words=8)

    # Try NewsAPI first
    if NEWS_API_KEY and NEWS_API_KEY != "your_newsapi_key_here":
        try:
            result = await _search_newsapi(query, text)
            if result and result.get("results"):
                return result
        except Exception as e:
            print(f"[Veritrace] NewsAPI error: {e}")

    # Try SerpAPI second
    if SERP_API_KEY and SERP_API_KEY != "your_serpapi_key_here":
        try:
            result = await _search_serpapi(query)
            if result and result.get("results"):
                return result
        except Exception as e:
            print(f"[Veritrace] SerpAPI error: {e}")

    # Fallback — generate contextual mock based on actual query
    return _contextual_mock(query, text)


async def _search_newsapi(query: str, original_text: str) -> dict:
    url = "https://newsapi.org/v2/everything"
    params = {
        "q":        query,
        "apiKey":   NEWS_API_KEY,
        "pageSize": 8,
        "sortBy":   "relevancy",
        "language": "en",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params=params)
        data     = response.json()

    if data.get("status") != "ok":
        print(f"[Veritrace] NewsAPI bad status: {data.get('message')}")
        return {}

    articles = data.get("articles", [])
    results  = []

    for article in articles:
        url_link = article.get("url", "")
        source   = article.get("source", {}).get("name", "")
        title    = article.get("title",       "")
        desc     = article.get("description", "")
        date     = article.get("publishedAt", "")[:10] if article.get("publishedAt") else "Unknown"

        if not url_link or not title:
            continue
        if "[Removed]" in title:
            continue

        results.append({
            "title":    title,
            "link":     url_link,
            "snippet":  desc or title,
            "source":   source,
            "position": len(results) + 1,
            "date":     date,
        })

    print(f"[Veritrace] NewsAPI returned {len(results)} results for: {query}")
    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
    }


async def _search_serpapi(query: str) -> dict:
    params = {
        "q":       query,
        "api_key": SERP_API_KEY,
        "num":     10,
        "engine":  "google",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get("https://serpapi.com/search", params=params)
        data     = response.json()

    organic = data.get("organic_results", [])
    results = []

    for item in organic:
        results.append({
            "title":    item.get("title",          ""),
            "link":     item.get("link",            ""),
            "snippet":  item.get("snippet",         ""),
            "source":   item.get("displayed_link",  "").split("/")[0],
            "position": item.get("position",        0),
            "date":     item.get("date",            "Unknown"),
        })

    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
    }


def _contextual_mock(query: str, text: str) -> dict:
    """
    Generates contextual mock results based on the actual query.
    No hardcoded fake links — uses real news domains with query-based URLs.
    """
    words   = query.replace(" ", "-").lower()
    sources = [
        {
            "name": "Reuters",
            "base": "https://www.reuters.com/search/news",
            "param": f"?blob={query.replace(' ','+')}"
        },
        {
            "name": "BBC News",
            "base": "https://www.bbc.com/search",
            "param": f"?q={query.replace(' ','+')}"
        },
        {
            "name": "AP News",
            "base": "https://apnews.com/search",
            "param": f"?q={query.replace(' ','+')}"
        },
        {
            "name": "The Guardian",
            "base": "https://www.theguardian.com/search",
            "param": f"?q={query.replace(' ','+')}"
        },
        {
            "name": "NPR",
            "base": "https://www.npr.org/search",
            "param": f"#storyContent&q={query.replace(' ','+')}"
        },
    ]

    results = []
    for i, s in enumerate(sources):
        results.append({
            "title":    f"{s['name']} — Search results for: {query}",
            "link":     s["base"] + s["param"],
            "snippet":  f"Search {s['name']} for the latest news and coverage about: {query}",
            "source":   s["name"],
            "position": i + 1,
            "date":     "Live search",
        })

    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
        "note":        "Add NEWS_API_KEY in Railway variables for live article results",
    }