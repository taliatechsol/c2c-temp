import requests
from datetime import datetime, timezone

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; c2c-scout/1.0)",
}

def fetch() -> list[dict]:
    """Fetch AI jobs from RemoteOK API."""
    print("[Source: RemoteOK] Fetching...")
    results = []
    
    url = "https://remoteok.com/api"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return []
        
        data = resp.json()
        for item in data:
            if not isinstance(item, dict):
                continue
            
            title = item.get("position", "").lower()
            tags = [t.lower() for t in item.get("tags", [])]
            
            # Filter for AI/LLM
            ai_terms = ["ai", "llm", "rag", "pytorch", "agent", "generative", "machine learning", "nlp"]
            if not any(term in title for term in ai_terms) and not any(term in tags for term in ai_terms):
                continue
            
            results.append(_normalise(item))
            
    except Exception as e:
        print(f"[Source: RemoteOK] Error: {e}")

    return results

def _normalise(raw: dict) -> dict:
    return {
        "name": raw.get("position"),
        "url": raw.get("url"),
        "company": raw.get("company"),
        "description": raw.get("description"),
        "source": "RemoteOK",
        "date_found": datetime.now(timezone.utc).date().isoformat()
    }
