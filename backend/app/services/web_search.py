import os
import httpx
from dotenv import load_dotenv
from app.utils.text_cleaner import extract_query

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
SERP_API_KEY = os.getenv("SERP_API_KEY")


def _build_smart_query(text: str) -> str:
    """
    Builds a better search query by extracting key meaningful phrases
    instead of just the first N words.
    """
    import re

    # Remove common filler words
    stopwords = {
        "the","a","an","is","are","was","were","be","been","being",
        "have","has","had","do","does","did","will","would","could",
        "should","may","might","shall","can","need","dare","ought",
        "this","that","these","those","i","we","you","he","she","it",
        "they","what","which","who","whom","how","when","where","why",
        "and","or","but","if","because","as","until","while","of",
        "at","by","for","with","about","against","between","through",
        "during","to","from","in","out","on","off","over","under",
        "again","then","once","here","there","all","both","each",
        "few","more","most","other","some","such","no","nor","not",
        "only","own","same","so","than","too","very","just","s","t",
    }

    text_clean = re.sub(r'[^\w\s]', ' ', text.lower())
    words      = text_clean.split()
    keywords   = [w for w in words if w not in stopwords and len(w) > 3]

    # Take top 6 most meaningful words
    query = " ".join(keywords[:6])
    return query if query else " ".join(text.split()[:6])


async def search_propagation(text: str) -> dict:
    query = _build_smart_query(text)
    print(f"[Veritrace] Search query: {query}")

    if NEWS_API_KEY and NEWS_API_KEY not in ["your_newsapi_key_here", "none", ""]:
        try:
            result = await _search_newsapi(query, text)
            if result and len(result.get("results", [])) > 0:
                return result
        except Exception as e:
            print(f"[Veritrace] NewsAPI error: {e}")

    if SERP_API_KEY and SERP_API_KEY not in ["your_serpapi_key_here", "none", ""]:
        try:
            result = await _search_serpapi(query)
            if result and len(result.get("results", [])) > 0:
                return result
        except Exception as e:
            print(f"[Veritrace] SerpAPI error: {e}")

    return _contextual_mock(query, text)


async def _search_newsapi(query: str, original_text: str) -> dict:
    url    = "https://newsapi.org/v2/everything"
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
        print(f"[Veritrace] NewsAPI error: {data.get('message')}")
        return {}

    articles = data.get("articles", [])
    results  = []

    for article in articles:
        link    = article.get("url",         "")
        source  = article.get("source", {}).get("name", "")
        title   = article.get("title",       "")
        desc    = article.get("description", "") or ""
        date    = (article.get("publishedAt") or "")[:10] or "Unknown"

        if not link or not title:
            continue
        if "[Removed]" in title or "[Removed]" in desc:
            continue
        if not source:
            source = link.split("/")[2].replace("www.", "") if "/" in link else link

        results.append({
            "title":    title,
            "link":     link,
            "snippet":  desc[:200] if desc else title,
            "source":   source,
            "position": len(results) + 1,
            "date":     date,
        })

    print(f"[Veritrace] NewsAPI: {len(results)} results for '{query}'")
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
            "link":     item.get("link",          ""),
            "snippet":  item.get("snippet",       ""),
            "source":   item.get("displayed_link","").split("/")[0],
            "position": item.get("position",      0),
            "date":     item.get("date",          "Unknown"),
        })

    return {"query": query, "results": results, "total_found": len(results)}


def _contextual_mock(query: str, text: str) -> dict:
    """Real search URLs using the actual query — so clicking opens relevant results."""
    q = query.replace(" ", "+")
    results = [
        {
            "title":   f"Reuters: Search results for '{query}'",
            "link":    f"https://www.reuters.com/search/news?blob={q}",
            "snippet": f"Latest Reuters news coverage related to: {query}",
            "source":  "reuters.com",
            "position": 1,
            "date":    "Live",
        },
        {
            "title":   f"BBC News: '{query}' coverage",
            "link":    f"https://www.bbc.com/search?q={q}",
            "snippet": f"BBC News reporting and analysis on: {query}",
            "source":  "bbc.com",
            "position": 2,
            "date":    "Live",
        },
        {
            "title":   f"AP News: Latest on '{query}'",
            "link":    f"https://apnews.com/search?q={q}",
            "snippet": f"Associated Press fact-checked journalism covering: {query}",
            "source":  "apnews.com",
            "position": 3,
            "date":    "Live",
        },
        {
            "title":   f"The Guardian: '{query}' stories",
            "link":    f"https://www.theguardian.com/search?q={q}",
            "snippet": f"In-depth Guardian coverage and opinion pieces about: {query}",
            "source":  "theguardian.com",
            "position": 4,
            "date":    "Live",
        },
        {
            "title":   f"NPR: '{query}' news",
            "link":    f"https://www.npr.org/search#storyContent&q={q}",
            "snippet": f"NPR public radio journalism and reporting on: {query}",
            "source":  "npr.org",
            "position": 5,
            "date":    "Live",
        },
    ]

    return {
        "query":       query,
        "results":     results,
        "total_found": len(results),
        "note":        "Add NEWS_API_KEY in Railway for live article results",
    }