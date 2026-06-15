import requests
from datetime import datetime, timezone
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; c2c-scout/1.0)",
}

def fetch() -> list[dict]:
    """Fetch latest HN 'Who is Hiring' posts via Algolia API."""
    print("[Source: HN Hiring] Fetching...")
    results = []
    
    # 1. Find the latest 'Who is hiring' story
    search_url = "https://hn.algolia.com/api/v1/search"
    params = {
        "query": "Ask HN: Who is hiring?",
        "tags": "story,ask_hn",
    }
    try:
        resp = requests.get(search_url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return []
        
        stories = resp.json().get("hits", [])
        if not stories:
            return []
        
        # Latest one
        story = stories[0]
        story_id = story["objectID"]
        
        # 2. Get comments (job posts)
        item_url = f"https://hn.algolia.com/api/v1/items/{story_id}"
        resp = requests.get(item_url, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            return []
        
        comments = resp.json().get("children", [])
        for comment in comments:
            text = comment.get("text", "")
            if not text or len(text) < 100:
                continue
            
            # Simple heuristic for AI/LLM relevance to reduce initial list
            if not any(term in text.lower() for term in ["ai", "llm", "rag", "pytorch", "agent", "generative"]):
                continue

            results.append(_normalise(comment))
            
    except Exception as e:
        print(f"[Source: HN Hiring] Error: {e}")

    return results

def _normalise(raw: dict) -> dict:
    text = raw.get("text", "")
    # Extract first line as title/name
    lines = text.split("<p>", 1)
    name = re.sub('<[^<]+?>', '', lines[0]).strip()[:100]
    
    return {
        "name": name,
        "url": f"https://news.ycombinator.com/item?id={raw.get('id')}",
        "company": name.split("|")[0].strip() if "|" in name else "HN Posting",
        "description": re.sub('<[^<]+?>', '', text)[:1500],
        "source": "HackerNews",
        "date_found": datetime.now(timezone.utc).date().isoformat()
    }
