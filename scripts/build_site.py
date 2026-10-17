#!/usr/bin/env python3
"""Build a self-contained static website for GitHub Pages deployment.

Career and publication data are maintained in their JSON files, so an editor
needs to update only one copy; generated JavaScript is created on each build.
"""
import json
import os
import shutil
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / '_site'
SITE.mkdir(parents=True, exist_ok=True)


def compile_json(source, dest, variable):
    data = json.loads((ROOT / source).read_text(encoding='utf-8'))
    if not isinstance(data, dict):
        raise ValueError(f'{source} must contain an object')
    content = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    # External scripts are not parsed as inline HTML, but escape the odd JS
    # line separator so generated JavaScript stays portable.
    content = content.replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    (ROOT / dest).write_text(f'window.{variable}={content};\n', encoding='utf-8')
    return data


career = compile_json('career.json', 'career-data.js', 'CAREER')
biblio = compile_json('bibliography.json', 'bibliography.js', 'BIBLIOGRAPHY')
assert len(biblio.get('papers', [])) == 40, 'Publication inventory should be reviewed after additions'
assert len(biblio.get('chapters', [])) == 12
assert len(biblio.get('abstracts', [])) == 63
assert len(career.get('media', [])) >= 22
for name in ['index.html', 'styles.css', 'data.js', 'app.js', 'bibliography.js', 'career-data.js', 'career.js']:
    shutil.copy2(ROOT / name, SITE / name)

# GitHub Pages project sites live under /repository/, so social preview images
# require absolute URLs. Set PORTFOLIO_SITE_URL later to use an owned domain.
canonical = os.getenv('PORTFOLIO_SITE_URL', '').strip().rstrip('/')
if not canonical and os.getenv('GITHUB_REPOSITORY'):
    owner, _, repository = os.environ['GITHUB_REPOSITORY'].partition('/')
    if owner and repository:
        canonical = f'https://{owner.lower()}.github.io'
        if repository.lower() != owner.lower() + '.github.io':
            canonical += '/' + repository
if canonical and canonical.startswith('https://'):
    target = SITE / 'index.html'
    html = target.read_text(encoding='utf-8')
    html = html.replace('content="assets/portrait-new.jpg"', f'content="{escape(canonical + "/assets/portrait-new.jpg", quote=True)}"')
    html = html.replace('</head>', f'  <link rel="canonical" href="{escape(canonical + "/", quote=True)}">\n  <meta property="og:url" content="{escape(canonical + "/", quote=True)}">\n</head>')
    target.write_text(html, encoding='utf-8')

for folder in ('assets', 'generated'):
    shutil.copytree(ROOT / folder, SITE / folder, dirs_exist_ok=True)
(SITE / '.nojekyll').touch()
print('Public website staged in', SITE)
print('Archived records:', len(career['media']), 'public appearances,', sum(len(biblio[k]) for k in ('papers','chapters','abstracts')), 'research outputs')
