(()=>{'use strict';const $=s=>document.querySelector(s),all=s=>document.querySelectorAll(s),e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),safe=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:''}catch{return ''}},link=(v,t)=>safe(v)?`<a href="${e(safe(v))}" target="_blank" rel="noopener noreferrer">${e(t)} ↗</a>`:'';

const paperStyle=document.createElement('style');
paperStyle.textContent=`
.paper-motion{display:inline-block;width:38px;height:34px;margin-right:10px;vertical-align:-10px;flex-shrink:0}
.paper-motion svg{display:block;width:100%;height:100%;overflow:hidden}
.paper-motion .drip{animation:research-drip 2.8s ease-in infinite}
.paper-motion .ripple{transform-origin:20px 29px;animation:research-ripple 2.8s ease-out infinite}
.paper-motion .blink{transform-box:fill-box;transform-origin:center;animation:research-blink 5s infinite}
.paper-motion .signal{stroke-dasharray:50;animation:research-signal 3s linear infinite}
.paper-motion .float{animation:research-float 4s ease-in-out infinite}
@keyframes research-drip{0%{transform:translateY(-9px);opacity:0}20%{opacity:1}70%{transform:translateY(4px);opacity:1}85%,100%{transform:translateY(9px);opacity:0}}
@keyframes research-ripple{0%,65%{opacity:0;transform:scaleX(.4)}80%{opacity:.7}100%{opacity:0;transform:scaleX(1.4)}}
@keyframes research-blink{0%,43%,49%,100%{transform:scaleY(1)}46%{transform:scaleY(.12)}}
@keyframes research-signal{to{stroke-dashoffset:-100}}
@keyframes research-float{50%{transform:translateY(-2px)}}
@media(prefers-reduced-motion:reduce){.paper-motion *{animation:none!important}.paper-motion .ripple{opacity:.4}}
`;
document.head.append(paperStyle);
const topicIcons={
blood:'<path d="M9 29h24" stroke="#c9a8aa"/><ellipse class="ripple" cx="20" cy="29" rx="8" ry="2" stroke="#bf344b"/><path class="drip" d="M20 5c-2 5-7 9-7 13a7 7 0 0 0 14 0c0-4-5-8-7-13Z" fill="#c5324b" stroke="#aa203b"/><path class="drip" d="M16 18q0 4 3 5" stroke="#ffbbc6"/>',
eye:'<path d="M7 15 2 9l9 1M29 12l9-4-4 10M12 10l-1-6m15 6 2-7" stroke="#9e7b57"/><path d="M8 17q12-15 25 0-12 13-25 0Z" fill="#e6c9a4" stroke="#8b664b"/><g class="blink"><path d="M9 17q12-8 23 0-11 8-23 0Z" fill="#fff8ec"/><ellipse cx="21" cy="17" rx="7" ry="5" fill="#be8a3f"/><rect x="15" y="16" width="12" height="3" rx="1.3" fill="#283130"/><path d="M11 21q10 6 19-1" stroke="#d9767c" stroke-width="2"/></g>',
impedance:'<rect x="5" y="7" width="30" height="22" rx="5" fill="#e0eff0" stroke="#29777c"/><path class="signal" d="M8 19h5l3-7 5 13 4-10 3 4h4" stroke="#208c97" stroke-width="2"/><path d="M12 7V3m16 4V3m-16 26v3m16-3v3" stroke="#29777c"/>',
radio:'<circle cx="20" cy="20" r="3" fill="#3877b5"/><path class="signal" d="M13 13q-7 7 0 14m14-14q7 7 0 14M8 8q-12 12 0 24M32 8q12 12 0 24" stroke="#438bb2" stroke-width="2"/><path d="M20 23v10" stroke="#3877b5"/>',
parasite:'<path class="float" d="M7 25c-6-14 12-22 16-14s-15 11-8 18 22-3 17-13" stroke="#a06a9c" stroke-width="4"/><circle cx="31" cy="15" r="1" fill="#49354d"/>',
plant:'<g class="float"><path d="M19 31V14m0 10-8-7m8 3 8-8" stroke="#4b7d4e"/><path d="M18 20C4 22 4 8 5 7c12 0 15 6 13 13ZM20 16C17 5 29 3 34 5c0 9-5 14-14 11Z" fill="#8db581" stroke="#4b7d4e"/></g>',
map:'<path d="m3 9 11-4 12 4 11-4v25l-11 4-12-4-11 4Zm11-4v25m12-21v25" fill="#e4ede4" stroke="#729583"/><g class="float"><path d="M27 4a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6Z" fill="#bc6752"/><circle cx="27" cy="10" r="2" fill="#fff"/></g>',
microbe:'<g class="float" stroke="#658c60"><path d="M12 8 9 4m19 22 3 5M7 18H2m30-3 5-1M18 7V2m-5 26-2 5"/><rect x="9" y="7" width="23" height="21" rx="10" transform="rotate(30 20 18)" fill="#bdd5a7"/><circle cx="16" cy="15" r="1.5" fill="#658c60"/><circle cx="23" cy="20" r="2" fill="#658c60"/></g>',
poultry:'<g class="float"><path d="M7 20q2-9 11-6l5-6 6 4v8q-2 11-13 10Q4 29 7 20Z" fill="#f0dab6" stroke="#aa8154"/><path d="m29 13 7 3-7 3" fill="#d79743"/><path d="m23 8 0-4 4 1 2 5" stroke="#bd5261" stroke-width="3"/><circle cx="26" cy="13" r="1" fill="#283130"/><path d="m16 30-2 4m9-5 1 5M10 21q6 5 11-1" stroke="#aa8154"/></g>',
dairy:'<g class="float"><path d="M14 4h12v5l4 6v18H10V15l4-6Z" fill="#f2eee3" stroke="#8e9d99"/><path d="M14 9h12M10 19h20" stroke="#8e9d99"/><path d="M20 21c-2 3-4 4-4 6a4 4 0 0 0 8 0c0-2-2-3-4-6Z" fill="#8fbab9"/></g>',
temperature:'<path d="M16 23V7a4 4 0 0 1 8 0v16a8 8 0 1 1-8 0Z" fill="#f4e4d7" stroke="#bb795d"/><path class="float" d="M20 12v16" stroke="#c85a4b" stroke-width="3"/><circle cx="20" cy="28" r="4" fill="#c85a4b"/><path d="M29 9h5m-5 7h3" stroke="#bb795d"/>',
data:'<path d="M6 5v27h29" stroke="#6d87a0"/><path class="signal" d="m9 26 7-9 7 4 10-13" stroke="#3d8baf" stroke-width="2"/><circle cx="16" cy="17" r="2" fill="#3d8baf"/><circle cx="23" cy="21" r="2" fill="#3d8baf"/>',
packaging:'<g class="float"><path d="m8 10 12-6 13 6v20l-13 5-12-5Zm0 0 12 6 13-6M20 16v19" fill="#ecddc2" stroke="#ad8b5f"/><path d="m14 7 13 6v6" stroke="#ad8b5f"/></g>'
};
const topicOverrides={'paper-011':'eye','paper-016':'blood','paper-040':'parasite','paper-007':'packaging','paper-015':'temperature','paper-027':'temperature','paper-033':'microbe','paper-037':'plant','paper-038':'microbe','paper-039':'microbe'};
function topicFor(p){
 if(topicOverrides[p.id])return topicOverrides[p.id];
 const t=(p.title||'').toLowerCase();
 if(/famacha|conjunctiv/.test(t))return 'eye';
 if(/blood|hematocrit|haematocrit/.test(t))return 'blood';
 if(/impedance|bioelectrical/.test(t))return 'impedance';
 if(/rfid|radio.?frequency/.test(t))return 'radio';
 if(/webgis|geo.?spatial|geo-information/.test(t))return 'map';
 if(/salmonella|escherichia|bacter|antimicrobial/.test(t))return 'microbe';
 if(/nematod|parasit|coccidi|haemonch/.test(t))return 'parasite';
 if(/milk|cheese|yogurt|dairy/.test(t))return 'dairy';
 if(/plant|leaf|lespedeza|alfalfa|root|sugarcane/.test(t))return 'plant';
 if(/poultry|chicken|broiler|breast/.test(t))return 'poultry';
 if(/temperature|heat stress|cold chain/.test(t))return 'temperature';
 return 'data';
}
const paperIcon=p=>'<span class="paper-motion" aria-hidden="true"><svg viewBox="0 0 40 38" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+topicIcons[topicFor(p)]+'</svg></span>';
const isPublishedPaper=p=>p.kind==='paper'&&/^Published\b/i.test(p.status||'');
document.querySelectorAll('.proof article h3').forEach((title,i)=>title.insertAdjacentHTML('afterbegin',paperIcon({title:['bioelectrical impedance','blood drop','RFID'][i]||title.textContent})));

