import os
import httpx
from dotenv import load_dotenv
from app.utils.text_cleaner import extract_query

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

MOCK_RESULTS = [
    {
        "title":    "AI-Generated Content Is Flooding the Internet",
        "link":     "https://reddit.com/r/artificialintelligence/comments/ai_flood",
        "snippet":  "Researchers found that over 40% of content published in 2024 shows signs of AI generation, raising concerns about misinformation and content authenticity online.",
        "source":   "reddit.com",
        "position": 1,
        "date":     "2024-11-15",
    },
    {
        "title":    "How AI Writing Tools Are Changing Journalism",
        "link":     "https://medium.com/ai-trends/journalism-ai-tools",
        "snippet":  "News organizations are increasingly using AI to draft articles, but critics warn this leads to homogenized reporting and factual errors going unchecked.",
        "source":   "medium.com",
        "position": 2,
        "date":     "2024-10-22",
    },
    {
        "title":    "The Spread of AI Content on Social Media Platforms",
        "link":     "https://twitter.com/airesearch/status/example",
        "snippet":  "A viral thread highlighted how a single AI-generated paragraph was reposted across 200+ accounts within 48 hours, often without any attribution or editing.",
        "source":   "twitter.com",
        "position": 3,
        "date":     "2024-12-01",
    },
    {
        "title":    "ChatGPT Posts Dominate LinkedIn Feeds in 2024",
        "link":     "https://linkedin.com/pulse/chatgpt-linkedin-2024",
        "snippet":  "LinkedIn users report their feeds are now filled with AI-generated motivational posts and business advice, making it hard to distinguish authentic voices.",
        "source":   "linkedin.com",
        "position": 4,
        "date":     "2024-09-10",
    },
    {
        "title":    "Tech Companies Race to Label AI-Generated Content",
        "link":     "https://techcrunch.com/2024/ai-content-labeling",
        "snippet":  "Meta, Google and OpenAI announced new watermarking standards to help users identify AI-generated text and images across their platforms.",
        "source":   "techcrunch.com",
        "position": 5,
        "date":     "2024-08-30",
    },
]

async def search_propagation(text: str) -> dict:
    query = extract_query(text)

    if not SERP_API_KEY or SERP_API_KEY == "your_serpapi_key_here":
        return {
            "query":       query,
            "results":     MOCK_RESULTS,
            "total_found": len(MOCK_RESULTS),
            "note":        "Mock data — add SerpAPI key in .env for live results",
        }

    params = {"q": query, "api_key": SERP_API_KEY, "num": 10, "engine": "google"}

    async with httpx.AsyncClient() as client:
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

    return {"query": query, "results": results, "total_found": len(results)}