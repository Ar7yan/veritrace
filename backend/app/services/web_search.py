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

    # Fallback
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
        title    = article.get("title", "")
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
            "title":    item.get("title",         ""),
            "link":     item.get("link",           ""),
            "snippet":  item.get("snippet",        ""),
            "source":   item.get("displayed_link", "").split("/")[0],
            "position": item.get("position",       0),
            "date":     item.get("date",           "Unknown"),
        })

    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
    }


def _contextual_mock(query: str, text: str) -> dict:
    q = query.replace(' ', '+')
    results = [
        {
            "title":    f"Reuters: Search results for '{query}'",
            "link":     f"https://www.reuters.com/site-search/?query={q}",
            "snippet":  f"Find the latest Reuters coverage on: {query}",
            "source":   "reuters.com",
            "position": 1,
            "date":     "Live",
        },
        {
            "title":    f"BBC News: '{query}'",
            "link":     f"https://www.bbc.co.uk/search?q={q}",
            "snippet":  f"BBC News coverage and analysis on: {query}",
            "source":   "bbc.co.uk",
            "position": 2,
            "date":     "Live",
        },
        {
            "title":    f"AP News: '{query}'",
            "link":     f"https://apnews.com/search?q={q}",
            "snippet":  f"Associated Press reporting on: {query}",
            "source":   "apnews.com",
            "position": 3,
            "date":     "Live",
        },
        {
            "title":    f"The Guardian: '{query}'",
            "link":     f"https://www.theguardian.com/search?q={q}",
            "snippet":  f"Guardian journalism and opinion on: {query}",
            "source":   "theguardian.com",
            "position": 4,
            "date":     "Live",
        },
        {
            "title":    f"NPR: '{query}'",
            "link":     f"https://www.npr.org/search?query={q}",
            "snippet":  f"NPR news and features on: {query}",
            "source":   "npr.org",
            "position": 5,
            "date":     "Live",
        },
    ]
    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
    }