const P=window.PORTFOLIO.projects,C=window.CAREER,B=window.BIBLIOGRAPHY;
$('#additional-work').innerHTML=P.filter(p=>!['cl','anemia','rfid'].includes(p.id)).map(p=>`<article class="plain-entry"><small>${e(p.status)} · ${e(p.year)}</small><h4>${e(p.short)}</h4><p>${e(p.summary)}</p><p>${e(p.takeaway)}</p>${link(p.href,'Publication')}</article>`).join('');const entries=[...B.papers,...B.chapters,...B.abstracts].sort((a,b)=>(b.year||0)-(a.year||0));let limit=10;const q=$('#record-query'),type=$('#record-type'),year=$('#record-year');[...new Set(entries.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a).forEach(y=>year.insertAdjacentHTML('beforeend',`<option value="${e(y)}">${e(y)}</option>`));function render(){const term=q.value.trim().toLowerCase(),m=entries.filter(p=>(type.value==='all'||p.kind===type.value)&&(year.value==='all'||String(p.year)===year.value)&&(!term||[p.title,p.authors,p.venue,p.citation].join(' ').toLowerCase().includes(term)));$('#record-status').textContent=`Showing ${Math.min(limit,m.length)} of ${m.length} matching contributions`;$('#record-list').innerHTML=m.slice(0,limit).map(p=>`<article class="record-entry"><span class="date">${e(p.year)}</span><div><h4>${isPublishedPaper(p)?paperIcon(p):''}${e(p.title)}</h4><p>${e(p.authors)}</p><p>${e(p.venue)}</p><details><summary>Reference, status & source</summary><p>${e(p.citation)}</p><p>${e(p.status)} · ${e(p.verification||'Source inventory')}${p.historicalOnly?' · Historical record; not independently verified':''}</p></details></div>${link(p.href,p.direct?'DOI':'Find')}</article>`).join('')||'<p>No contributions match these filters.</p>';$('#record-more').hidden=limit>=m.length}[q,type,year].forEach(n=>n.addEventListener(n===q?'input':'change',()=>{limit=10;render()}));$('#record-more').onclick=()=>{limit+=10;render()};render();all('[data-panel]').forEach(btn=>btn.onclick=()=>{all('[data-panel]').forEach(n=>n.setAttribute('aria-pressed',String(n===btn)));all('.record-panel').forEach(n=>n.hidden=n.id!=='panel-'+btn.dataset.panel)});
function plain(target,items,meta,title,body){$(target).innerHTML=items.map(x=>`<article class="plain-entry"><small>${e(meta(x))}</small><h4>${e(title(x))}</h4><p>${e(body(x))}</p>${link(x.url||x.link,'Source')}</article>`).join('')}
plain('#teaching-list',C.teaching,x=>x.when,x=>x.course,x=>x.institution+' · '+x.contribution);plain('#mentoring-list',C.mentoring,x=>x.metric,x=>x.title,x=>x.description);plain('#awards-list',C.awards,x=>x.year,x=>x.title,x=>x.issuer+' · '+x.note);plain('#grants-list',C.grants,x=>x.year+' · '+x.status,x=>x.title,x=>x.amount+' · '+x.sponsor+' · '+x.role+'. '+x.description);plain('#media-list',C.media,x=>x.year+' · '+x.kind+' · '+x.source,x=>x.title,x=>x.desc+' Source: '+x.verified);plain('#talks-list',C.talks,x=>x.when+' · '+x.kind,x=>x.title,x=>x.venue);
(async()=>{try{const r=await fetch('generated/latest.json',{cache:'no-store'});if(!r.ok)throw Error();const d=await r.json();$('#update-status').textContent=d.updated_at?'Latest check: '+new Date(d.updated_at).toLocaleString()+' · '+(d.sources?.news||'News status unavailable')+' · '+(d.sources?.papers||'Publication status unavailable'):'No completed automatic check recorded yet.';const titles=new Set([...B.papers,...B.chapters].map(p=>p.title.toLowerCase().replace(/[^a-z0-9]/g,''))),urls=new Set(C.media.map(p=>safe(p.url)));const news=(Array.isArray(d.news)?d.news:[]).filter(x=>safe(x.url)&&!urls.has(safe(x.url))),papers=(Array.isArray(d.papers)?d.papers:[]).filter(x=>safe(x.url)&&x.title&&!titles.has(x.title.toLowerCase().replace(/[^a-z0-9]/g,'')));$('#discovery-list').innerHTML=[...news.map(x=>({...x,kind:'Potential name match · review required'})),...papers.map(x=>({...x,kind:'Newly indexed publication · review required'}))].slice(0,30).map(x=>`<article class="plain-entry"><small>${e(x.kind)}</small><h4>${e(x.title)}</h4><p>${e(x.source||x.venue||'')}</p>${link(x.url,'Review record')}</article>`).join('')||'<p>No additional unreviewed discoveries in the latest update.</p>'}catch{$('#update-status').textContent='Automatic discovery data is unavailable in this preview. The curated record remains available.'}})();})();


