(function(){
  'use strict';

  var STORAGE_KEY = 'aftabFacultySearchOS.jobs.v1';

  var WEIGHTS = [
    ['Research expertise match',20],
    ['Publications / scholarly trajectory',12],
    ['AI / ML / data-science match',10],
    ['Animal / Food / One Health domain',10],
    ['Grant / funding competitiveness',10],
    ['Teaching requirements',8],
    ['Extension requirement',6],
    ['Student mentoring',5],
    ['Land-grant mission alignment',5],
    ['Required degree',5],
    ['Rank / readiness',4],
    ['Geographic / career preference',2],
    ['Sponsorship compatibility',3]
  ];

  var state = {
    jobs: loadJobs(),
    lastAnalysis: null
  };

  function q(sel){ return document.querySelector(sel); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];
    });
  }
  function text(v){ return String(v || '').trim(); }
  function lower(v){ return text(v).toLowerCase(); }
  function includesAny(haystack, terms){ return terms.some(function(t){ return haystack.indexOf(t) !== -1; }); }
  function countAny(haystack, terms){ return terms.reduce(function(n,t){ return n + (haystack.indexOf(t)!==-1 ? 1 : 0); },0); }
  function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
  function todayISO(){ return new Date().toISOString().slice(0,10); }

  function loadJobs(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  function saveJobs(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
    renderAll();
  }

  function toast(msg){
    var old = q('.toast');
    if(old) old.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function(){ if(el.parentNode) el.remove(); },2200);
  }

  function switchView(name){
    qa('.view').forEach(function(v){ v.classList.remove('active'); });
    qa('.nav-item').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-view') === name); });
    var view = q('#view-' + name);
    if(view) view.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  qa('.nav-item').forEach(function(btn){
    btn.addEventListener('click',function(){ switchView(btn.getAttribute('data-view')); });
  });
  qa('[data-jump]').forEach(function(btn){
    btn.addEventListener('click',function(){ switchView(btn.getAttribute('data-jump')); });
  });

  function scoreJob(data){
    var jd = lower(data.description + ' ' + data.title);
    var breakdown = [];
    var gaps = [];
    var total = 0;

    function add(label, score, max, note){
      score = clamp(Math.round(score),0,max);
      breakdown.push({label:label,score:score,max:max,note:note || ''});
      total += score;
    }

    var researchTerms = [
      'precision livestock','animal science','livestock','poultry','animal health','precision agriculture',
      'digital agriculture','agricultural data','biosensor','biosensing','sensor','rfid','bioelectrical impedance',
      'computer vision','food science','food safety','food quality','one health','predictive analytics'
    ];
    var rHits = countAny(jd,researchTerms);
    var researchScore = rHits >= 6 ? 20 : rHits >= 4 ? 18 : rHits >= 2 ? 15 : rHits === 1 ? 10 : 5;
    add('Research expertise match', researchScore,20, rHits + ' aligned domain signals found');
    if(researchScore < 15) gaps.push('The posting does not strongly overlap with your core precision livestock, food systems, sensing, or One Health research identity.');

    var researchRole = includesAny(jd,['research program','peer-reviewed','publication','scholarly','research productivity','research agenda','externally funded','grant']);
    add('Publications / scholarly trajectory', researchRole ? 12 : 9,12,'Your publication record supports research-active faculty expectations.');

    var aiTerms = ['artificial intelligence','machine learning','deep learning','computer vision','data science','predictive model','predictive analytics','informatics','big data','python','r programming','geospatial','gis','remote sensing'];
    var aiHits = countAny(jd,aiTerms);
    add('AI / ML / data-science match', aiHits >= 4 ? 10 : aiHits >= 2 ? 9 : aiHits === 1 ? 7 : 4,10, aiHits + ' computational signals found');
    if(aiHits === 0) gaps.push('AI/data-science expertise is not central in the posting, so one of your strongest differentiators may be underused.');

    var bioTerms = ['animal','livestock','poultry','goat','sheep','cattle','food','one health','veterinary','meat','dairy','agricultural'];
    var bioHits = countAny(jd,bioTerms);
    add('Animal / Food / One Health domain', bioHits >= 5 ? 10 : bioHits >= 3 ? 9 : bioHits >= 1 ? 7 : 3,10,bioHits + ' biological/agricultural domain signals found');

    var fundingTerms = ['extramural','external funding','externally funded','competitive funding','grant','usda','nifa','nsf','nih','funded research'];
    var fundingExpected = includesAny(jd,fundingTerms);
    add('Grant / funding competitiveness', fundingExpected ? 10 : 8,10,fundingExpected ? 'Posting expects external funding; your proposal experience is relevant.' : 'Funding expectation is not strongly stated.');

    var teachingTerms = ['teach','teaching','course','curriculum','instruction','undergraduate','graduate education'];
    var teachingHits = countAny(jd,teachingTerms);
    add('Teaching requirements', teachingHits >= 3 ? 8 : teachingHits >= 1 ? 7 : 6,8,'Existing university teaching supports this category.');

    var extensionHeavy = includesAny(jd,['70% extension','60% extension','50% extension','extension-heavy','major extension']);
    var extensionModerate = includesAny(jd,['40% extension','30% extension','extension specialist','cooperative extension','extension appointment']);
    var extensionLight = includesAny(jd,['20% extension','10% extension','outreach','extension']);
    var extensionScore = extensionHeavy ? 2 : extensionModerate ? 4 : extensionLight ? 5 : 6;
    add('Extension requirement',extensionScore,6,extensionHeavy ? 'Heavy Extension commitment detected.' : extensionModerate ? 'Moderate Extension responsibility detected.' : 'Low or no major Extension burden detected.');
    if(extensionHeavy) gaps.push('The position appears Extension-heavy; this is a meaningful competitiveness gap unless your Extension record is documented more fully.');

    var mentoringTerms = ['mentor','mentoring','graduate student','graduate students','advise','advising','student training'];
    add('Student mentoring', includesAny(jd,mentoringTerms) ? 5 : 4,5,'Your graduate and undergraduate mentoring experience is relevant.');

    var landGrantScore = data.institutionType === 'public1862' ? 5 : data.institutionType === 'public1890' ? 5 : data.institutionType === 'public' ? 4 : data.institutionType === 'private' ? 3 : 3;
    add('Land-grant mission alignment',landGrantScore,5,data.institutionType.replace('public1862','Public 1862 land-grant').replace('public1890','Public 1890 land-grant').replace('public','Public university').replace('private','Private university').replace('other','Unknown institution type'));

    var degreeFull = includesAny(jd,['food science','animal science','poultry science','agricultural science','agriculture','related field','closely related field']);
    var degreeHardMismatch = includesAny(jd,['dvm required','doctor of veterinary medicine required','md required','phd in computer science required','phd in electrical engineering required','phd in plant pathology required']);
    add('Required degree', degreeHardMismatch ? 1 : degreeFull ? 5 : 4,5,degreeHardMismatch ? 'Potential hard degree mismatch detected.' : 'Ph.D. Food Science plus M.S. Animal Science provides broad related-field coverage.');
    if(degreeHardMismatch) gaps.push('A potentially hard degree requirement was detected. Verify the exact required degree before spending time on the application.');

    var assistant = includesAny(jd,['assistant professor','tenure-track','tenure track','tenure-accruing','tenure accruing']);
    add('Rank / readiness',assistant ? 4 : 2,4,assistant ? 'Assistant-professor / tenure language detected.' : 'Tenure-track Assistant Professor language not clearly detected.');
    if(!assistant) gaps.push('Confirm that this is actually a tenure-track or tenure-system Assistant Professor appointment.');

    add('Geographic / career preference',2,2,'U.S. faculty roles are within the current search scope.');

    var sponsorshipScore = data.sponsorship === 'yes' ? 3 : data.sponsorship === 'no' ? 0 : 2;
    add('Sponsorship compatibility',sponsorshipScore,3,data.sponsorship === 'yes' ? 'Sponsorship appears compatible.' : data.sponsorship === 'no' ? 'Posting states no employer sponsorship.' : 'Sponsorship is not confirmed.');
    if(data.sponsorship === 'no') gaps.push('Critical: the posting states that employer sponsorship is unavailable. Verify work-authorization compatibility before applying.');

    var mismatchTerms = [
      'licensed veterinarian required','board certification required','medical entomology','veterinary entomology',
      'human clinical','clinical physician','plant pathology is required','molecular genetics is required'
    ];
    var mismatches = mismatchTerms.filter(function(t){ return jd.indexOf(t)!==-1; });
    if(mismatches.length){
      var penalty = Math.min(15,mismatches.length*7);
      total -= penalty;
      gaps.push('Core-specialization warning: ' + mismatches.join(', ') + '.');
    }

    total = clamp(Math.round(total),0,100);
    var label = total >= 95 ? 'Exceptional match — priority application' :
                total >= 90 ? 'Strong match — apply' :
                total >= 85 ? 'Strategic / stretch application' :
                total >= 75 ? 'Selective application only' : 'Low priority — likely skip';

    return {score:total,label:label,breakdown:breakdown,gaps:gaps};
  }

  function currentFormData(){
    return {
      university:text(q('#job-university').value),
      title:text(q('#job-title').value),
      institutionType:q('#job-institution-type').value,
      sponsorship:q('#job-sponsorship').value,
      deadline:q('#job-deadline').value,
      url:text(q('#job-url').value),
      description:text(q('#job-description').value)
    };
  }

  q('#job-form').addEventListener('submit',function(e){
    e.preventDefault();
    var data = currentFormData();
    if(!data.title || !data.description){
      toast('Add the position title and job description first.');
      return;
    }
    var result = scoreJob(data);
    state.lastAnalysis = {data:data,result:result};
    renderAnalysis();
  });

  q('#job-form').addEventListener('reset',function(){
    setTimeout(function(){
      state.lastAnalysis = null;
      renderAnalysis();
    },0);
  });

  function renderAnalysis(){
    var a = state.lastAnalysis;
    if(!a){
      q('#fit-score').textContent = '—';
      q('#fit-label').textContent = 'Paste a job to begin.';
      q('#fit-summary').textContent = 'This is a screening score, not a hiring probability.';
      q('#score-breakdown').innerHTML = '';
      q('#gap-list').innerHTML = '';
      q('#save-job').disabled = true;
      q('#copy-application-prompt').disabled = true;
      return;
    }
    q('#fit-score').textContent = a.result.score;
    q('#fit-label').textContent = a.result.label;
    q('#fit-summary').textContent = a.data.university + (a.data.university && a.data.title ? ' · ' : '') + a.data.title;
    q('#score-breakdown').innerHTML = a.result.breakdown.map(function(x){
      return '<div class="break-row"><span>' + esc(x.label) + '</span><b>' + x.score + '/' + x.max + '</b></div>';
    }).join('');
    q('#gap-list').innerHTML = a.result.gaps.length ? a.result.gaps.map(function(g){
      var cls = lower(g).indexOf('critical') === 0 ? 'gap critical' : 'gap';
      return '<div class="' + cls + '">' + esc(g) + '</div>';
    }).join('') : '<div class="gap">No major profile mismatch detected by the screening rules. Verify the official required qualifications manually.</div>';
    q('#save-job').disabled = false;
    q('#copy-application-prompt').disabled = false;
  }

  q('#save-job').addEventListener('click',function(){
    if(!state.lastAnalysis) return;
    var a = state.lastAnalysis;
    var id = 'job_' + Date.now();
    state.jobs.unshift({
      id:id,
      university:a.data.university || 'Unknown institution',
      title:a.data.title,
      institutionType:a.data.institutionType,
      sponsorship:a.data.sponsorship,
      deadline:a.data.deadline,
      url:a.data.url,
      description:a.data.description,
      score:a.result.score,
      label:a.result.label,
      gaps:a.result.gaps,
      stage:'Considering',
      created:todayISO()
    });
    saveJobs();
    toast('Saved to your application pipeline.');
  });

  function applicationPrompt(a){
    var d = a.data, r = a.result;
    return [
      'Act as my academic faculty-application strategist.',
      '',
      'CANDIDATE: Aftab Siddique, Ph.D.',
      'Core identity: precision livestock + AI/ML + biosensing + animal health + food safety + One Health + agricultural data science.',
      'Education: Ph.D. Food Science (Poultry Science focus), M.S. Animal Science, B.Tech. Biotechnology, additional public-health training.',
      'Strengths to use only when supported: peer-reviewed research; machine learning; computer vision; RFID/RF; bioelectrical impedance; GIS; livestock anemia/parasite/health monitoring; poultry and food-safety analytics; USDA-NIFA proposal experience; university teaching; graduate/undergraduate mentoring; multidisciplinary collaboration.',
      '',
      'TARGET POSITION',
      'University: ' + (d.university || 'Not provided'),
      'Title: ' + d.title,
      'Official URL: ' + (d.url || 'Not provided'),
      'Deadline/review: ' + (d.deadline || 'Not provided'),
      'Screening fit: ' + r.score + '/100 — ' + r.label,
      '',
      'JOB DESCRIPTION',
      d.description,
      '',
      'KNOWN GAPS / FLAGS',
      r.gaps.length ? r.gaps.map(function(g){ return '- ' + g; }).join('\n') : '- None detected by the screening tool.',
      '',
      'TASK',
      '1. Verify the required vs preferred qualifications from the pasted description.',
      '2. Give me a qualification matrix: requirement, evidence from my profile, strength, and gap.',
      '3. Tell me whether the current fit score is too high, too low, or reasonable and explain why.',
      '4. Develop a positioning strategy that presents me as an independent emerging faculty researcher, not merely an AI support specialist.',
      '5. Draft a tailored cover letter without inventing any experience, grant award, publication, teaching role, or leadership claim.',
      '6. Recommend exact changes to my CV, research statement, teaching statement, and any Extension statement.',
      '7. Identify 5 likely search-committee concerns and how to address each truthfully.',
      '8. Build a 5-year research/funding narrative appropriate to this institution.',
      '',
      'HONESTY RULE: If evidence is not provided, label it as a gap or ask for the supporting fact. Do not fabricate.'
    ].join('\n');
  }

  q('#copy-application-prompt').addEventListener('click',function(){
    if(!state.lastAnalysis) return;
    navigator.clipboard.writeText(applicationPrompt(state.lastAnalysis)).then(function(){ toast('Application prompt copied.'); });
  });

  q('#load-sample').addEventListener('click',function(){
    q('#job-university').value = 'Example Land-Grant University';
    q('#job-title').value = 'Assistant Professor — AI for Precision Animal Agriculture';
    q('#job-institution-type').value = 'public1862';
    q('#job-sponsorship').value = 'unknown';
    q('#job-description').value = 'Tenure-track Assistant Professor in precision animal agriculture. The successful candidate will establish an externally funded research program using artificial intelligence, machine learning, computer vision, biosensors, precision livestock technologies, and data science to improve animal health, welfare, productivity, and food-system resilience. The position will teach undergraduate and graduate courses, mentor graduate students, publish peer-reviewed research, and collaborate across Animal Science, Food Science, Engineering, and Extension. Ph.D. in animal science, food science, agricultural engineering, computer science, or a closely related field required. Experience with USDA-NIFA grants, sensor systems, GIS, and One Health is preferred.';
    toast('Example loaded. Replace it with an official posting.');
  });

  function institutionLabel(v){
    return {public1862:'Public 1862 land-grant',public1890:'Public 1890 land-grant',public:'Public university',private:'Private university',other:'Other / unknown'}[v] || v;
  }

  function scoreClass(score){ return score >= 90 ? 'high' : 'medium'; }

  function jobCard(job){
    var url = job.url ? '<a class="secondary" href="' + esc(job.url) + '" target="_blank" rel="noopener noreferrer">Official posting ↗</a>' : '';
    var deadline = job.deadline ? ' · Review/deadline ' + esc(job.deadline) : '';
    return '<article class="job-card" data-id="' + esc(job.id) + '">' +
      '<div class="score-badge ' + scoreClass(job.score) + '">' + job.score + '</div>' +
      '<div><h3>' + esc(job.title) + '</h3><div class="meta">' + esc(job.university) + ' · ' + esc(institutionLabel(job.institutionType)) + deadline + '</div>' +
      '<div class="tag-row"><span class="tag">' + esc(job.label) + '</span><span class="tag">' + esc(job.stage) + '</span>' + (job.sponsorship==='no' ? '<span class="tag">No sponsorship</span>' : '') + '</div></div>' +
      '<div class="job-card-actions"><select class="stage-select" aria-label="Application stage">' +
      ['Considering','Preparing','Applied','Interview','Campus interview','Offer','Closed'].map(function(s){ return '<option' + (s===job.stage?' selected':'') + '>' + s + '</option>'; }).join('') +
      '</select>' + url + '<button class="secondary copy-saved-prompt">Copy application prompt</button><button class="delete-btn">Remove</button></div></article>';
  }

  function attachJobHandlers(container){
    container.querySelectorAll('.job-card').forEach(function(card){
      var id = card.getAttribute('data-id');
      var job = state.jobs.find(function(j){ return j.id === id; });
      if(!job) return;
      var stage = card.querySelector('.stage-select');
      if(stage) stage.addEventListener('change',function(){ job.stage = stage.value; saveJobs(); });
      var del = card.querySelector('.delete-btn');
      if(del) del.addEventListener('click',function(){
        if(confirm('Remove this position from your local pipeline?')){
          state.jobs = state.jobs.filter(function(j){ return j.id !== id; });
          saveJobs();
        }
      });
      var copy = card.querySelector('.copy-saved-prompt');
      if(copy) copy.addEventListener('click',function(){
        var a = {data:job,result:{score:job.score,label:job.label,gaps:job.gaps||[]}};
        navigator.clipboard.writeText(applicationPrompt(a)).then(function(){ toast('Application prompt copied.'); });
      });
    });
  }

  function renderDashboard(){
    q('#metric-total').textContent = state.jobs.length;
    q('#metric-priority').textContent = state.jobs.filter(function(j){ return j.score >= 95 && j.stage !== 'Closed'; }).length;
    q('#metric-interviews').textContent = state.jobs.filter(function(j){ return ['Interview','Campus interview'].indexOf(j.stage)!==-1; }).length;
    var box = q('#dashboard-jobs');
    if(!state.jobs.length){
      box.className = 'job-list empty-state';
      box.textContent = 'No positions saved yet. Analyze a job to start your pipeline.';
      return;
    }
    box.className = 'job-list';
    box.innerHTML = state.jobs.slice(0,3).map(jobCard).join('');
    attachJobHandlers(box);
  }

  function renderPipeline(){
    var stage = q('#filter-stage').value;
    var min = Number(q('#filter-score').value || 0);
    var query = lower(q('#filter-query').value);
    var jobs = state.jobs.filter(function(j){
      var stageOk = stage === 'all' || j.stage === stage;
      var scoreOk = j.score >= min;
      var queryOk = !query || lower(j.university + ' ' + j.title).indexOf(query)!==-1;
      return stageOk && scoreOk && queryOk;
    });
    var box = q('#pipeline-list');
    if(!jobs.length){
      box.className = 'job-list empty-state';
      box.textContent = state.jobs.length ? 'No saved positions match these filters.' : 'Your application pipeline is empty.';
      return;
    }
    box.className = 'job-list';
    box.innerHTML = jobs.map(jobCard).join('');
    attachJobHandlers(box);
  }

  ['#filter-stage','#filter-score','#filter-query'].forEach(function(sel){
    q(sel).addEventListener('input',renderPipeline);
  });

  function download(name, content, type){
    var blob = new Blob([content],{type:type});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); },500);
  }

  q('#export-json').addEventListener('click',function(){
    download('aftab-facultysearch-pipeline.json',JSON.stringify(state.jobs,null,2),'application/json');
  });

  q('#export-csv').addEventListener('click',function(){
    var rows = [['University','Title','Score','Stage','Deadline','Institution Type','Sponsorship','URL','Created']];
    state.jobs.forEach(function(j){ rows.push([j.university,j.title,j.score,j.stage,j.deadline,institutionLabel(j.institutionType),j.sponsorship,j.url,j.created]); });
    var csv = rows.map(function(row){ return row.map(function(v){ return '"' + String(v == null ? '' : v).replace(/"/g,'""') + '"'; }).join(','); }).join('\n');
    download('aftab-facultysearch-pipeline.csv',csv,'text/csv');
  });

  q('#import-json').addEventListener('change',function(e){
    var file = e.target.files && e.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(){
      try{
        var data = JSON.parse(reader.result);
        if(!Array.isArray(data)) throw new Error('Expected an array');
        state.jobs = data;
        saveJobs();
        toast('Pipeline imported.');
      }catch(err){ alert('Could not import this JSON file.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  function interviewPrompt(){
    var university = text(q('#interview-university').value) || '[University]';
    var role = text(q('#interview-role').value) || '[Position]';
    var stage = q('#interview-stage').value;
    var notes = text(q('#interview-notes').value);
    return [
      'Act as an academic search committee and interview coach for Aftab Siddique, Ph.D.',
      '',
      'TARGET',
      'University: ' + university,
      'Position: ' + role,
      'Stage: ' + stage,
      '',
      'CANDIDATE POSITIONING',
      'Precision livestock + AI/ML + biosensing + animal health + food safety + One Health + agricultural data science.',
      'Ph.D. Food Science (Poultry Science focus); M.S. Animal Science; B.Tech. Biotechnology.',
      'Research strengths include machine learning, computer vision, RFID/RF, bioelectrical impedance, GIS, livestock health monitoring, food-safety analytics, student mentoring, teaching, and USDA-NIFA proposal development.',
      '',
      'POSITION NOTES',
      notes || 'No additional notes supplied.',
      '',
      'PREP TASK',
      '1. Simulate five reviewers: department chair, research-intensive faculty member, teaching faculty member, dean/administrator, and a skeptical committee member.',
      '2. Give the 12 most likely questions for this interview stage.',
      '3. For each question, outline a strong answer using only the supplied candidate evidence; mark any fact I should confirm before using.',
      '4. Build a 90-second introduction and a 3-minute independent research-program answer.',
      '5. Develop a five-year funding strategy appropriate for a U.S. land-grant faculty member.',
      '6. Identify the five biggest vulnerabilities in my candidacy and truthful ways to address them.',
      '7. Give me eight high-value questions to ask the committee.',
      stage.indexOf('Campus')!==-1 || stage.indexOf('seminar')!==-1 ? '8. Build a campus-visit strategy including job talk narrative, faculty one-on-ones, student interactions, and dean meeting.' : '8. Give me a concise close for the interview.',
      '',
      'Do not invent publications, grants, awards, courses, or leadership roles. Distinguish confirmed evidence from recommended framing.'
    ].join('\n');
  }

  q('#generate-interview-prompt').addEventListener('click',function(){
    q('#interview-output').value = interviewPrompt();
  });
  q('#copy-interview-prompt').addEventListener('click',function(){
    var out = q('#interview-output').value;
    if(!out){ toast('Generate the prompt first.'); return; }
    navigator.clipboard.writeText(out).then(function(){ toast('Interview prompt copied.'); });
  });

  function renderWeights(){
    q('#weight-grid').innerHTML = WEIGHTS.map(function(w){
      return '<div class="weight-item"><span>' + esc(w[0]) + '</span><b>' + w[1] + '</b></div>';
    }).join('');
  }

  function renderAll(){
    renderDashboard();
    renderPipeline();
    renderWeights();
  }

  renderAnalysis();
  renderAll();
})();