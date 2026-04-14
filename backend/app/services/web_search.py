import os
import httpx
from dotenv import load_dotenv
from app.utils.text_cleaner import extract_query

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
SERP_API_KEY = os.getenv("SERP_API_KEY")


# 🔥 SIMPLE SIMILARITY FUNCTION
def compute_similarity(a: str, b: str) -> float:
    a_words = set(a.lower().split())
    b_words = set(b.lower().split())

    if not a_words:
        return 0

    return len(a_words & b_words) / len(a_words)


# 🔥 MAIN FUNCTION
async def search_propagation(text: str) -> dict:
    query = extract_query(text, max_words=8)

    # 1️⃣ Try NewsAPI
    if NEWS_API_KEY and NEWS_API_KEY != "your_newsapi_key_here":
        try:
            result = await _search_newsapi(query, text)
            if result and len(result.get("results", [])) >= 3:
                return result
        except Exception as e:
            print(f"[Veritrace] NewsAPI error: {e}")

    # 2️⃣ Try SerpAPI
    if SERP_API_KEY and SERP_API_KEY != "your_serpapi_key_here":
        try:
            result = await _search_serpapi(query, text)
            if result and len(result.get("results", [])) >= 3:
                return result
        except Exception as e:
            print(f"[Veritrace] SerpAPI error: {e}")

    # 3️⃣ Fallback (only if nothing useful found)
    return _contextual_mock(query)


# 🔥 NEWS API SEARCH
async def _search_newsapi(query: str, original_text: str) -> dict:
    url = "https://newsapi.org/v2/everything"

    params = {
        "q": query,
        "apiKey": NEWS_API_KEY,
        "pageSize": 10,
        "sortBy": "relevancy",
        "language": "en",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params=params)
        data = response.json()

    if data.get("status") != "ok":
        print(f"[Veritrace] NewsAPI error: {data.get('message')}")
        return {}

    articles = data.get("articles", [])
    results = []

    for article in articles:
        title = article.get("title", "")
        desc = article.get("description", "")
        url_link = article.get("url", "")

        if not title or not url_link:
            continue
        if "[Removed]" in title:
            continue

        combined = f"{title} {desc}"
        score = compute_similarity(original_text, combined)

        # 🔥 FILTER IRRELEVANT RESULTS
        if score < 0.2:
            continue

        results.append({
            "title": title,
            "link": url_link,
            "snippet": desc or title,
            "source": article.get("source", {}).get("name", ""),
            "position": len(results) + 1,
            "date": article.get("publishedAt", "")[:10] if article.get("publishedAt") else "Unknown",
            "score": round(score, 3)
        })

    # 🔥 SORT BY RELEVANCE
    results = sorted(results, key=lambda x: x["score"], reverse=True)[:5]

    print(f"[Veritrace] NewsAPI → {len(results)} filtered results for: {query}")

    return {
        "query": query,
        "results": results,
        "total_found": len(results),
    }


# 🔥 SERP API SEARCH
async def _search_serpapi(query: str, original_text: str) -> dict:
    params = {
        "q": query,
        "api_key": SERP_API_KEY,
        "num": 10,
        "engine": "google",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get("https://serpapi.com/search", params=params)
        data = response.json()

    organic = data.get("organic_results", [])
    results = []

    for item in organic:
        title = item.get("title", "")
        snippet = item.get("snippet", "")
        link = item.get("link", "")

        if not title or not link:
            continue

        combined = f"{title} {snippet}"
        score = compute_similarity(original_text, combined)

        # 🔥 FILTER
        if score < 0.2:
            continue

        results.append({
            "title": title,
            "link": link,
            "snippet": snippet,
            "source": item.get("displayed_link", "").split("/")[0],
            "position": item.get("position", 0),
            "date": item.get("date", "Unknown"),
            "score": round(score, 3)
        })

    # 🔥 SORT
    results = sorted(results, key=lambda x: x["score"], reverse=True)[:5]

    print(f"[Veritrace] SerpAPI → {len(results)} filtered results for: {query}")

    return {
        "query": query,
        "results": results,
        "total_found": len(results),
    }


# 🔥 FALLBACK (ONLY IF NOTHING WORKS)
def _contextual_mock(query: str) -> dict:
    q = query.replace(' ', '+')

    return {
        "query": query,
        "results": [
            {
                "title": f"Search more about '{query}'",
                "link": f"https://www.google.com/search?q={q}",
                "snippet": "No strong matches found. Try refining the query.",
                "source": "google.com",
                "position": 1,
                "date": "Live",
                "score": 0
            }
        ],
        "total_found": 1,
    }