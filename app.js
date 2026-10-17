(() => {
  'use strict';
  const {projects, publications} = window.PORTFOLIO;
  const biblio = window.BIBLIOGRAPHY;
  const allEntries = [...biblio.papers,...biblio.chapters,...biblio.abstracts].sort((a,b) => (b.year || 0) - (a.year || 0) || ({paper:0,chapter:1,abstract:2}[a.kind] - {paper:0,chapter:1,abstract:2}[b.kind]));
  function escapeHTML(value) {return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function safeHref(value){return /^https:\/\//.test(value) ? value : '#publications';}

  const grid = document.getElementById('project-grid');
  const count = document.getElementById('catalog-count');
  const pubList = document.getElementById('publication-list');
  const modal = document.getElementById('detail-modal');
  const searchDialog = document.getElementById('search-dialog');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  let activeFilter = 'all';
  let previousFocus = null;

  function projectCard(item) {
    return `<article class="project-card">
      <button type="button" class="card-cover" data-open-project="${item.id}" aria-label="View ${item.title}"><img src="${item.image}" alt="Abstract scientific illustration for ${item.short}" loading="lazy"><span class="card-badge ${item.statusType === 'ongoing' ? 'ongoing' : ''}">${item.label}</span><span class="card-play" aria-hidden="true">▶</span></button>
      <div class="card-body"><div class="card-category">${item.short}</div><h3>${item.title}</h3><p class="card-subtitle">${item.status} · ${item.year}</p><div class="card-bottom"><span>RESEARCH / ${item.year}</span><button class="card-open" type="button" data-open-project="${item.id}" aria-label="Explore ${item.title}">EXPLORE <span aria-hidden="true">↗</span></button></div></div>
    </article>`;
  }

  function renderProjects() {
    const items = activeFilter === 'all' ? projects : projects.filter(p => p.filters.includes(activeFilter));
    grid.innerHTML = items.map(projectCard).join('');
    count.textContent = `${String(items.length).padStart(2,'0')} ${items.length === 1 ? 'PROJECT' : 'PROJECTS'}`;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      const selected = b === button;
      b.classList.toggle('selected', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    renderProjects();
  }));

  function renderPublications() {
    pubList.innerHTML = publications.slice(0,5).map((paper, i) => `
      <a class="publication-row" href="${safeHref(paper.href)}" target="_blank" rel="noopener noreferrer" aria-label="Read ${escapeHTML(paper.title)} (opens new tab)">
        <span class="pub-num">${String(i + 1).padStart(2,'0')}</span>
        <div class="pub-main"><h3>${escapeHTML(paper.title)}</h3><div class="pub-meta">${escapeHTML(paper.journal)} <span>•</span> ${escapeHTML(paper.type)}</div></div>
        <div class="pub-right"><strong>${paper.year}</strong><span>VIEW DOI</span></div>
        <span class="pub-action" aria-hidden="true">↗</span>
      </a>`).join('');
  }

  const bibList = document.getElementById('bibliography-list');
  const bibQuery = document.getElementById('bib-query');
  const bibYear = document.getElementById('bib-year');
  const bibFirst = document.getElementById('bib-firstauthor');
  const bibStatus = document.getElementById('bib-status');
  const bibMore = document.getElementById('bib-more');
  let bibType='all';
  let bibDisplay=18;

  function typeLabel(kind){return ({paper:'PAPER / PROCEEDINGS',chapter:'BOOK CHAPTER',abstract:'CONFERENCE RECORD'})[kind];}
  function bibCard(p,i){
    const statusClass=p.status==='Accepted / in press' || p.status==='Published online'?' inpress':'';
    const incomplete = p.historicalOnly === true;
    const queryURL = safeHref(p.href);
    return `<article class="bib-entry" id="pub-${escapeHTML(p.id)}">
      <div class="bib-entry-number">${String(i+1).padStart(3,'0')}</div>
      <div class="bib-entry-content">
        <div class="bib-entry-meta"><span class="bib-kind bib-kind-${p.kind}">${typeLabel(p.kind)}</span><span>${p.year || '—'}</span>${p.firstAuthor ? '<span class="bib-auth-badge">FIRST AUTHOR</span>':''}${p.status==='Accepted / in press' || p.status==='Published online'?'<span class="bib-status-accepted">IN PRESS</span>':''}</div>
        <h4>${escapeHTML(p.title)}</h4>
        <p class="bib-authorline">${escapeHTML(p.authors)}</p>
        <p class="bib-venue">${escapeHTML(p.venue)}</p>
        <details class="bib-details"><summary>Full reference &amp; source notes <span aria-hidden="true">⌄</span></summary>
          <div class="bib-citation">${escapeHTML(p.citation)}</div>
          <div class="bib-source-meta">${escapeHTML(p.subtype || p.status)} · Source: ${escapeHTML(p.verification || 'CV / conference inventory')}${incomplete ? ' · Historical record; original conference evidence not independently verified' : ''}</div>
        </details>
      </div>
      <a class="bib-entry-link" href="${escapeHTML(queryURL)}" target="_blank" rel="noopener noreferrer" aria-label="${p.direct?'Open DOI for':'Find record for'} ${escapeHTML(p.title)} in new tab">${p.direct?'DOI ↗':'FIND ↗'}</a>
    </article>`;
  }
  function currentBibMatches() {
    const search = bibQuery.value.trim().toLocaleLowerCase();
    const year=bibYear.value;
    return allEntries.filter(p=>
      (bibType==='all' || p.kind===bibType) &&
      (year==='all' || String(p.year)===year) &&
      (!bibFirst.checked || p.firstAuthor) &&
      (!search || [p.title,p.authors,p.venue,p.citation,p.year,p.subtype,p.status].join(' ').toLocaleLowerCase().includes(search))
    );
  }
  function renderBibliography(){
    const items=currentBibMatches();
    const showing=items.slice(0,bibDisplay);
    bibList.innerHTML=showing.map(bibCard).join('') || `<div class="bib-none">No records match those filters. Try a different term or clear the filters.</div>`;
    bibStatus.textContent=items.length?`Showing ${showing.length} of ${items.length} ${items.length===1?'record':'records'}`:'No matching records';
    bibMore.hidden = showing.length >= items.length;
    bibMore.textContent=`Show More Publications ↓ (${items.length - showing.length} remaining)`;
  }
  function resetBibDisplay(){bibDisplay=18;renderBibliography();}
  function selectBibType(type){
    bibType=type;
    document.querySelectorAll('[data-bib-type]').forEach(button=>{
      const active=button.dataset.bibType===type;
      button.classList.toggle('is-selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    resetBibDisplay();
  }
  for (const year of [...new Set(allEntries.map(p=>p.year))].filter(Boolean).sort((a,b)=>b-a)) {
    const opt=document.createElement('option'); opt.value=String(year); opt.textContent=String(year);bibYear.append(opt);
  }
  document.getElementById('papers-total').textContent=biblio.papers.length;
  document.getElementById('chapters-total').textContent=biblio.chapters.length;
  document.getElementById('abstracts-total').textContent=biblio.abstracts.length;
  document.getElementById('all-tab-count').textContent=allEntries.length;
  document.querySelectorAll('[data-bib-type]').forEach(button=>button.addEventListener('click',()=>selectBibType(button.dataset.bibType)));
  bibQuery.addEventListener('input',resetBibDisplay);
  bibYear.addEventListener('change',resetBibDisplay);
  bibFirst.addEventListener('change',resetBibDisplay);
  bibMore.addEventListener('click',()=>{bibDisplay+=18;renderBibliography();});
  document.getElementById('bib-reset').addEventListener('click',()=>{bibQuery.value='';bibYear.value='all';bibFirst.checked=false;selectBibType('all');});
  function findBib(id){
    const entry=allEntries.find(p=>p.id===id);
    if (!entry)return;
    if(searchDialog.open)searchDialog.close();
    bibQuery.value=entry.title;
    bibYear.value='all';bibFirst.checked=false;selectBibType('all');
    document.getElementById('publications').scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>document.getElementById('browse-library').scrollIntoView({behavior:'smooth',block:'start'}),250);
  }
  document.addEventListener('click',event=>{const link=event.target.closest('[data-find-bib]');if(link){event.preventDefault();findBib(link.dataset.findBib);}});

  function listMarkup(list) { return `<ul>${list.map(item => `<li>${item}</li>`).join('')}</ul>`; }
  function openProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    if (searchDialog.open) searchDialog.close();
    previousFocus = document.activeElement;
    const link = project.href
      ? `<a class="button button-primary" href="${project.href}" target="_blank" rel="noopener noreferrer">Read Published Work ↗</a>`
      : '<span class="content-pill">WORK IN PROGRESS — PRELIMINARY RESULTS</span>';
    document.getElementById('modal-content').innerHTML = `
      <div class="modal-cover"><img src="${project.image}" alt="${project.short} visual" /></div>
      <div class="modal-info"><span class="modal-eyebrow">${project.eyebrow} · ${project.status.toUpperCase()}</span>
      <h2 id="modal-title">${project.title}<span class="period">.</span></h2><p class="modal-summary">${project.summary}</p>
      <div class="modal-metric"><strong>${project.metric}</strong><span>${project.metricLabel}</span></div>
      <div class="modal-cols"><div><h3>Approach</h3>${listMarkup(project.methods)}</div><div><h3>What the study found</h3>${listMarkup(project.outcomes)}</div></div>
      <div class="modal-takeaway"><h3>Why context matters</h3><p>${project.takeaway}</p></div>
      <div class="modal-footer">${link}<span class="pub-label">${project.publication}</span></div></div>`;
    modal.showModal();
    document.body.classList.add('modal-open');
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-open-project]');
    if (button) openProject(button.dataset.openProject);
  });
  document.getElementById('modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => { if (!searchDialog.open) document.body.classList.remove('modal-open'); previousFocus?.focus?.(); });

  function openSearch() {
    previousFocus = document.activeElement;
    renderSearch('');
    searchInput.value = '';
    searchDialog.showModal();
    document.body.classList.add('modal-open');
    searchInput.focus();
  }
  function renderSearch(term) {
    const q = term.trim().toLowerCase();
    const pMatches = projects.filter(p => [p.title,p.short,p.summary,p.status,...p.filters,p.publication].join(' ').toLowerCase().includes(q));
    const pubMatches = allEntries.filter(p => [p.title,p.authors,p.venue,p.citation,p.kind,p.year].join(' ').toLowerCase().includes(q));
    const maxResults = q ? 14 : 8;
    const matches = [
      ...pMatches.map(p => ({type:'RESEARCH CASE STUDY',id:p.id,title:p.title,kind:'project'})),
      ...pubMatches.map(p => ({type:`${typeLabel(p.kind)} · ${p.year}`,id:p.id,title:p.title,kind:'bibliography'}))
    ].slice(0,maxResults);
    if (!matches.length) { searchResults.innerHTML = '<p class="search-empty">No matching records. Try “anemia”, “goat”, “AI”, “poultry” or “bioelectrical”.</p>';return; }
    searchResults.innerHTML = matches.map(entry => entry.kind === 'project'
      ? `<button type="button" class="search-result" data-open-project="${escapeHTML(entry.id)}"><span><small>${entry.type}</small><strong>${escapeHTML(entry.title)}</strong></span><span aria-hidden="true">↗</span></button>`
      : `<button type="button" class="search-result" data-find-bib="${escapeHTML(entry.id)}"><span><small>${entry.type}</small><strong>${escapeHTML(entry.title)}</strong></span><span aria-hidden="true">↗</span></button>`).join('');
  }
  document.getElementById('search-trigger').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', () => searchDialog.close());
  searchInput.addEventListener('input', () => renderSearch(searchInput.value));
  searchDialog.addEventListener('click', event => { if (event.target === searchDialog) searchDialog.close(); });
  searchDialog.addEventListener('close', () => { if (!modal.open) { document.body.classList.remove('modal-open'); previousFocus?.focus?.(); } });
  document.addEventListener('keydown', event => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const editable = ['input','textarea','select'].includes(tag) || document.activeElement?.isContentEditable;
    if ((event.key === '/' && !editable) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      if (!modal.open && !searchDialog.open) openSearch();
    }
  });

  const header = document.getElementById('site-header');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', updateHeader, {passive:true});updateHeader();
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded',String(open));
  });
  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded','false');
  }));
  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    },{rootMargin:'-20% 0px -60% 0px',threshold:0});
    sections.forEach(section => observer.observe(section));
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProjects();
  renderPublications();
  renderBibliography();
})();
