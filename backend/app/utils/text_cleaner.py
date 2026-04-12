import re

def extract_query(text: str, max_words: int = 10) -> str:
    text  = text.strip()
    text  = re.sub(r'\s+', ' ', text)
    text  = re.sub(r'[^\w\s]', '', text)
    words = text.split()[:max_words]
    return " ".join(words)

def clean_text(text: str) -> str:
    text = text.strip()
    text = re.sub(r'\s+', ' ', text)
    return text