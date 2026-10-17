(() => {
  'use strict';
  const data = window.CAREER || {};
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe = url => { try { let u = new URL(url); return u.protocol==='https:' ? u.href : ''; } catch { return ''; } };
  const link = (url, text='VIEW SOURCE ↗') => safe(url) ? `<a href="${e(safe(url))}" target="_blank" rel="noopener noreferrer">${e(text)}</a>` : '';
  const when = x => x.date && x.date.endsWith('-01-01') ? x.year : (x.date || x.year);
  const archive = data.media || [];
  const mediaQuery = document.getElementById('media-search');
  const mediaYear = document.getElementById('media-year');
  const mediaType = document.getElementById('media-type');
  const mediaCount = document.getElementById('media-count');
  const mediaList = document.getElementById('media-list');
  const mediaMore = document.getElementById('media-more');
  let show = 12;
  for (let y=2026; y>=2019; y--) mediaYear?.insertAdjacentHTML('beforeend',`<option value="${y}">${y}</option>`);
  for (const t of [...new Set(archive.map(x=>x.kind))].sort()) mediaType?.insertAdjacentHTML('beforeend',`<option value="${e(t)}">${e(t)}</option>`);
  function newsCard(x, live=false){
    return `<article class="media-card${x.featured?' featured':''}">
       <span class="type">${e(live?'AUTOMATIC DISCOVERY · NOT REVIEWED':x.kind)}</span>
       <div class="media-meta">${e(when(x))} <span aria-hidden="true"> · </span> ${e(x.source)}</div>
       <h3>${e(x.title)}</h3><p>${e(x.desc || (live?'Potential name match from Google News. Confirm the article actually refers to the FVSU researcher.':''))}</p>
       ${link(x.url,live?'REVIEW POTENTIAL MATCH ↗':'READ ORIGINAL ↗')}
       ${live?'':`<div class="check">SOURCE: ${e(x.verified || 'CV and source records')}</div>`}
    </article>`;
  }
  function renderMedia(){
    if(!mediaList)return;
    const q=mediaQuery.value.toLocaleLowerCase().trim();
    const year=mediaYear.value, type=mediaType.value;
    const matches=archive.filter(x=>(year==='all'||String(x.year)===year)&&(type==='all'||x.kind===type)&&(!q||[x.title,x.source,x.desc,x.year,x.kind].join(' ').toLocaleLowerCase().includes(q)));
    mediaList.innerHTML=matches.slice(0,show).map(x=>newsCard(x)).join('')||'<p class="career-subcopy">No indexed records match this search. Try another term or year.</p>';
    mediaMore.hidden=matches.length<=show;
    mediaMore.textContent=`LOAD MORE COVERAGE ↓ (${Math.max(0,matches.length-show)} remaining)`;
    mediaCount.textContent=`Showing ${Math.min(matches.length,show)} of ${matches.length} reviewed archive records`;
  }
  mediaQuery?.addEventListener('input',()=>{show=12;renderMedia()});
  mediaYear?.addEventListener('change',()=>{show=12;renderMedia()});
  mediaType?.addEventListener('change',()=>{show=12;renderMedia()});
  mediaMore?.addEventListener('click',()=>{show+=12;renderMedia()});
  renderMedia();
  function feature(x){const unverified=/Confirm award/i.test(x.status||'');return `<article class="feature-card"><span class="type">${e(x.year)}</span><h3>${e(x.title)}</h3><div class="amount">${e(x.amount)}</div><span class="org">${e(x.sponsor)}</span><p>${e(x.description)}</p><div class="tag${unverified?' verify':''}">${e(x.status)}</div><p><b>${e(x.role)}</b></p>${link(x.link,'PROJECT / SOURCE ↗')}</article>`;}
  const gg=document.getElementById('grant-grid');if(gg)gg.innerHTML=(data.grants||[]).map(feature).join('');
  const pp=document.getElementById('proposal-grid');if(pp)pp.innerHTML=(data.proposals||[]).map(x=>`<article class="mini-card"><b>${e(x.title)}</b><span>${e(x.amount)}</span><p>${e(x.agency)} · ${e(x.note)}</p></article>`).join('');
  const ag=document.getElementById('award-grid');if(ag)ag.innerHTML=(data.awards||[]).map(x=>`<article class="feature-card"><span class="type">${e(x.year)} / RECOGNITION</span><h3>${e(x.title)}</h3><p class="org">${e(x.issuer)}</p><p>${e(x.note)}</p>${link(x.link)}</article>`).join('');
  const teaching=document.getElementById('teaching-grid');if(teaching)teaching.innerHTML=(data.teaching||[]).map(x=>`<article class="timeline-card"><span class="date">${e(x.when)}</span><h4>${e(x.course)}</h4><div class="venue">${e(x.institution)}</div><p>${e(x.contribution)}</p></article>`).join('');
  const mentors=document.getElementById('mentor-grid');if(mentors)mentors.innerHTML=(data.mentoring||[]).map(x=>`<article class="feature-card"><span class="type">MENTORSHIP</span><strong class="metric">${e(x.metric)}</strong><h3>${e(x.title)}</h3><p>${e(x.description)}</p></article>`).join('');
  const talks=document.getElementById('talk-grid');if(talks)talks.innerHTML=(data.talks||[]).map(x=>`<article class="timeline-card"><span class="date">${e(x.when)} · ${e(x.kind)}</span><h4>${e(x.title)}</h4><div class="venue">${e(x.venue)}</div>${link(x.link,'EVENT SOURCE ↗')}</article>`).join('');
  const liveList=document.getElementById('live-news-list'), livePapers=document.getElementById('live-paper-list'), liveStatus=document.getElementById('live-status');
  async function loadUpdates(){
    if(!liveList || !livePapers)return;
    try{
      const res=await fetch('generated/latest.json',{cache:'no-store'});
      if (!res.ok) throw Error('Status '+res.status);
      const latest=await res.json();
      if(!latest || typeof latest!=='object')throw Error('Invalid update data');
      let news=Array.isArray(latest.news)?latest.news:[];
      let papers=Array.isArray(latest.papers)?latest.papers:[];
      const existingUrls=new Set(archive.map(x=>safe(x.url)));
      news=news.filter(x=>x&&safe(x.url)&&!existingUrls.has(safe(x.url))).slice(0,15);
      const existingTitles=new Set([...(window.BIBLIOGRAPHY?.papers||[]),...(window.BIBLIOGRAPHY?.chapters||[])].map(x=>String(x.title).toLocaleLowerCase().replace(/[^a-z0-9]+/g,'')));
      papers=papers.filter(x=>x&&x.title&&!existingTitles.has(String(x.title).toLocaleLowerCase().replace(/[^a-z0-9]+/g,''))).slice(0,15);
      liveList.innerHTML=news.length?news.map(x=>newsCard(x,true)).join(''):'<p class="career-subcopy">No new potential news matches available from the latest feed.</p>';
      livePapers.innerHTML=papers.length?papers.map(x=>`<article class="live-card"><span class="type">NEWLY INDEXED · ${e(x.year||'YEAR UNKNOWN')}</span><h4>${e(x.title)}</h4><p>${e(x.venue||'OpenAlex indexed record')} · ${e(x.date||'')}</p>${link(x.url,'VIEW INDEXED RECORD ↗')}</article>`).join(''):'<p class="career-subcopy">No newer records outside the curated publication list were discovered.</p>';
      liveStatus.textContent=latest.updated_at?`Last automated check: ${new Date(latest.updated_at).toLocaleString()} · News: ${latest.sources?.news || 'unknown'} · Publications: ${latest.sources?.papers || 'unknown'}`:'Automatic checks are configured but have not run yet; enable GitHub Pages and Actions to activate them.';
    }catch(err){liveStatus.textContent='Live discovery is unavailable in this local preview. It runs automatically after GitHub deployment.'; liveList.innerHTML='<p class="career-subcopy">The reviewed 2019–2026 archive above remains available offline.</p>';}
  }
  loadUpdates();
})();
