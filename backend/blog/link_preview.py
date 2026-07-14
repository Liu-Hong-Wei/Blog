import re
import time
from urllib.parse import urlparse

from django.http import JsonResponse
import requests
from bs4 import BeautifulSoup

# In-memory cache: {url: (timestamp, data)}
_preview_cache: dict[str, tuple[float, dict]] = {}
_CACHE_TTL = 3600  # 1 hour
_CACHE_MAX_SIZE = 500


def extract_urls(text: str) -> list[str]:
    """Extract unique HTTP(S) URLs from plain text.

    Used by frontend utility — included here for completeness; the
    primary URL extraction happens client-side in extractUrls.ts.
    """
    urls = re.findall(r'https?://[^\s]+', text)
    seen: set[str] = set()
    result: list[str] = []
    for url in urls:
        url = url.rstrip('.,;:!?）)')
        if url not in seen:
            seen.add(url)
            result.append(url)
    return result


def fetch_og_metadata(url: str) -> dict | None:
    """Fetch and parse Open Graph metadata from a URL.

    Returns a dict with url, title, description, image, site_name
    on success, or None if the page is unreachable or has no useful
    metadata.
    """
    try:
        resp = requests.get(
            url,
            timeout=5,
            headers={'User-Agent': 'BlogBot/1.0 (+https://kylau.dev)'},
            allow_redirects=True,
        )
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')

    def og(prop: str) -> str:
        tag = soup.find('meta', attrs={'property': f'og:{prop}'})
        if tag:
            content = tag.get('content', '')
            if isinstance(content, str):
                return content.strip()
        return ''

    def meta_name(name: str) -> str:
        tag = soup.find('meta', attrs={'name': name})
        if tag:
            content = tag.get('content', '')
            if isinstance(content, str):
                return content.strip()
        return ''

    title = og('title')
    if not title:
        title_tag = soup.find('title')
        title = title_tag.get_text(strip=True) if title_tag else ''

    description = og('description')
    if not description:
        description = meta_name('description')

    image = og('image')
    site_name = og('site_name')

    if not site_name:
        parsed = urlparse(url)
        site_name = parsed.hostname or parsed.netloc

    # Nothing useful at all — treat as failure
    if not title and not description and not image:
        return None

    return {
        'url': url,
        'title': title,
        'description': description,
        'image': image,
        'site_name': site_name,
    }


def link_preview_api(request):
    """Django view: GET /api/link-preview/?url=<encoded_url>

    Fetches Open Graph metadata for the given URL, with a 1-hour
    in-memory cache to avoid re-fetching on repeat visits.
    """
    url = request.GET.get('url', '').strip()
    if not url:
        return JsonResponse({'error': 'Missing url parameter'}, status=400)

    # Check cache
    now = time.time()
    if url in _preview_cache:
        ts, data = _preview_cache[url]
        if now - ts < _CACHE_TTL:
            return JsonResponse(data)

    # Fetch metadata
    metadata = fetch_og_metadata(url)
    data = metadata if metadata is not None else {'url': url, 'error': True}

    # Evict oldest entry if cache is full
    if len(_preview_cache) >= _CACHE_MAX_SIZE:
        oldest_key = min(_preview_cache, key=lambda k: _preview_cache[k][0])
        del _preview_cache[oldest_key]

    _preview_cache[url] = (now, data)
    return JsonResponse(data)
