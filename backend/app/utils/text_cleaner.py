import re

def extract_query(text: str, max_words: int = 8) -> str:
    """
    Extracts a meaningful search query from input text.
    Focuses on keywords instead of random words.
    """

    if not text:
        return ""

    # 🔹 Step 1: Normalize text
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)

    words = text.split()

    # 🔹 Step 2: Remove stopwords
    stopwords = {
        "the", "is", "at", "which", "on", "and", "a", "an",
        "in", "of", "to", "for", "with", "by", "from", "as",
        "this", "that", "are", "was", "were", "be", "has", "have",
        "it", "its", "their", "them", "they", "you", "your",
        "about", "into", "over", "after", "before", "between",
        "under", "again", "further", "then", "once"
    }

    keywords = [
        word for word in words
        if word not in stopwords and len(word) > 3
    ]

    # 🔹 Step 3: Prioritize important terms (domain-specific boost)
    priority_terms = [
        "ai", "bank", "leak", "fraud", "attack", "scam",
        "fake", "viral", "rumor", "misinformation",
        "earthquake", "crypto", "data", "security",
        "india", "government", "election", "war"
    ]

    important_words = []
    normal_words = []

    for word in keywords:
        if any(term in word for term in priority_terms):
            important_words.append(word)
        else:
            normal_words.append(word)

    # 🔹 Step 4: Merge with priority first
    combined = important_words + normal_words

    # 🔹 Step 5: Remove duplicates while preserving order
    seen = set()
    final_words = []
    for word in combined:
        if word not in seen:
            final_words.append(word)
            seen.add(word)

    # 🔹 Step 6: Limit size
    final_query = " ".join(final_words[:max_words])

    return final_query