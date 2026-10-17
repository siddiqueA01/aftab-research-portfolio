#!/usr/bin/env python3
"""Daily discovery of potential public mentions and ORCID-linked scholarly work.

No API keys required. Reviewed content is never modified automatically. The
unreviewed discovery feed is retained between runs by committing generated/latest.json
back to the GitHub repository during the GitHub Actions workflow.
"""
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / 'generated' / 'latest.json'
ORCID = '0000-0003-1427-4777'
USER_AGENT = 'AftabSiddiqueResearchPortfolio/1.1 (https://orcid.org/' + ORCID + '; mailto:aftab.siddique@fvsu.edu)'


def get_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=25) as response:
        return json.load(response)


def get_xml(url):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Accept': 'application/rss+xml'})
    with urllib.request.urlopen(req, timeout=25) as response:
        return ET.fromstring(response.read())


def https_url(url):
    try:
        p = urllib.parse.urlsplit(str(url))
        return str(url) if p.scheme == 'https' and p.netloc and not p.username and not p.password else ''
    except (ValueError, TypeError):
        return ''


def clean(value):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]*>', '', str(value or ''))).strip()[:500]


def norm(value):
    return re.sub(r'[^a-z0-9]+', '', clean(value).lower())


def parse_news_date(value):
    try:
        return parsedate_to_datetime(str(value)).date().isoformat()
    except (ValueError, TypeError, IndexError, OverflowError):
        return ''


def news_feed():
    # Query includes an exact name, but matching alone does NOT confirm identity.
    searches = ['"Aftab Siddique" when:90d', '"Dr. Aftab Siddique" when:90d']
    results = []
    seen = set()
    for query in searches:
        url = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({
            'q': query, 'hl': 'en-US', 'gl': 'US', 'ceid': 'US:en'})
        root = get_xml(url)
        for item in root.findall('.//channel/item'):
            title = clean(item.findtext('title'))
            source = clean(item.findtext('source')) or 'Google News indexed source'
            link = https_url(item.findtext('link'))
            date = parse_news_date(item.findtext('pubDate'))
            key = norm(title) + '|' + norm(source)
            if not title or not link or key in seen:
                continue
            seen.add(key)
            results.append({
                'title': title, 'source': source, 'url': link, 'date': date,
                'year': int(date[:4]) if date else None,
                'desc': 'Automatically discovered exact-name Google News result. Identity and content require manual verification.'
            })
    return results[:80]


def indexed_works():
    # Resolve ORCID rather than relying on an ambiguous author-name search.
    # First use direct ORCID resolution. Some API gateways do not accept an
    # absolute ORCID URI as a path segment; fall back to an ORCID-filtered list.
    try:
        author = get_json('https://api.openalex.org/authors/https://orcid.org/' + ORCID)
    except Exception:
        params = urllib.parse.urlencode({
            'filter': 'orcid:https://orcid.org/' + ORCID,
            'per-page': 1,
            'mailto': 'aftab.siddique@fvsu.edu'
        })
        candidates = get_json('https://api.openalex.org/authors?' + params).get('results', [])
        if not candidates:
            raise ValueError('OpenAlex did not return an author with the specified ORCID')
        author = candidates[0]
    returned_orcid = str(author.get('orcid') or '')
    if returned_orcid and ORCID not in returned_orcid:
        raise ValueError('OpenAlex ORCID mismatch; refusing to attribute works')
    author_id = str(author.get('id') or '').rsplit('/', 1)[-1]
    if not re.fullmatch(r'A\d+', author_id):
        raise ValueError('OpenAlex did not resolve the ORCID to a valid author ID')
    params = urllib.parse.urlencode({
        'filter': 'author.id:' + author_id,
        'sort': 'publication_date:desc',
        'per-page': 200,
        'mailto': 'aftab.siddique@fvsu.edu'
    })
    works = get_json('https://api.openalex.org/works?' + params)
    results, seen = [], set()
    for paper in works.get('results', []):
        year = paper.get('publication_year')
        if not isinstance(year, int) or year < 2024:
            continue
        title = clean(paper.get('display_name'))
        doi = https_url(paper.get('doi'))
        openalex = https_url(paper.get('id'))
        link = doi or openalex
        if not title or not link:
            continue
        key = doi.lower() or norm(title)
        if key in seen:
            continue
        seen.add(key)
        primary_location = paper.get('primary_location') or {}
        venue = clean((primary_location.get('source') or {}).get('display_name'))
        results.append({
            'title': title, 'year': year, 'date': paper.get('publication_date'),
            'venue': venue or 'OpenAlex indexed work', 'url': link,
            'doi': doi, 'openalex_id': openalex
        })
    return results


def merge_news(previous, current):
    """Persist discoveries; never remove one just because its 30-day query expired."""
    by_key = {}
    for record in list(previous) + list(current):
        if not isinstance(record, dict) or not https_url(record.get('url')) or not clean(record.get('title')):
            continue
        key = norm(record.get('title')) + '|' + norm(record.get('source'))
        if key not in by_key:
            by_key[key] = record.copy()
        else:
            # Prefer latest corrected date/metadata while preserving existing first-seen information.
            first_seen = by_key[key].get('first_seen')
            by_key[key].update({k: v for k, v in record.items() if v not in (None, '')})
            if first_seen:
                by_key[key]['first_seen'] = first_seen
        by_key[key].setdefault('first_seen', datetime.now(timezone.utc).date().isoformat())
    return sorted(by_key.values(), key=lambda r: (str(r.get('date') or ''), str(r.get('first_seen') or '')), reverse=True)[:1000]


def merge_papers(previous, current):
    by_key = {}
    for record in list(previous) + list(current):
        if not isinstance(record, dict) or not https_url(record.get('url')) or not clean(record.get('title')):
            continue
        key = (record.get('doi') or '').lower() or norm(record.get('title'))
        by_key[key] = record
    return sorted(by_key.values(), key=lambda r: str(r.get('date') or ''), reverse=True)[:500]


def update():
    old = {}
    if OUT.exists():
        try:
            old = json.loads(OUT.read_text(encoding='utf-8'))
        except (OSError, ValueError):
            pass
    now = datetime.now(timezone.utc).isoformat(timespec='seconds')
    old_news = old.get('news') if isinstance(old.get('news'), list) else []
    old_papers = old.get('papers') if isinstance(old.get('papers'), list) else []
    payload = {
        'updated_at': now, 'sources': {},
        'news': old_news, 'papers': old_papers,
    }
    try:
        fresh = news_feed()
        payload['news'] = merge_news(old_news, fresh)
        payload['sources']['news'] = f'OK, {len(fresh)} recent matches, {len(payload["news"])} retained'
    except Exception as exc:
        payload['sources']['news'] = 'Feed unavailable; prior discoveries retained (' + type(exc).__name__ + ')'
        print('News feed unavailable:', repr(exc), file=sys.stderr)
    try:
        fresh = indexed_works()
        payload['papers'] = merge_papers(old_papers, fresh)
        payload['sources']['papers'] = f'OK, ORCID-filtered OpenAlex; {len(payload["papers"])} retained'
    except Exception as exc:
        payload['sources']['papers'] = 'Feed unavailable; prior discoveries retained (' + type(exc).__name__ + ')'
        print('OpenAlex unavailable:', repr(exc), file=sys.stderr)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Updated {OUT}: {len(payload["news"])} cumulative news discoveries; {len(payload["papers"])} research entries')
    # The workflow deploys even when external sources fail; no false update claim.


if __name__ == '__main__':
    update()
