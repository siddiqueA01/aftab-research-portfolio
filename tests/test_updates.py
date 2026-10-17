"""Offline regression checks for the scheduled discover-and-publish pipeline."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import update_live


class DiscoveryTests(unittest.TestCase):
    def test_news_entries_accumulate(self):
        old = [{'title': 'Historic story about Aftab Siddique', 'url': 'https://example.org/2019', 'date': '2019-01-01', 'source': 'Archive'}]
        fresh = [{'title': 'New story about Aftab Siddique', 'url': 'https://example.org/2026', 'date': '2026-10-14', 'source': 'Media'}]
        result = update_live.merge_news(old, fresh)
        self.assertEqual(len(result), 2)
        self.assertEqual({x['url'] for x in result}, {'https://example.org/2019', 'https://example.org/2026'})

    def test_news_repeats_do_not_duplicate(self):
        entry = {'title': 'Aftab Siddique speaks', 'source': 'University', 'url': 'https://example.org/story'}
        self.assertEqual(len(update_live.merge_news([entry], [entry])), 1)

    def test_invalid_link_not_displayed(self):
        entry = {'title': 'Aftab Siddique wins', 'source': 'Unknown', 'url': 'javascript:alert(1)'}
        self.assertEqual(update_live.merge_news([], [entry]), [])

    def test_papers_dedupe_by_doi(self):
        old = [{'title': 'Same paper', 'doi': 'https://doi.org/10.1234/test', 'url': 'https://doi.org/10.1234/test'}]
        recent = [{**old[0], 'venue': 'Journal'}]
        self.assertEqual(len(update_live.merge_papers(old, recent)), 1)

    def test_feed_error_retains_previous_records(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / 'latest.json'
            target.write_text(json.dumps({'news': [{'title':'Old story', 'source':'A', 'url':'https://example.org/old'}], 'papers': []}), encoding='utf-8')
            with patch.object(update_live, 'OUT', target), patch.object(update_live, 'news_feed', side_effect=OSError('offline')), patch.object(update_live, 'indexed_works', return_value=[]):
                update_live.update()
            payload = json.loads(target.read_text(encoding='utf-8'))
            self.assertEqual(len(payload['news']), 1)
            self.assertIn('unavailable', payload['sources']['news'])


if __name__ == '__main__':
    unittest.main()
