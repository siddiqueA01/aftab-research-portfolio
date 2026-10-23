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