/* Bio-Tech Cafe: read-only WordPress feed integration; existing styles and site settings untouched. */
(function(){
 const nav=document.querySelector('header nav');
 if(nav&&!nav.querySelector('[href="#biotech-cafe"]')){const a=document.createElement('a');a.href='#biotech-cafe';a.textContent='Bio-Tech Cafe';nav.insertBefore(a,nav.querySelector('[href="#contact"]'));}
 const contact=document.querySelector('#contact');if(!contact||document.querySelector('#biotech-cafe'))return;
 const section=document.createElement('section');section.className='chapter wrap';section.id='biotech-cafe';
 section.innerHTML='<p class="eyebrow">SCIENCE COMMUNICATION · WEEKLY INSIGHTS</p><div class="chapter-head"><h2>Bio-Tech Cafe</h2><p>Accessible science on AI, animal health, food safety and biotechnology. New articles appear here after publication.</p></div><div id="biotech-articles" class="proof" aria-live="polite"><article><h3>Latest science stories</h3><p>Loading recent articles…</p></article></div><div class="actions"><a class="button" href="https://biotechcafe.org/" target="_blank" rel="noopener noreferrer">Visit Bio-Tech Cafe ↗</a></div>';
 contact.parentNode.insertBefore(section,contact);
 const target=section.querySelector('#biotech-articles');
 const fallback=[{title:'Can Artificial Intelligence Detect Foodborne Pathogens Before They Become a Problem?',URL:'https://biotechcafe.org/2026/10/26/ai-rapid-foodborne-pathogen-detection/',date:'2026-10-26',excerpt:'How rapid biosensors and machine learning may improve foodborne pathogen screening.'}];
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const strip=s=>{const d=document.createElement('div');d.innerHTML=s||'';return d.textContent||''};
 const render=posts=>{target.innerHTML=posts.slice(0,3).map(p=>{const title=strip(p.title||p.title?.rendered||'Bio-Tech Cafe article'),url=p.URL||p.link||'https://biotechcafe.org/',date=p.date||'',excerpt=strip(p.excerpt||p.excerpt?.rendered||'');const img=p.featured_image||'';return '<article>'+ (img&&/^https:\/\//.test(img)?'<img src="'+esc(img)+'" alt="" loading="lazy" style="width:100%;aspect-ratio:16/9;object-fit:cover;margin-bottom:15px">':'')+'<small>'+esc(String(date).slice(0,10))+' · BIO-TECH CAFE</small><h3>'+esc(title)+'</h3><p>'+esc(excerpt.slice(0,190))+'</p><p style="margin-top:15px"><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Read article ↗</a></p></article>'}).join('')};
 render(fallback);
 fetch('https://public-api.wordpress.com/rest/v1.1/sites/biotechcafe.org/posts/?number=3&fields=title,URL,date,excerpt,featured_image',{mode:'cors'}).then(r=>{if(!r.ok)throw Error('feed');return r.json()}).then(data=>{if(Array.isArray(data.posts)&&data.posts.length)render(data.posts)}).catch(()=>{});
})();


/* Front-page publication window. Curated records are visibly separated from newly indexed candidates. */
(() => {
  'use strict';
  const archive = window.BIBLIOGRAPHY;
  const anchor = document.querySelector('#record');
  if (!archive || !anchor || document.querySelector('#latest-publications')) return;
  const escapeHTML = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const doi = x => String(x || '').toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//,'').trim();
  const cleanURL = x => { try { const u = new URL(x); return (u.protocol === 'https:' && /^(doi\.org|www\.mdpi\.com|mdpi\.com)$/.test(u.hostname)) ? u.href : ''; } catch { return ''; } };
  const verified = archive.papers.filter(p => p.published && p.direct && cleanURL(p.href))
    .sort((a,b) => String(b.published).localeCompare(String(a.published))).slice(0,4);
  const known = new Set(archive.papers.map(p => doi(p.href)));
  const section = document.createElement('section');
  section.id = 'latest-publications';
  section.className = 'publication-window';
  section.setAttribute('aria-labelledby', 'publication-window-title');
  const style = document.createElement('style');
  style.textContent = [
    '.publication-window{background:#eaf0f5;border-top:1px solid #cbd9e3;border-bottom:1px solid #cbd9e3;padding:66px 0;color:#172d40}',
    '.publication-window .pub-head{display:flex;justify-content:space-between;align-items:end;gap:25px;margin-bottom:26px}',
    '.publication-window .pub-kicker{font:700 10px/1.4 Arial,sans-serif;letter-spacing:.2em;color:#315c7e;text-transform:uppercase}',
    '.publication-window h2{font:500 clamp(32px,4vw,47px)/1.1 Georgia,serif;letter-spacing:-1px;margin-top:10px}',
    '.publication-window .pub-intro{max-width:390px;font:13px/1.7 Arial,sans-serif;color:#536a7b}',
    '.publication-window .pub-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}',
    '.publication-window .pub-card{background:#fff;border:1px solid #ced9e2;border-top:3px solid #2c657a;padding:26px;min-width:0;transition:transform .2s ease,border-color .2s ease}',
    '.publication-window .pub-card:hover{transform:translateY(-3px);border-color:#85b3bf}',
    '.publication-window .pub-meta{font:700 10px/1.5 Arial,sans-serif;letter-spacing:.1em;color:#417487;text-transform:uppercase}',
    '.publication-window h3{font:500 19px/1.3 Georgia,serif;margin:13px 0 16px;letter-spacing:-.1px}',
    '.publication-window a{font:700 11px/1.5 Arial,sans-serif;color:#125a78;text-decoration:underline;text-underline-offset:4px}',
    '.publication-window .pub-indexed{margin-top:23px;border-top:1px solid #bbccd8;padding-top:15px}',
    '.publication-window .pub-indexed summary{font:700 12px/1.5 Arial,sans-serif;cursor:pointer}',
    '.publication-window .pub-indexed ul{list-style:none;padding:0;margin:12px 0;display:grid;gap:10px}',
    '.publication-window .pub-indexed li{font:12px/1.6 Arial,sans-serif}',
    '.publication-window .pub-indexed li span{color:#5c7181}',
    '.publication-window .pub-refresh{font:11px/1.6 Arial,sans-serif;color:#607588;margin:11px 0 0}',
    '@media(max-width:700px){.publication-window{padding:45px 0}.publication-window .pub-head{display:block}.publication-window .pub-intro{margin-top:15px}.publication-window .pub-grid{grid-template-columns:1fr}.publication-window .pub-card{padding:21px}}',
    '@media(prefers-reduced-motion:reduce){.publication-window .pub-card{transition:none}.publication-window .pub-card:hover{transform:none}}'
  ].join('\n');
  document.head.appendChild(style);
  const cards = verified.map(p => '<article class="pub-card" data-paper-topic="' +
      (/Bemisia|insect|whitefly/i.test(p.title) ? 'entomology' : 'bioimpedance') + '"><p class="pub-meta">Publisher verified · ' +
      escapeHTML(p.published) + ' · ' + escapeHTML(p.venue.split(',')[0]) +
      '</p><h3>' + escapeHTML(p.title) + '</h3><a href="' + escapeHTML(cleanURL(p.href)) +
      '" target="_blank" rel="noopener noreferrer">Read publication ↗</a></article>').join('');
  section.innerHTML = '<div class="wrap"><div class="pub-head"><div><p class="pub-kicker">Research archive / New releases</p>' +
    '<h2 id="publication-window-title">Recently published.</h2></div><p class="pub-intro">Peer-reviewed journal articles, linked to their publisher records. Automatically indexed candidates appear separately until reviewed.</p></div>' +
    '<div class="pub-grid">' + cards + '</div><details class="pub-indexed" id="publication-indexed" hidden><summary>Newly indexed research records requiring review <span id="pub-new-count"></span></summary>' +
    '<ul id="pub-new-list"></ul></details><p class="pub-refresh" id="pub-refresh">Verified journal records. Automatic research feed loads separately.</p></div>';
  anchor.parentNode.insertBefore(section, anchor);
  fetch('generated/latest.json', {cache:'no-store'}).then(r=>{if(!r.ok)throw Error('feed unavailable');return r.json()}).then(data=>{
    const items = (Array.isArray(data.papers) ? data.papers : []).filter(p=>{
      const url=cleanURL(p.url),title=String(p.title||''),venue=String(p.venue||'');
      return url && !known.has(doi(url)) && /^\d{4}-\d{2}-\d{2}$/.test(p.date||'') &&
        Number(p.year)>=2026 && !/^(PS\d|PSI|PSV|^\d+[\s.])/.test(title) &&
        !/preprint|zenodo|ebook|conference|proceedings|journal of animal science/i.test(venue);
    }).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,5);
    if(items.length){
      const box=section.querySelector('#publication-indexed');box.hidden=false;
      section.querySelector('#pub-new-count').textContent='(' + items.length + ')';
      section.querySelector('#pub-new-list').innerHTML=items.map(p=>'<li><span>'+
        escapeHTML(p.date)+' · '+escapeHTML(p.venue)+' · Indexed candidate, not yet curated</span><div>'+
        '<a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(cleanURL(p.url))+'">'+escapeHTML(p.title)+' ↗</a></div></li>').join('');
    }
    section.querySelector('#pub-refresh').textContent='Automatic index last checked: ' +
      (data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'not available') +
      '. New records are reviewed before entering the verified bibliography.';
  }).catch(()=> { section.querySelector('#pub-refresh').textContent='Verified publications available; automatic index temporarily unavailable.'; });
})();


/* Context-aware research field lens, replacing the previous decorative cursor dots. */
(() => {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches) return;
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)return;
  canvas.id='research-field-lens';
  canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'999',opacity:'0.94'});
  document.body.appendChild(canvas);
  const toggle=document.createElement('button');
  toggle.type='button';toggle.textContent='◇ Field lens · on';
  toggle.setAttribute('aria-label','Turn off interactive research field lens');
  Object.assign(toggle.style,{position:'fixed',bottom:'16px',left:'16px',zIndex:'1000',background:'rgba(15,39,55,.93)',color:'#d5f2f3',border:'1px solid rgba(75,198,208,.55)',borderRadius:'4px',padding:'8px 12px',font:'11px Arial,sans-serif',letterSpacing:'.05em',cursor:'pointer'});
  document.body.appendChild(toggle);
  let on=true,w=0,h=0,dpr=1,x=0,y=0,mouseX=0,mouseY=0,mouseAt=-Infinity,mode='systems',frameAt=0;
  toggle.addEventListener('click',()=>{on=!on;canvas.style.display=on?'block':'none';toggle.textContent=on?'◇ Field lens · on':'◇ Field lens · off';toggle.setAttribute('aria-label',on?'Turn off interactive research field lens':'Turn on interactive research field lens')});
  function resize(){
    w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!x&&!y){x=w*.5;y=h*.45}
  }
  resize();addEventListener('resize',resize,{passive:true});
  const zones=[
    ['#work .proof article:nth-child(1)','impedance','BIOELECTRICAL / PHASE SPACE'],
    ['#work .proof article:nth-child(2)','blood','HEMATOLOGY / IMAGE MORPHOLOGY'],
    ['#work .proof article:nth-child(3)','behavior','BEHAVIOR / TEMPORAL SIGNAL'],
    ['#latest-publications .pub-card[data-paper-topic="entomology"]','entomology','ENTOMOLOGY / WING MORPHOMETRY'],
    ['#latest-publications .pub-card[data-paper-topic="bioimpedance"]','impedance','BIOELECTRICAL / PHASE SPACE'],
    ['#perspective','spectra','FOOD SCIENCE / SPECTRAL PROFILE'],
    ['#record','systems','INTELLIGENT SYSTEMS / PATTERN FIELD'],
    ['#innovation','systems','INTELLIGENT SYSTEMS / PATTERN FIELD']
  ];
  function targets(){return zones.map(z=>({el:document.querySelector(z[0]),mode:z[1],name:z[2]})).filter(z=>z.el)}
  function visible(z){const r=z.el.getBoundingClientRect();return r.bottom>110&&r.top<h-80&&r.left<w&&r.right>0}
  addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    mouseX=e.clientX;mouseY=e.clientY;mouseAt=performance.now();
    const el=document.elementFromPoint(mouseX,mouseY);
    const found=targets().find(z=>el && z.el.contains(el));
    if(found){mode=found.mode}
  },{passive:true});
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const line=(points,color,lw=1)=>{
    ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.beginPath();
    for(let i=0;i<points.length;i++){const p=points[i];i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])}
    ctx.stroke();
  };
  function signal(t,r){
    const cyan='rgba(112,239,236,.89)',soft='rgba(124,227,232,.3)',gold='rgba(241,205,132,.83)';
    if(mode==='impedance'){
      for(let k=0;k<3;k++){
        let pts=[];for(let i=0;i<=95;i++){const u=i/95,v=(u-.5)*r*1.85;
          pts.push([v,Math.sin(u*(9+k*4)+t*(1+k*.3))*Math.exp(-u*1.2)*(r*.4-k*5)+k*17-13]);}
        line(pts,k===1?gold:cyan,k===1?1.8:1.1);
      }
      ctx.strokeStyle=soft;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,r*.55,r*.24,-.55,0,Math.PI*2);ctx.stroke();
    } else if(mode==='blood'){
      for(let i=0;i<7;i++){
        const a=i*2.4+t*.17,px=Math.sin(a)*r*.56,py=Math.cos(a*1.3)*r*.46;
        ctx.save();ctx.translate(px,py);ctx.rotate(a*.52);ctx.strokeStyle=i%2?cyan:gold;
        ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,0,12+3*Math.sin(t+i),8,0,0,Math.PI*2);ctx.stroke();
        ctx.strokeStyle=soft;ctx.beginPath();ctx.ellipse(0,0,6,3.5,0,0,Math.PI*2);ctx.stroke();ctx.restore();
      }
      line([[-r*.7,0],[r*.7,0]],soft,.6);
    } else if(mode==='entomology'){
      for(const side of [-1,1]){
        ctx.save();ctx.scale(side,1);ctx.strokeStyle=cyan;ctx.lineWidth=1.1;ctx.beginPath();
        ctx.moveTo(0,12);ctx.bezierCurveTo(8,-57,67,-61,70,-19);
        ctx.bezierCurveTo(61,9,22,22,0,12);ctx.stroke();
        for(let i=0;i<6;i++){
          const endX=30+i*7,endY=-49+i*7;
          line([[0,12],[endX*.55,-6+i*2],[endX,endY]],i%2?soft:gold,.85);
          line([[endX*.55,-6+i*2],[endX+7,-1+i*4]],soft,.6);
        }
        ctx.restore();
      }
      line([[0,-33],[0,31]],gold,1.8);
    } else if(mode==='behavior'){
      for(let k=0;k<3;k++){
        let pts=[];for(let i=0;i<85;i++){const u=i/84,px=(u-.5)*r*1.8,spike=Math.pow(Math.max(0,Math.sin(u*22+t*.9+k*2)),12);
          pts.push([px,(k-1)*20-22*spike+4*Math.sin(u*11+k+t*.3)]);}
        line(pts,k===1?gold:cyan,1.2);
      }
      for(let j=0;j<12;j++){let px=(j/12-.5)*r*1.7;line([[px,48],[px,48-6-14*(1+Math.sin(j*2.7+t))*.5]],soft,1.1)}
    } else if(mode==='spectra'){
      let pts=[];for(let i=0;i<=120;i++){const u=i/120,pk=(m,s,a)=>a*Math.exp(-Math.pow((u-m)/s,2));
        const amp=pk(.21,.045,33)+pk(.46,.09,19)+pk(.65,.029,52)+pk(.82,.06,23);
        pts.push([(u-.5)*r*1.85,40-amp-4*Math.sin(u*40+t)]);}
      line(pts,cyan,1.8);
      for(let k=0;k<9;k++)line([[k*r*.21-r*.87,43],[k*r*.21-r*.87,49]],soft,.8);
      line([[-r*.91,43],[r*.91,43]],gold,1);
    } else {
      for(let k=-4;k<=4;k++){
        let pts=[];for(let i=0;i<=90;i++){const u=i/90;pts.push([(u-.5)*r*1.9,k*12 + 12*Math.sin(u*8+k*.7+t*.55)*Math.cos(u*5+t*.3)])}
        line(pts,k===0?gold:soft,k===0?1.5:.8);
      }
      for(let i=0;i<8;i++){const a=i*Math.PI/4+t*.12;ctx.fillStyle=cyan;ctx.fillRect(Math.cos(a)*r*.6-1,Math.sin(a)*r*.5-1,2,2)}
    }
  }
  function paint(time){
    requestAnimationFrame(paint);
    if(!on||document.hidden||time-frameAt<32)return;
    frameAt=time;
    const t=time*.001,manual=time-mouseAt<4300;
    const available=targets().filter(visible);
    const z=available.length?available[Math.floor(t/7)%available.length]:null;
    if(!manual&&z)mode=z.mode;
    const rect=z&&z.el.getBoundingClientRect();
    const autoX=rect?clamp(rect.left+rect.width*.58,90,w-90):w*(.5+.23*Math.sin(t*.31));
    const autoY=rect?clamp(rect.top+Math.min(rect.height*.5,165),90,h-90):h*(.45+.18*Math.cos(t*.28));
    const targetX=manual?mouseX:autoX,targetY=manual?mouseY:autoY;
    x+=(targetX-x)*(manual?.13:.025);y+=(targetY-y)*(manual?.13:.025);
    const r=manual?84:68;ctx.clearRect(0,0,w,h);
    ctx.save();ctx.translate(x,y);
    const background=ctx.createRadialGradient(0,0,8,0,0,r);
    background.addColorStop(0,'rgba(8,32,47,.90)');background.addColorStop(.83,'rgba(13,37,55,.80)');background.addColorStop(1,'rgba(13,37,55,.05)');
    ctx.fillStyle=background;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(0,0,r-3,0,Math.PI*2);ctx.clip();
    ctx.strokeStyle='rgba(141,212,221,.10)';ctx.lineWidth=.7;
    for(let k=-r;k<r;k+=16){ctx.beginPath();ctx.moveTo(k,-r);ctx.lineTo(k,r);ctx.moveTo(-r,k);ctx.lineTo(r,k);ctx.stroke()}
    signal(t,r);
    let sweep=(t*.36%2)-1;line([[sweep*r,-r],[sweep*r,r]],'rgba(245,207,131,.3)',.9);
    ctx.restore();
    ctx.strokeStyle='rgba(121,230,226,.84)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r-1,t*.23,t*.23+Math.PI*.76);ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,r+6,-t*.14,-t*.14+Math.PI*.34);ctx.stroke();
    ctx.strokeStyle='rgba(246,211,132,.9)';ctx.beginPath();ctx.moveTo(-r-10,0);ctx.lineTo(-r+3,0);ctx.moveTo(r-3,0);ctx.lineTo(r+10,0);ctx.moveTo(0,-r-10);ctx.lineTo(0,-r+3);ctx.stroke();
    ctx.fillStyle='rgba(232,255,252,.95)';ctx.font='600 9px Arial,sans-serif';
    const lbl={impedance:'BIOIMPEDANCE',blood:'HEMATOLOGY',behavior:'TEMPORAL AI',entomology:'ENTOMOLOGY',spectra:'SPECTROSCOPY',systems:'MULTIMODAL AI'}[mode];
    ctx.textAlign='center';ctx.fillText(lbl,0,r*.75);
    ctx.font='8px Arial,sans-serif';ctx.fillStyle='rgba(137,232,229,.75)';ctx.fillText('GENERATIVE FIELD / NOT A MEASUREMENT',0,r*.75+11);
    ctx.restore();
  }
  requestAnimationFrame(paint);
})();

