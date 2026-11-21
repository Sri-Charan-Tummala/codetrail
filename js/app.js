/* CodeTrail — app: state, screens, lessons engine, Q&A, Python runner, IDE, tracking */
const fresh=()=>({pipe:{},done:{},xp:0,streak:0,last:'',track:'py',miss:{},cards:{},skills:{},stories:{},plan:{},apps:[],mocks:[],att:{},rev:{},crev:{},solo:{},dhelp:{},day:null,sess:null,p90:null,dmiss:{}});
let S=fresh();
const fix=()=>{for(const k of ['done','miss','cards','skills','stories','plan'])if(!S[k]||typeof S[k]!=='object')S[k]={};if(!Array.isArray(S.apps))S.apps=[];if(!Array.isArray(S.mocks))S.mocks=[];if(!TRACKS[S.track])S.track='py'};
try{Object.assign(S,JSON.parse(localStorage.getItem('codetrail')||'{}'))}catch(e){}
fix();
const save=()=>{try{localStorage.setItem('codetrail',JSON.stringify(S))}catch(e){}};
(function(){try{if(!S.seed){S.stories=S.stories||{};for(const id in STORY_SEED){const v=S.stories[id]=S.stories[id]||{};for(const k of ['s','t','a','r'])if(!v[k])v[k]=STORY_SEED[id][k]}S.seed='acc2026';save()}}catch(e){}})();
(function(){try{if(S.seed!=='acc2026b'){S.stories=S.stories||{};for(const id in STORY_SEED2){const v=S.stories[id]=S.stories[id]||{},old=STORY_SEED[id]||{};for(const k of ['s','t','a','r'])if(!v[k]||v[k]===old[k])v[k]=STORY_SEED2[id][k]}S.seed='acc2026b';save()}}catch(e){}})();
STORIES.push(
{id:'stacking',q:`A time you proved whether a failure was the product or the setup`,tip:`Show method: reproduce, isolate one variable, get independent evidence, hand it to the right owner.`},
{id:'risk',q:`A time you raised a risk early, or told someone what they didn't want to hear`,tip:`Evidence over opinion: what you saw, how you showed it, the decision it changed.`},
{id:'customer',q:`A customer-facing issue you helped resolve`,tip:`Reproduction, clear evidence for the fix, and what you added so it can't come back.`},
{id:'ai',q:`How you use AI tools in your engineering work`,tip:`Interviewers want judgement: where it helps, how you check it, a time it was wrong. Name the tool generically — "an internal AI coding assistant".`},
{id:'change',q:`A time you moved to a new team or had to learn something fast`,tip:`What you carried over, what you learned, and the first result in the new role.`}
);

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const day=(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return d.toLocaleDateString('en-CA')};
const liveStreak=()=>(S.last===day()||S.last===day(-1))?S.streak:0;
const lessonsDone=()=>ALL.filter(l=>S.done[l.id]).length;
const bump=()=>{if(S.last!==day()){S.streak=S.last===day(-1)?S.streak+1:1;S.last=day()}};
const GOALS=[['lesson',1,'lesson'],['quick',1,'Quick 10'],['cards',5,'Q&amp;A cards'],['code',1,'code drill']];
const today=()=>{if(!S.day||S.day.d!==day())S.day={d:day(),lesson:0,quick:0,cards:0,code:0,min:0,sessions:0};return S.day};
const mark=(k,n=1)=>{const t=today();t[k]=(t[k]||0)+n;save()};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 5 5 9-10"/></svg>';
const LOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

function head(){$('streak').textContent=liveStreak();$('xp').textContent=S.xp}
function renderLearn(){
  const t=TRACKS[S.track],ls=t.lessons,next=ls.findIndex(l=>!S.done[l.id]),n=ls.filter(l=>S.done[l.id]).length,weak=Object.keys(S.miss).length;
  document.querySelectorAll('[data-track]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.track===S.track));
  {const a=document.querySelector(`.trackbar [data-track="${S.track}"]`),bar=a&&a.parentElement;if(a&&bar){const x=a.offsetLeft-bar.clientWidth/2+a.offsetWidth/2;bar.scrollLeft=Math.max(0,x);bar.classList.toggle('end',bar.scrollLeft+bar.clientWidth>=bar.scrollWidth-4)}}
  const td=today(),goals=`<div class="goals" aria-label="Today's goals">${GOALS.map(([k,n,lab])=>`<div class="goal${td[k]>=n?' met':''}"><b>${td[k]>=n?'✓':Math.min(td[k],n)+'/'+n}</b>${lab}</div>`).join('')}</div>`;
  const mins=`<div class="today"><div class="ring" id="minRing" style="--p:0"><b id="minNum">0</b><small>min</small></div><div class="ttxt"><b id="minTxt"></b><span>Day ${Math.max(1,Math.min(p90Day(),90))} of 90 · ends ${esc(new Date(addDays(p90Start(),89)+'T12:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}))}</span><span class="note">Counts only while you're learning</span></div></div><div class="week" id="weekStrip" role="button" aria-label="This week — open the calendar">${weekHTML()}</div><button class="btn" data-sess>${S.sess&&S.sess.d===day()?'Resume 30-min session':'Start 30-min session'}</button>`;
  const nd=PIPE.filter(p=>p.dl&&daysTo(p.dl)>=0&&!['Applied','Interviewing','Skipped for now'].includes(pst(p))).sort((a,b)=>a.dl<b.dl?-1:1)[0];
  const quick=`${nd?`<button class="btn ghost sm" data-gopipe style="width:100%;text-align:left">Next deadline: <b>${esc(nd.co)}</b> — ${daysTo(nd.dl)===0?'today':daysTo(nd.dl)===1?'tomorrow':daysTo(nd.dl)+' days'}</button>`:''}${goals}<button class="btn ghost" data-quick="mix">Quick 10 · mixed drill${weak?` · ${weak} weak spot${weak>1?'s':''}`:''}</button>`;
  $('hero').innerHTML=next<0
   ?`${mins}<small>${t.name} track complete</small><h2>All ${ls.length} lessons done.</h2><div class="meter"><i style="width:100%"></i></div>${quick}`
   :`${mins}<div class="upnext"><small>Up next · ${t.name} · ${n} of ${ls.length} lessons</small><h2>${esc(ls[next].title)}</h2><div class="meter"><i style="width:${n/ls.length*100}%"></i></div><button class="btn ghost" data-open="${ls[next].id}">${n?'Continue lesson':'Start lesson'} →</button></div>${quick}`;
  let u='',h='';
  ls.forEach((l,k)=>{
    if(l.u!==u){if(u)h+='</div>';u=l.u;h+=`<h3 class="unit">${esc(u)}</h3><div class="path">`}
    const st=S.done[l.id]?'done':k===next?'next':'lock';
    h+=`<div class="stop ${st}" style="--x:${Math.round(Math.sin(k*1.3)*70)}px"><button class="node" data-open="${l.id}" aria-label="${esc(l.title)}">${st==='done'?CHECK:st==='lock'?LOCK:k+1}</button><span>${esc(l.title)}</span></div>`});
  $('path').innerHTML=h+'</div>';head();updMin();
  const f=FEED[FEED.length-1];
  $('news').innerHTML=`<summary style="cursor:pointer;font-weight:700;min-height:28px">What's new · ${new Date(f.d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</summary><ul style="margin:10px 0 0;padding-left:18px">${f.items.map(x=>`<li style="margin-bottom:6px">${esc(x)}</li>`).join('')}</ul>${FEED.length>1?`<p class="note" style="margin:8px 0 0">${FEED.length} updates so far.</p>`:''}`;
}

let L=null;
function run(l){L={l,q:l.steps.map((_,i)=>i),done:0,miss:0,wrong:new Set()};$('lesson').hidden=false;document.body.style.overflow='hidden';step()}
function openLesson(id){const l=ALL.find(x=>x.id===id);if(l)run(l)}
function quick(mode){
  const pool=ALL.flatMap(l=>l.steps.filter(s=>s.t!=='learn'));
  const weak=shuffle(pool.filter(s=>S.miss[s.k]));
  const rest=mode==='weak'?[]:shuffle(pool.filter(s=>!S.miss[s.k]));
  const steps=weak.concat(rest).slice(0,10);
  if(!steps.length)return;
  run({id:'quick',title:mode==='weak'?'Weak spots':'Quick 10',steps});
}
function closeLesson(){$('lesson').hidden=true;document.body.style.overflow='';L=null;renderLearn();if(!$('v-me').hidden)renderMe()}
function codeHTML(s){
  if(!s.code)return'';
  if(s.t!=='fill')return`<pre><code>${esc(s.code)}</code></pre>`;
  const parts=s.code.split('___');
  return`<pre><code>${parts.map((p,i)=>esc(p)+(i<parts.length-1?`<button class="blank" data-b="${i}">${L.fill[i]!=null?esc(s.toks[L.fill[i]]):'&nbsp;'}</button>`:'')).join('')}</code></pre>`;
}
function step(){
  const s=L.l.steps[L.q[0]];
  $('lfoot').className='lfoot';$('fb').innerHTML='';$('lbar').style.width=L.done/L.l.steps.length*100+'%';
  L.sel=null;L.state=s.t==='learn'?'learn':'ask';
  if(s.t==='fill')L.fill=s.ans.map(()=>null);
  if(s.t==='task'){L.txt='';L.ticks=null}
  draw();$('act').textContent=s.t==='learn'?'Continue':'Check';$('stage').scrollTop=0;
}
function draw(){
  const s=L.l.steps[L.q[0]],locked=L.state==='fb';let h='';
  const src=L.l.id==='quick'?ALL.find(l=>s.k.startsWith(l.id+':')).title:L.l.title;
  if(s.t==='learn'){
    h=`<span class="tag">${esc(src)}</span><h2>${esc(s.h)}</h2><p>${s.body}</p>${codeHTML(s)}`;
    if(s.code&&TRACKS.py.lessons.includes(L.l))h+=`<button class="btn ghost sm" id="tryIt">Run this in Code</button>`;
  }else if(s.t==='mcq'){
    h=`<span class="tag">${esc(src)} · quiz</span><h2>${esc(s.q)}</h2>${codeHTML(s)}<div class="opts">${s.opts.map((o,i)=>{
      const c=locked?(i===s.a?' right':i===L.sel?' wrong':''):'';
      return`<button class="opt${c}" data-o="${i}" aria-pressed="${L.sel===i}" ${locked?'disabled':''}>${esc(o)}</button>`}).join('')}</div>`;
  }else if(s.t==='task'){
    h=`<span class="tag">${esc(src)} · your turn — ${s.kind==='cmd'?'write it':'explain it'}</span><h2>${esc(s.q)}</h2><p class="note">${s.kind==='cmd'?'No options this time — type the command yourself.':'No options this time — answer in your own words, then compare with the key points.'}</p><textarea id="taskIn" spellcheck="false" autocapitalize="off" style="min-height:${s.kind==='cmd'?90:150}px;font-family:${s.kind==='cmd'?'JetBrains Mono,monospace':'Inter,sans-serif'}" aria-label="Your answer" ${L.state!=='ask'?'readonly':''}>${esc(L.txt||'')}</textarea>`;
    if(L.state==='rubric'||(L.state==='fb'&&s.kind==='explain'))h+=`<div class="panel" style="margin-top:12px"><h3>Model answer</h3><p style="margin:0 0 10px">${esc(s.model)}</p><h3>Did your answer cover…</h3>${s.rubric.map((r,i)=>`<button class="skill ${L.ticks&&L.ticks[i]?'s2':''}" data-rb="${i}" ${L.state!=='rubric'?'disabled':''}><i></i><span>${esc(r)}</span></button>`).join('')}<p class="note" style="margin:8px 0 0">Tick only what you actually wrote. Be strict — this counts as demonstrated skill.</p></div>`;
  }else{
    const used=L.fill.filter(x=>x!=null);
    h=`<span class="tag">${esc(src)} · fill the blank</span><h2>${esc(s.q)}</h2>${codeHTML(s)}<div class="toks">${s.toks.map((t,i)=>`<button class="tok" data-t="${i}" ${used.includes(i)||locked?'disabled':''}>${esc(t)}</button>`).join('')}</div>`;
  }
  $('stage').innerHTML=h;
  $('act').disabled=s.t!=='learn'&&L.state==='ask'&&(s.t==='mcq'?L.sel==null:s.t==='task'?!(L.txt||'').trim():L.fill.includes(null));
}
function record(s,ok){
  if(ok){if(!L.wrong.has(s.k))delete S.miss[s.k]}else{L.wrong.add(s.k);S.miss[s.k]=1}
  S.att=S.att||{};S.rev=S.rev||{};
  if(!S.att[s.k])S.att[s.k]={ok,d:day()};
  else if(ok&&!L.wrong.has(s.k)&&S.att[s.k].d!==day())S.rev[s.k]=1;
  save();
}
function check(){
  const s=L.l.steps[L.q[0]];
  if(s.t==='task'&&s.kind==='explain'&&L.state==='ask'){L.state='rubric';L.ticks=s.rubric.map(()=>false);draw();$('act').textContent='Score my answer';$('act').disabled=false;return}
  let ok,detail='';
  if(s.t==='task'){
    if(s.kind==='cmd'){const res=s.checks.map(([re])=>{try{return new RegExp(re,'i').test(L.txt)}catch(_){return false}});ok=res.every(Boolean);
      detail=`<ul style="margin:0 0 8px;padding-left:18px">${s.checks.map(([_,lab],i)=>`<li>${res[i]?'✓':'✗'} ${esc(lab)}</li>`).join('')}</ul>One good answer: <code>${esc(s.model)}</code>`}
    else{const n=L.ticks.filter(Boolean).length;ok=n/s.rubric.length>=0.6;detail=`You covered ${n} of ${s.rubric.length} key points${ok?'.':` — aim for at least ${Math.ceil(s.rubric.length*0.6)}. Re-read the model answer above.`}`}
  }else ok=s.t==='mcq'?L.sel===s.a:L.fill.every((t,i)=>s.toks[t]===s.ans[i]);
  L.state='fb';L.ok=ok;draw();record(s,ok);
  $('lfoot').className='lfoot '+(ok?'ok':'bad');
  if(s.t!=='task'&&!ok){
    detail=s.t==='mcq'
      ?`You picked <b>${esc(s.opts[L.sel])}</b>.${s.no&&s.no[L.sel]?`<br><span>Why not: ${esc(s.no[L.sel])}</span>`:''}<br>Correct: <b>${esc(s.opts[s.a])}</b>.<br>`
      :s.ans.map((a,i)=>{const g=s.toks[L.fill[i]];return g===a?`Blank ${i+1}: <code>${esc(g)}</code> ✓`:`Blank ${i+1}: you put <code>${esc(g)}</code> — it needs <code>${esc(a)}</code>`}).join('<br>')+'<br>';
  }
  const why=s.t==='task'?'':`${ok?'':'Why: '}${esc(s.why)}`;
  $('fb').innerHTML=`<h3>${ok?(s.t==='task'?'Well done':'Correct'):(s.t==='task'?'Not yet':'Not quite')}</h3><p>${detail}${why}${ok?'':'<br><span class="note">Saved to weak spots — it comes back at the end.</span>'}</p>`;
  $('fb').insertAdjacentHTML('beforeend',`<button class="btn ghost sm" data-walk style="margin-bottom:12px">${ok?'See the full walkthrough':'Show me the full walkthrough'}</button>`);
  $('act').disabled=false;$('act').textContent='Continue';
}
function advance(){
  if(L.state==='fb'&&!L.ok){L.q.push(L.q.shift());L.miss++}else{L.q.shift();L.done++}
  if(!L.q.length)return finish();step();
}
function finish(){
  {const qs=L.l.steps.filter(s=>s.t!=='learn').length,ft=qs-L.wrong.size;logItem(L.l.id==='quick'?'quiz':'lesson',L.l.id==='quick'?`${L.l.title}: ${ft}/${qs} right first try`:`Finished “${L.l.title}”${qs?` — ${ft}/${qs} right first try`:''}`)}
  const isQ=L.l.id==='quick',first=!isQ&&!S.done[L.l.id];
  const gain=isQ?10:first?10+(L.miss?0:5):2;
  S.xp+=gain;if(!isQ)S.done[L.l.id]=true;mark(isQ?'quick':'lesson');bump();save();head();$('lbar').style.width='100%';
  const weak=Object.keys(S.miss).length;
  $('stage').innerHTML=`<div class="done-card"><div class="big">+${gain} XP</div><h2>${esc(L.l.title)} done</h2><p>${L.miss?`${L.miss} mistake${L.miss>1?'s':''} corrected along the way.`:'Clean run — no mistakes.'}${weak?` ${weak} item${weak>1?'s':''} in weak spots.`:''}</p><div class="stats"><div class="stat"><b>${S.streak}</b><small>day streak</small></div><div class="stat"><b>${S.xp}</b><small>total XP</small></div><div class="stat"><b>${lessonsDone()}</b><small>lessons</small></div></div>${(L.l.ref||[]).length?`<div class="panel links" style="text-align:left;width:100%"><h3>Go deeper — official sources</h3>${L.l.ref.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div>`:''}</div>`;
  L.state='end';$('lfoot').className='lfoot';$('fb').innerHTML='';$('act').disabled=false;$('act').textContent='Done';
}

$('act').addEventListener('click',()=>{if(!L)return;if(L.state==='end'||L.state==='read')return closeLesson();if(L.prev){$('stage').innerHTML=L.prev;L.prev=null}if(L.state==='ask'||L.state==='rubric')return check();advance()});
$('stage').addEventListener('input',e=>{if(e.target.id==='taskIn'&&L&&L.state==='ask'){L.txt=e.target.value;$('act').disabled=!L.txt.trim()}});
$('xBtn').addEventListener('click',closeLesson);
$('stage').addEventListener('click',e=>{
  if(!L)return;
  if(e.target.id==='tryIt'){const code=L.l.steps[L.q[0]].code;closeLesson();show('play');pick('free',code+'\n');return}
  if(L.state==='rubric'){const rb=e.target.closest('[data-rb]');if(rb){L.ticks[+rb.dataset.rb]=!L.ticks[+rb.dataset.rb];const y=$('stage').scrollTop;draw();$('stage').scrollTop=y}return}
  if(L.state!=='ask')return;
  const o=e.target.closest('[data-o]'),t=e.target.closest('[data-t]'),b=e.target.closest('[data-b]');
  if(o){L.sel=+o.dataset.o;draw()}
  if(t){const i=L.fill.indexOf(null);if(i>-1){L.fill[i]=+t.dataset.t;draw()}}
  if(b){L.fill[+b.dataset.b]=null;draw()}
});
document.addEventListener('click',e=>{
  if(e.target.closest('#lesson'))return;
  const o=e.target.closest('[data-open]');if(o)openLesson(o.dataset.open);
  const q=e.target.closest('[data-quick]');if(q)quick(q.dataset.quick);
  const tr=e.target.closest('[data-track]');if(tr){S.track=tr.dataset.track;save();renderLearn()}
});

function show(v){
  ['learn','roles','qa','play','me'].forEach(x=>$('v-'+x).hidden=x!==v);
  document.querySelectorAll('nav [data-v]').forEach(b=>b.setAttribute('aria-current',b.dataset.v===v));
  if(v==='me')renderMe();if(v==='learn')renderLearn();if(v==='qa')buildDeck();if(v==='roles')renderRoles();window.scrollTo(0,0);
}
document.querySelectorAll('nav [data-v]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.v)));

/* ---------- Roles & stories ---------- */
let rv=PIPE.length?'pipe':'roles',roleOpen=null,timer=null;
const LV=['Not yet','Learning','Confident'];
const readiness=r=>{const t=r.skills.reduce((a,_,i)=>a+(S.skills[r.id+i]||0),0);return Math.round(t/(r.skills.length*2)*100)};
function renderRoles(){
  if(timer){clearInterval(timer);timer=null}
  document.querySelectorAll('[data-rv]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rv===rv));
  const box=$('roles');
  if(rv==='stories'){
    const n=STORIES.filter(s=>{const v=S.stories[s.id]||{};return v.s&&v.t&&v.a&&v.r}).length;
    box.innerHTML=`<p class="note" style="margin:0 0 14px">Pre-filled from your 2026 accomplishments. Rewrite them in your own words, fill the [brackets], and keep IBM-internal tool and people names out. Then rehearse each aloud against the clock. ${n} of ${STORIES.length} complete. Saved on this device as you type.</p>`+
    STORIES.map(st=>{const v=S.stories[st.id]||{},done=v.s&&v.t&&v.a&&v.r;return`<details class="panel story" data-st="${st.id}"><summary style="cursor:pointer;font-weight:700;min-height:28px">${done?'✓ ':''}${esc(st.q)}</summary><p class="note" style="margin-top:10px">${esc(st.tip)}</p>
      ${[['s','Situation'],['t','Task'],['a','Action — what you did'],['r','Result — with a number']].map(([k,lab])=>`<label for="st-${st.id}-${k}">${lab}</label><textarea id="st-${st.id}-${k}" data-sk="${k}">${esc(v[k]||'')}</textarea>`).join('')}
      <div class="btnrow" style="margin-top:12px"><button class="btn sm" data-rehearse="${st.id}">Rehearse · 2:00</button><button class="btn ghost sm" data-copy="${st.id}">Copy story</button></div></details>`}).join('');
    return;
  }
  if(rv==='pipe'){box.innerHTML=renderPipeline();return}
  if(rv==='comp'){box.innerHTML=renderCompanies();return}
  if(rv==='res'){
    const cats=[...new Set(RES.map(r=>r.cat))];
    box.innerHTML=`<p class="note" style="margin:0 0 14px">Free places to practise and read. Checked ${FEED[FEED.length-1].d}; the weekly update adds more.</p>`+cats.map(c=>`<div class="panel links"><h3>${esc(c)}</h3>${RES.filter(r=>r.cat===c).map(r=>`<a href="${r.u}" target="_blank" rel="noopener">${esc(r.t)} ↗</a><p class="note" style="margin:0 0 8px">${esc(r.why)}</p>`).join('')}</div>`).join('');
    return;
  }
  if(roleOpen){
    const r=ROLES.find(x=>x.id===roleOpen),rd=readiness(r);
    box.innerHTML=`<button class="back" data-role="">← All roles</button><h2 style="font-size:28px;margin:4px 0 8px">${esc(r.name)}</h2><p style="margin:0 0 14px">${esc(r.sum)}</p>
    <div class="panel"><h3>Demonstrated ${demoPct(r.lessons)}%</h3><div class="meter"><i style="width:${demoPct(r.lessons)}%"></i></div><p class="note" style="margin:6px 0 12px">Questions in this role's lessons you got right first time or passed again later.</p><h3>Self-rated ${rd}%</h3><div class="meter"><i style="width:${rd}%;background:var(--dusk)"></i></div><p class="note" style="margin:10px 0 0">Tap a skill to move it: not yet → learning → confident. If self-rated runs far ahead of demonstrated, drill those lessons.</p>
    ${r.skills.map((s,i)=>{const lv=S.skills[r.id+i]||0;return`<button class="skill s${lv}" data-skill="${r.id+i}"><i></i><span>${esc(s)}</span><em>${LV[lv]}</em></button>`}).join('')}</div>
    ${planHTML(r)}
    <div class="panel"><h3>Typical interview rounds</h3><ol class="rounds">${r.rounds.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div>
    <div class="panel"><h3>Practise in this app</h3><div class="btnrow">${r.lessons.map(id=>{const l=ALL.find(x=>x.id===id);return`<button class="btn ghost sm" data-open="${id}">${S.done[id]?'✓ ':''}${esc(l.title)}</button>`}).join('')}</div>
      <div class="btnrow" style="margin-top:10px">${r.decks.map(d=>`<button class="btn sm" data-deck="${d}">${DECK[d]} Q&amp;A</button>`).join('')}<button class="btn sm" data-rv="stories">My stories</button></div></div>
    <div class="panel"><h3>Certifications worth it</h3><p style="margin:0">${esc(r.certs)}</p></div>
    <div class="panel links"><h3>Free resources</h3>${r.links.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div>`;
    return;
  }
  box.innerHTML=`<p class="note" style="margin:0 0 14px">Built from current Hyderabad job postings and interview reports. Open a role to see its rounds, rate your skills and jump to the matching drills.</p>`+
  ROLES.map(r=>{const rd=readiness(r);return`<button class="role" data-role="${r.id}"><h3>${esc(r.name)}</h3><small>demonstrated ${demoPct(r.lessons)}% · self-rated ${rd}%</small><div class="meter"><i style="width:${demoPct(r.lessons)}%"></i></div></button>`}).join('');
}
document.addEventListener('click',e=>{
  const rvb=e.target.closest('[data-rv]');if(rvb){rv=rvb.dataset.rv;roleOpen=null;if($('v-roles').hidden)show('roles');else{renderRoles();window.scrollTo(0,0)}return}
  const rb=e.target.closest('[data-role]');if(rb){roleOpen=rb.dataset.role||null;renderRoles();window.scrollTo(0,0);return}
  const sk=e.target.closest('[data-skill]');if(sk){const k=sk.dataset.skill;S.skills[k]=((S.skills[k]||0)+1)%3;save();const y=window.scrollY;renderRoles();window.scrollTo(0,y);return}
  const dk=e.target.closest('[data-deck]');if(dk){deckF=dk.dataset.deck;show('qa');return}
  const rh=e.target.closest('[data-rehearse]');if(rh){
    if(timer){clearInterval(timer);timer=null;rh.textContent='Rehearse · 2:00';return}
    let t=120;const tick=()=>{rh.textContent=t>0?`Stop · ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`:'Time — wrap up!';if(t<=0){clearInterval(timer);timer=null}t--};
    tick();timer=setInterval(tick,1000);return}
  const cp=e.target.closest('[data-copy]');if(cp){const st=STORIES.find(x=>x.id===cp.dataset.copy),v=S.stories[st.id]||{};
    const txt=`${st.q}\n\nSituation: ${v.s||''}\nTask: ${v.t||''}\nAction: ${v.a||''}\nResult: ${v.r||''}`;
    Promise.resolve().then(()=>navigator.clipboard.writeText(txt)).then(()=>{cp.textContent='Copied'},()=>{cp.textContent='Copy failed'});setTimeout(()=>cp.textContent='Copy story',2000)}
});
$('roles').addEventListener('input',e=>{const ta=e.target.closest('[data-sk]');if(!ta)return;const id=ta.closest('[data-st]').dataset.st;S.stories[id]=S.stories[id]||{};S.stories[id][ta.dataset.sk]=ta.value;logDay().n['st_'+id]=1;save()});

/* ---------- Q&A deck with spaced repetition + mock interviews ---------- */
const IV=[0,1,3,7,14,30];
const cst=k=>{const v=S.cards[k];if(!v)return null;if(typeof v==='string')return{box:v==='got'?1:0,due:day()};return v};
const known=k=>{const v=cst(k);return!!v&&v.box>=1};
const isAgain=k=>{const v=cst(k);return!!v&&v.box===0};
const isDue=k=>{const v=cst(k);return!!v&&v.due<=day()};
function rate(k,res){const v=cst(k)||{box:0,due:day()};let box=v.box;if(res==='got'&&cst(k)&&v.box>=1&&v.due<=day()){S.crev=S.crev||{};S.crev[k]=1}
  if(res==='got')box=Math.min(box+1,IV.length-1);else if(res==='again')box=0;
  S.cards[k]={box,due:day(res==='got'?IV[box]:res==='again'?0:1)}}
let deckF='all',deck=[],di=0,shown=false,mock=null,mockT=null;
const FILT=[['due','Due today'],['all','All'],['you','Your story'],['aws','AWS'],['rep','Reported'],['con','Concepts'],['sto','Storage'],['sec','Security'],['py','Python'],['ops','DevOps'],['auto','Automation'],['scn','Scenarios'],['beh','Behavioural'],['again','Needs review']];
const dueN=()=>CARDS.filter(c=>isDue(c.k)).length;
function buildDeck(){
  mock=null;if(mockT){clearInterval(mockT);mockT=null}
  const rank=c=>isDue(c.k)?0:isAgain(c.k)?1:cst(c.k)?3:2;
  const f=c=>deckF==='all'?true:deckF==='due'?isDue(c.k):deckF==='again'?isAgain(c.k):deckF.startsWith('co:')?(c.src&&c.src[0].includes(deckF.slice(3))):c.tr===deckF;
  deck=shuffle(CARDS.filter(f)).sort((a,b)=>rank(a)-rank(b));
  di=0;shown=false;renderCard();
}
function renderCard(){
  const again=CARDS.filter(c=>isAgain(c.k)).length,due=dueN();
  $('deckF').innerHTML=(deckF.startsWith('co:')?`<button data-f="${esc(deckF)}" aria-pressed="true">${esc(deckF.slice(3))}</button>`:'')+FILT.map(([k,n])=>`<button data-f="${k}" aria-pressed="${deckF===k}">${n}${k==='again'&&again?` (${again})`:''}${k==='due'?` (${due})`:''}</button>`).join('');
  $('mockBtn').hidden=false;$('deckF').hidden=false;
  if(!deck.length){$('deck').innerHTML=`<div class="panel"><h3>${deckF==='due'?'Nothing due today':'Nothing here yet'}</h3><p class="note">${deckF==='due'?'Rated cards come back after 1, 3, 7, 14 and 30 days. Try All, or a mock interview.':'Cards you mark "Again" collect here.'}</p></div>`;return}
  if(di>=deck.length){const got=deck.filter(c=>known(c.k)).length;
    $('deck').innerHTML=`<div class="qa"><h2>Deck finished</h2><p>${got} of ${deck.length} are now in your "known" pile. Each comes back just before you'd forget it.</p><button class="btn" id="again">Go again</button></div>`;return}
  const c=deck[di],v=cst(c.k);
  $('deck').innerHTML=`<div class="qa"><div class="meta"><span>${DECK[c.tr]}${c.src?' · real question':''}</span><span>${di+1} / ${deck.length}</span></div><h2>${esc(c.q)}</h2>${shown?`<div class="ans"><span class="note">Model answer</span><br>${esc(c.a)}${c.src?`<p class="note" style="margin:10px 0 0">Reported: <a href="${c.src[1]}" target="_blank" rel="noopener" style="color:var(--rose)">${esc(c.src[0])} ↗</a></p>`:''}</div><p class="note" style="margin:0">Did yours cover the same key points?</p><div class="row"><button class="btn ghost" data-r="again">Again</button><button class="btn ghost" data-r="hard">Hard</button><button class="btn" data-r="got">Got it</button></div><p class="note" style="margin:0">Again: today · Hard: tomorrow · Got it: in ${IV[Math.min((v?v.box:0)+1,IV.length-1)]} day${IV[Math.min((v?v.box:0)+1,IV.length-1)]>1?'s':''}</p>`:`<button class="btn" id="reveal">Show answer</button>`}</div>`;
}
/* mock interview */
function mockPick(){
  $('deckF').hidden=true;
  $('deck').innerHTML=`<div class="qa"><h2>Mock interview</h2><p>Five questions for one role, two minutes each. Answer out loud, then compare with the model answer and score yourself honestly.</p>${ROLES.map(r=>`<button class="btn ghost" data-mock="${r.id}">${esc(r.name)}</button>`).join('')}<button class="back" id="mockExit">← Back to cards</button></div>`;
}
function mockStart(rid){
  const r=ROLES.find(x=>x.id===rid),pool=shuffle(CARDS.filter(c=>r.decks.includes(c.tr)&&c.tr!=='beh'));
  const beh=shuffle(CARDS.filter(c=>c.tr==='beh'));
  mock={r,qs:pool.slice(0,4).concat(beh.slice(0,1)),i:0,sc:[],shown:false};mockQ();
}
function mockQ(){
  if(mockT){clearInterval(mockT);mockT=null}
  const m=mock;if(m.i>=m.qs.length)return mockEnd();
  const c=m.qs[m.i];
  $('deck').innerHTML=`<div class="qa"><div class="meta"><span>Mock · ${esc(m.r.name)}</span><span>${m.i+1} / ${m.qs.length}</span></div><h2>${esc(c.q)}</h2><p id="mockClock" style="font:300 40px/1 'Inter Tight',-apple-system,system-ui,sans-serif;color:var(--rose);margin:0">2:00</p>${m.shown?`<div class="ans"><span class="note">Model answer</span><br>${esc(c.a)}</div><p class="note" style="margin:0">How did you do?</p><div class="row"><button class="btn ghost" data-ms="0">Missed</button><button class="btn ghost" data-ms="1">Partly</button><button class="btn" data-ms="2">Nailed it</button></div>`:`<button class="btn" id="mockReveal">I've answered — show model answer</button>`}<button class="back" id="mockExit">End mock</button></div>`;
  if(!m.shown){let t=120;mockT=setInterval(()=>{t--;const el=$('mockClock');if(!el){clearInterval(mockT);return}el.textContent=t>0?`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`:'Time — wrap up';if(t<=0){clearInterval(mockT);mockT=null}},1000)}
  else $('mockClock').textContent='';
}
function mockEnd(){
  const m=mock,tot=m.sc.reduce((a,b)=>a+b,0),pct=Math.round(tot/(m.qs.length*2)*100);
  S.mocks=(S.mocks||[]).concat([{d:day(),r:m.r.id,p:pct}]).slice(-50);logItem('mock',`Mock interview (${m.r.name}): ${pct}%`);S.xp+=5;bump();save();head();
  const lab=[`Missed`,`Partly`,`Nailed`];
  $('deck').innerHTML=`<div class="qa"><span class="note">Mock · ${esc(m.r.name)}</span><h2>Score ${pct}%</h2><p>${pct>=80?'Interview-ready on these topics.':pct>=50?'Good base — review the ones you missed.':'Worth another pass this week.'} Missed and partial answers are now due for review.</p><ul style="margin:0;padding-left:18px">${m.qs.map((c,i)=>`<li style="margin-bottom:6px">${lab[m.sc[i]]} — ${esc(c.q)}</li>`).join('')}</ul><button class="btn" id="mockAgain">Another mock</button><button class="back" id="mockExit">Back to cards</button></div>`;
  mock=null;
}
$('mockBtn').addEventListener('click',()=>{if(mockT){clearInterval(mockT);mockT=null}mock=null;mockPick()});
$('deckF').addEventListener('click',e=>{const f=e.target.closest('[data-f]');if(f){deckF=f.dataset.f;buildDeck()}});
$('deck').addEventListener('click',e=>{
  const id=e.target.id;
  if(id==='mockExit'||id==='again'){buildDeck();return}
  if(id==='mockAgain'){mockPick();return}
  const mk=e.target.closest('[data-mock]');if(mk){mockStart(mk.dataset.mock);return}
  if(id==='mockReveal'){mock.shown=true;mockQ();return}
  const ms=e.target.closest('[data-ms]');if(ms&&mock){const s=+ms.dataset.ms,c=mock.qs[mock.i];mock.sc.push(s);rate(c.k,s===2?'got':s===1?'hard':'again');mark('cards');save();mock.i++;mock.shown=false;mockQ();return}
  if(id==='reveal'){shown=true;renderCard()}
  const r=e.target.closest('[data-r]');
  if(r){const c=deck[di],was=known(c.k);rate(c.k,r.dataset.r);logCount('cards');if(r.dataset.r==='got'&&!was)S.xp+=1;mark('cards');bump();save();head();di++;shown=false;renderCard()}
});

/* ---------- Progress ---------- */
function renderMe(){
  bkNote();renderCal();
  const got=CARDS.filter(c=>known(c.k)).length,weak=Object.keys(S.miss).length;renderApps();
  $('meStats').innerHTML=`<div class="stat"><b>${liveStreak()}</b><small>day streak</small></div><div class="stat"><b>${lessonsDone()}/${ALL.length}</b><small>lessons</small></div><div class="stat"><b>${got}/${CARDS.length}</b><small>Q&amp;A known</small></div>`;
  {const quiz=ALL.flatMap(l=>l.steps.filter(x=>x.t!=='learn')),att=S.att||{},tk=quiz.filter(x=>x.t==='task');
   const tried=quiz.filter(x=>att[x.k]).length,first=quiz.filter(x=>att[x.k]&&att[x.k].ok).length,rev=Object.keys(S.rev||{}).length;
   const drills=CHAL.filter(c=>c.id!=='free'),solved=drills.filter(c=>S.done['ch_'+c.id]).length,solo=drills.filter(c=>S.solo&&S.solo['ch_'+c.id]).length;
   const row=(a,b,c)=>`<div class="trk" style="margin:8px 0"><div><span>${a}</span><b>${b}</b></div>${c?`<span class="note">${c}</span>`:''}</div>`;
   $('meSkill').innerHTML=`<h3>Completed vs demonstrated</h3><p class="note" style="margin:0 0 6px">Finishing isn't the same as knowing. These count only what you got right without help, or recalled later.</p>`+
    row('Lessons completed',`${lessonsDone()} / ${ALL.length}`,'Includes lessons where you needed retries.')+
    row('Questions right on the first try',`${first} / ${tried} tried`,`${quiz.length} questions in total.`)+
    row('Questions passed again on a later day',rev,'The strongest signal you\'ve kept it.')+
    row('Your-turn tasks done unaided',`${tk.filter(x=>att[x.k]&&att[x.k].ok).length} / ${tk.length}`,'Commands checked automatically; explanations self-scored against key points.')+
    row('Code drills solved without hints or solutions',`${solo} / ${drills.length}`,`${solved} solved in total, including with help.`)+
    (()=>{const T=S.times||{},ids=Object.keys(T).filter(k=>T[k].length),bests=ids.map(k=>Math.min(...T[k].map(t=>t.s))).sort((a,b)=>a-b);return row('Interview-mode solves (timed, no help)',ids.length,ids.length?`Median best time ${fmtT(bests[Math.floor(bests.length/2)])}. Aim for under 20 minutes on medium.`:'Turn on Interview mode in Code → Drills.')})()+
    row('Flashcards recalled at a later review',Object.keys(S.crev||{}).length,'Rated "Got it" when a card came due again.');}
  $('meWeak').innerHTML=`<h3>Weak spots</h3><p class="note">${weak?`${weak} question${weak>1?'s':''} you got wrong. Get each right once to clear it.`:'No weak spots yet. Wrong answers land here.'}</p>${weak?`<div class="btnrow"><button class="btn sm" data-quick="weak">Drill weak spots</button><button class="btn ghost sm" data-walklist>Read the walkthroughs</button></div>`:''}`;renderPlan90();
  $('meTracks').innerHTML='<h3>Tracks</h3>'+Object.entries(TRACKS).map(([k,t])=>{const d=t.lessons.filter(l=>S.done[l.id]).length,cs=CARDS.filter(c=>c.tr===k),cg=cs.filter(c=>known(c.k)).length;
    return`<div class="trk"><div><span>${t.name}</span><span>${d}/${t.lessons.length} lessons · ${cg}/${cs.length} cards</span></div><div class="meter"><i style="width:${(d+cg)/(t.lessons.length+cs.length)*100}%"></i></div></div>`}).join('')
   +'<h3 style="margin-top:16px">Role readiness</h3><p class="note" style="margin:0">Demonstrated = questions in the role\'s lessons you got right first time or passed again later. Self-rated = your skill ticks.</p>'+ROLES.map(r=>{const rd=readiness(r),dm=demoPct(r.lessons);return`<div class="trk"><div><span>${esc(r.name)}</span><span>demonstrated ${dm}% · self-rated ${rd}%</span></div><div class="meter"><i style="width:${dm}%"></i></div></div>`}).join('');
}
let wipeArm=false;
$('wipe').addEventListener('click',e=>{
  if(!wipeArm){wipeArm=true;e.target.textContent='Tap again to confirm';setTimeout(()=>{wipeArm=false;e.target.textContent='Reset progress'},3000);return}
  const tr=S.track;S=fresh();S.track=tr;save();wipeArm=false;e.target.textContent='Reset progress';renderMe();head();
});
$('exp').addEventListener('click',e=>{
  const code=btoa(unescape(encodeURIComponent(JSON.stringify(S))));$('impTxt').value=code;
  Promise.resolve().then(()=>navigator.clipboard.writeText(code)).then(()=>{$('impMsg').textContent='Copied. It is also in the box below.'},()=>{$('impMsg').textContent='Copy blocked — select the code in the box and copy it.'});
});
function bkApply(d){if(!d||typeof d!=='object'||!d.done)throw 0;S=Object.assign(fresh(),d);fix();save();renderMe();head()}
function bkNote(){const el=$('bkNote');el.dataset.base=el.dataset.base||el.innerHTML;el.innerHTML=el.dataset.base+(S.bk?` <b>Last backup: ${esc(S.bk)}.</b>`:' <b>No backup yet.</b>')}
$('bkDown').addEventListener('click',async()=>{const prev=S.bk;S.bk=day();const r=await saveFile(`codetrail-backup-${day()}.json`,JSON.stringify(S,null,1));if(r!=='saved'){S.bk=prev;$('impMsg').textContent=r==='declined'?'Backup cancelled.':'Download is not available here — use Copy progress code instead.';return}save();$('impMsg').textContent='Backup saved. On iPhone, choose Save to Files.';bkNote()});
$('bkUpBtn').addEventListener('click',()=>$('bkUp').click());
$('bkUp').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{bkApply(JSON.parse(r.result));$('impMsg').textContent='Backup restored.'}catch(_){$('impMsg').textContent='That file is not a CodeTrail backup.'}e.target.value=''};r.readAsText(f)});
$('imp').addEventListener('click',()=>{
  try{const d=JSON.parse(decodeURIComponent(escape(atob($('impTxt').value.trim()))));if(!d||typeof d!=='object'||!d.done)throw 0;
    bkApply(d);$('impMsg').textContent='Progress imported.'}
  catch(e){$('impMsg').textContent='That code is not valid. Copy it again from the other device.'}
});

/* ---------- Code drills ---------- */
let cur=CHAL[0];
function pick(id,code){
  cur=CHAL.find(c=>c.id===id);
  $('chal').innerHTML=CHAL.map(c=>`<button data-c="${c.id}" aria-pressed="${c.id===id}">${S.done['ch_'+c.id]?'✓ ':''}${esc(c.name)}${c.id==='free'?'':` · ${c.diff||DIFF[c.id]||'easy'}`}</button>`).join('');
  $('chalInfo').innerHTML=`<h3>${esc(cur.name)}</h3><p style="margin:0">${cur.info}</p>${cur.exp?`<p class="note" style="margin:8px 0 0">Expected output:</p><pre style="margin:6px 0 0">${esc(cur.exp)}</pre>`:''}${cur.tests?`<p class="note" style="margin:8px 0 0">Write the function <code>${cur.fn}</code>. Run checks it against ${cur.tests.length} hidden test cases and explains any that fail.</p>`:''}${cur.hint?`<button class="btn ghost sm" id="hintBtn" style="margin-top:12px">Show hint</button><div class="hint" id="hint" hidden>${esc(cur.hint)}</div>`:''}${SOL[cur.id]?`<button class="btn ghost sm" data-showsol="${cur.id}" style="margin-top:12px">Solution walkthrough</button>`:''}`;
  if(S.imode&&cur.id!=='free'){['hintBtn'].forEach(x=>{const el=$(x);if(el)el.remove()});$('chalInfo').querySelectorAll('[data-showsol]').forEach(el=>el.remove());
    const bt=(S.times||{})[cur.id],best=bt&&bt.length?Math.min(...bt.map(t=>t.s)):null;
    $('chalInfo').insertAdjacentHTML('beforeend',`<p class="note" style="margin:10px 0 0">Interview mode: no hints or solutions. The clock starts when you type.${best!=null?` Your best: ${fmtT(best)}.`:''}</p>`)}
  imT0=null;imShow();
  $('ed').value=code||cur.start;$('verdict').textContent='';$('verdict').className='verdict';$('out').textContent='Output appears here.';$('explain').hidden=true;
}
$('chal').addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c)pick(c.dataset.c)});
$('chalInfo').addEventListener('click',e=>{if(e.target.id==='hintBtn'){$('hint').hidden=false;e.target.hidden=true;S.dhelp=S.dhelp||{};S.dhelp[cur.id]=1;save()}});
$('reset').addEventListener('click',()=>pick(cur.id));
let imT0=null;
const fmtT=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function imShow(){const b=$('imode');b.textContent='Interview mode: '+(S.imode?'on':'off');b.setAttribute('aria-pressed',!!S.imode);const c=$('iclock');c.hidden=!S.imode||!cur||cur.id==='free';c.textContent='⏱ '+(imT0?fmtT(Math.floor((Date.now()-imT0)/1000)):'0:00')}
setInterval(()=>{if(S.imode&&imT0&&!$('v-play').hidden)imShow()},1000);
$('imode').addEventListener('click',()=>{S.imode=!S.imode;save();pick(cur.id,$('ed').value)});
$('ed').addEventListener('input',()=>{if(S.imode&&!imT0&&cur&&cur.id!=='free'){imT0=Date.now();imShow()}});
$('ed').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const t=e.target;t.setRangeText('    ',t.selectionStart,t.selectionEnd,'end')}});

const ERR={
 NameError:`Python doesn't know that name. Usually a typo, a variable used before it's assigned, or a missing import.`,
 SyntaxError:`Python couldn't read the code. Check that line and the one above it for a missing colon after if/for/def, an unclosed bracket or quote, or = where == was meant.`,
 IndentationError:`The indentation is off. Every line inside an if/for/def block needs the same indent (4 spaces), and a block can't be empty — use pass.`,
 TabError:`Tabs and spaces are mixed. Use 4 spaces everywhere.`,
 TypeError:`An operation got the wrong type of value — for example adding a str to an int (use str() or an f-string), calling something that isn't a function, or passing the wrong number of arguments.`,
 IndexError:`You asked for a list position that doesn't exist. Indexes run from 0 to len(x) - 1; check loop bounds.`,
 KeyError:`That key isn't in the dict. Use d.get(key, default), or check "key in d" first.`,
 AttributeError:`That value has no such method or attribute. Check the spelling, the type (a list isn't a str), or whether the value is None.`,
 ValueError:`The type is right but the value isn't — for example int("abc"), or unpacking the wrong number of items.`,
 ZeroDivisionError:`You divided by zero. Guard the divisor before dividing.`,
 RecursionError:`Your recursion never stops. Make sure there's a base case that returns without calling itself again.`,
 UnboundLocalError:`You assigned to this variable inside the function, so Python treats it as local — but read it before assigning. Pass it in as an argument instead.`,
 ModuleNotFoundError:`That module isn't available in this browser runtime. The standard library (collections, itertools, json, re…) works.`,
 ImportError:`The import failed — check the module and name spelling.`,
 ConnectionError:`Your code raised ConnectionError — in the retry drill, it means your retry loop didn't catch it and try again.`};
function explainError(msg,code){
  const last=msg.trim().split('\n').pop(),type=(last.match(/^(\w+)/)||[])[1]||'Error';
  const lines=[...msg.matchAll(/File "<exec>", line (\d+)/g)],ln=lines.length?+lines[lines.length-1][1]:null;
  const src=ln?code.split('\n')[ln-1]:null;
  return`<h3>${esc(type)}${ln?` on line ${ln}`:''}</h3><p>${esc(ERR[type]||'Read the last line of the error: it names the problem and the line it happened on.')}</p><p class="note" style="margin:0">Python said: ${esc(last)}</p>${src!=null&&src.trim()?`<pre><code>${ln}  ${esc(src)}</code></pre>`:''}`;
}
function explainDiff(got,exp){
  const norm=x=>x.trim().split('\n').map(l=>l.trimEnd()).join('\n');
  const g=norm(got),e=exp.split('\n'),gl=g?g.split('\n'):[],notes=[];
  if(!g)return`<h3>Nothing was printed</h3><p>Your code ran but printed nothing. Did you forget print(), or build the answer without printing it?</p>`;
  if(gl.includes('None')&&!e.includes('None'))notes.push(`A line printed None — usually a function with no return, or printing the result of something like list.sort(), which returns None.`);
  for(let i=0;i<Math.max(gl.length,e.length)&&notes.length<4;i++){
    const a=gl[i],b=e[i];if(a===b)continue;
    if(a==null){notes.push(`Missing line ${i+1}: expected <code>${esc(b)}</code>.`);continue}
    if(b==null){notes.push(`Extra line ${i+1}: <code>${esc(a)}</code> — leftover debug print?`);continue}
    let why='';
    if(a.replace(/['"]/g,'')===b.replace(/['"]/g,''))why=' — only quotes differ; print the value itself, not its repr.';
    else if(a.toLowerCase()===b.toLowerCase())why=' — only upper/lower case differs.';
    else if(a.replace(/\s+/g,'')===b.replace(/\s+/g,''))why=' — only spacing differs.';
    else if(a.replace(/[\[\]()]/g,'')===b.replace(/[\[\]()]/g,''))why=' — brackets differ; check list vs tuple, or printing a list vs its items.';
    notes.push(`Line ${i+1}: expected <code>${esc(b)}</code> but got <code>${esc(a)}</code>${why}`);
  }
  return`<h3>Output doesn't match yet</h3><ul>${notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
}

function explainTests(res,fn){
  const show=x=>{const t=x===null||x===undefined?'None':JSON.stringify(x).replace(/\btrue\b/g,'True').replace(/\bfalse\b/g,'False').replace(/\bnull\b/g,'None');return t.length>80?t.slice(0,77)+'…':t};
  const fails=res.filter(t=>!t[3]).slice(0,4);
  const nf=res.filter(t=>!t[3]).length;return`<h3>${nf} failing test${nf>1?'s':''}${nf>fails.length?` (showing ${fails.length})`:''}</h3><ul>${fails.map(([a,x,g,_,err])=>{
    let why='';
    if(err)why=`It raised <b>${esc(err)}</b>. ${esc(ERR[(err.match(/^(\w+)/)||[])[1]]||'')}`;
    else if(g===null||g===undefined)why='It returned None — is there a return statement on every path?';
    else if(Array.isArray(x)&&Array.isArray(g)&&x.length!==g.length)why=`Expected ${x.length} item${x.length===1?'':'s'}, got ${g.length}.`;
    else if(Array.isArray(x)&&Array.isArray(g)&&JSON.stringify([...x].sort())===JSON.stringify([...g].sort()))why='Right items, wrong order — check your sorting.';
    else if(typeof x!==typeof g)why=`Wrong type: expected ${Array.isArray(x)?'list':typeof x==='object'?'dict':typeof x==='boolean'?'bool':typeof x}, got ${Array.isArray(g)?'list':typeof g==='object'?'dict':typeof g==='boolean'?'bool':typeof g}.`;
    return`<li><code>${esc(fn)}(${esc(a.map(show).join(', '))})</code><br>expected <code>${esc(show(x))}</code> · got <code>${esc(err?'error':show(g))}</code>${why?`<br>${why}`:''}</li>`}).join('')}</ul>`;
}
const PY='https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
/* Python runs in a Web Worker: the page never freezes, Stop always works,
   and every submission gets a fresh namespace. */
const HARNESS=["import json as _j","_f = globals().get(_FN)","if not callable(_f):","    raise NameError(\"name '\" + _FN + \"' is not defined — define the function with exactly that name\")","_res = []","for _a, _x in _j.loads(_TESTS_JSON):","    try:","        _g = _f(*_a)","        _res.append([_a, _x, _g, _g == _x, None])","    except Exception as _e:","        _res.append([_a, _x, None, False, type(_e).__name__ + ': ' + str(_e)])","_RESULT = _j.dumps(_res, default=repr)"].join('\n');
const IDE_DRIVER="import json as _json, sys as _sys, os as _os, io as _io, time as _time, traceback as _tb, shutil as _sh, types as _types, importlib as _il\ndef _ct_main():\n    d = _json.loads(_IDE_JSON)\n    W = '/tmp/ct_ws'\n    _sh.rmtree(W, ignore_errors=True); _os.makedirs(W)\n    for name, text in d['files'].items():\n        p = _os.path.join(W, name)\n        _os.makedirs(_os.path.dirname(p), exist_ok=True)\n        with open(p, 'w', encoding='utf-8') as f: f.write(text)\n    before = dict(d['files'])\n    _os.chdir(W)\n    _sys.path[:] = [W] + [x for x in _sys.path if x != W]\n    for m in list(_sys.modules):\n        f = getattr(_sys.modules[m], '__file__', None) or ''\n        if f.startswith(W) or m == 'pytest' and getattr(_sys.modules[m], '_ct_shim', False):\n            del _sys.modules[m]\n    _sys.modules['pytest'] = _shim()  # small built-in pytest: raises, approx, fixture, mark.parametrize\n    old_in, old_argv = _sys.stdin, _sys.argv\n    _sys.stdin = _io.StringIO(d.get('stdin', ''))\n    entry = d['entry']\n    _sys.argv = [entry] + d.get('args', [])\n    res = {'err': None, 'tests': None}\n    t0 = _time.perf_counter()\n    def fmt():\n        et, ev, tb = _sys.exc_info()\n        while tb is not None and not tb.tb_frame.f_code.co_filename.startswith(W):\n            tb = tb.tb_next\n        return ''.join(_tb.format_exception(et, ev, tb))\n    try:\n        if d['mode'] == 'tests':\n            res['tests'] = _run_tests(W, d['files'])\n        else:\n            g = {'__name__': '__main__', '__file__': _os.path.join(W, entry), '__builtins__': __builtins__}\n            with open(entry, encoding='utf-8') as f: src = f.read()\n            exec(compile(src, _os.path.join(W, entry), 'exec'), g)\n    except SystemExit as e:\n        if e.code not in (None, 0): res['err'] = 'SystemExit: exit code ' + str(e.code)\n    except BaseException:\n        res['err'] = fmt()\n    finally:\n        _sys.stdin, _sys.argv = old_in, old_argv\n        _sys.stdout.flush()\n    res['ms'] = round((_time.perf_counter() - t0) * 1000)\n    out = {}\n    for root, _, names in _os.walk(W):\n        for n in names:\n            p = _os.path.join(root, n); rel = _os.path.relpath(p, W)\n            if '__pycache__' in rel or _os.path.getsize(p) > 200000: continue\n            try:\n                with open(p, encoding='utf-8') as f: txt = f.read()\n            except Exception: continue\n            if before.get(rel) != txt: out[rel] = txt\n    res['changed'] = out\n    return res\n\ndef _shim():\n    m = _types.ModuleType('pytest'); m._ct_shim = True\n    class _Raises:\n        def __init__(s, exc, match=None): s.exc, s.match, s.value = exc, match, None\n        def __enter__(s): return s\n        def __exit__(s, et, ev, tb):\n            if et is None: raise AssertionError('DID NOT RAISE ' + s.exc.__name__)\n            if not issubclass(et, s.exc): return False\n            import re\n            if s.match and not re.search(s.match, str(ev)): raise AssertionError('Pattern %r not found in %r' % (s.match, str(ev)))\n            s.value = ev; return True\n    m.raises = lambda exc, match=None: _Raises(exc, match)\n    def approx(v, rel=1e-6, **kw):\n        import builtins as b\n        tol = kw.get('abs', 1e-12)\n        class A:\n            def __eq__(s, o): return o is not None and b.abs(o - v) <= max(rel * b.abs(v), tol)\n            def __repr__(s): return 'approx(%r)' % (v,)\n        return A()\n    m.approx = approx\n    def fixture(fn=None, **kw):\n        if fn is None: return lambda f: setattr(f, '_ct_fixture', True) or f\n        fn._ct_fixture = True; return fn\n    m.fixture = fixture\n    class _Mark:\n        def parametrize(s, names, values):\n            def deco(f): f._ct_params = ([n.strip() for n in names.split(',')] if isinstance(names, str) else list(names), list(values)); return f\n            return deco\n        def __getattr__(s, name): return lambda *a, **k: (lambda f: f)\n    m.mark = _Mark()\n    def fail(msg=''): raise AssertionError(msg)\n    m.fail = fail\n    return m\n\ndef _run_tests(W, files):\n    import inspect\n    tests = []\n    names = sorted(n for n in files if n.endswith('.py') and (_os.path.basename(n).startswith('test_') or n.endswith('_test.py')))\n    for n in names:\n        modname = n[:-3].replace('/', '.')\n        try:\n            mod = _il.import_module(modname)\n        except BaseException as e:\n            tests.append([n, '(import)', False, _err_line(e, W)]); continue\n        fixtures = {k: v for k, v in vars(mod).items() if callable(v) and getattr(v, '_ct_fixture', False)}\n        for k, fn in list(vars(mod).items()):\n            if not (k.startswith('test') and callable(fn) and getattr(fn, '__module__', '') == mod.__name__): continue\n            cases = [({}, k)]\n            if hasattr(fn, '_ct_params'):\n                pn, vals = fn._ct_params\n                cases = [(dict(zip(pn, v if isinstance(v, (tuple, list)) and len(pn) > 1 else (v,))), '%s[%s]' % (k, '-'.join(map(str, v if isinstance(v, (tuple, list)) and len(pn) > 1 else (v,))))) for v in vals]\n            for kw, label in cases:\n                try:\n                    args = {}\n                    for p in inspect.signature(fn).parameters:\n                        if p in kw: args[p] = kw[p]\n                        elif p in fixtures: args[p] = fixtures[p]()\n                        elif p == 'tmp_path':\n                            import pathlib, tempfile; args[p] = pathlib.Path(tempfile.mkdtemp())\n                    fn(**args)\n                    tests.append([n, label, True, None])\n                except BaseException as e:\n                    tests.append([n, label, False, _err_line(e, W)])\n    return tests\n\ndef _err_line(e, W):\n    tb = e.__traceback__; where = ''\n    while tb is not None:\n        f = tb.tb_frame.f_code.co_filename\n        if f.startswith(W): where = '%s:%d' % (_os.path.relpath(f, W), tb.tb_lineno)\n        tb = tb.tb_next\n    msg = type(e).__name__ + (': ' + str(e) if str(e) else '')\n    if isinstance(e, AssertionError) and not str(e) and where:\n        try:\n            fn, ln = where.rsplit(':', 1)\n            with open(_os.path.join(W, fn), encoding='utf-8') as f: msg = 'AssertionError: ' + f.read().split('\\n')[int(ln) - 1].strip()\n        except Exception: pass\n    return [msg, where]\n\n_IDE_RESULT = _json.dumps(_ct_main())\n";
const WSRC=[
"importScripts('"+PY+"pyodide.js');",
"let py=null;",
"const ready=loadPyodide({indexURL:'"+PY+"'}).then(p=>{py=p;postMessage({ready:true})},e=>postMessage({fatal:String(e)}));",
"const HARNESS="+JSON.stringify(HARNESS)+";",
"const IDE_DRIVER="+JSON.stringify(IDE_DRIVER)+";",
"self.onmessage=async e=>{",
"  const {id,code,fn,tests}=e.data;await ready;if(!py)return;",
"  let buf='';py.setStdout({batched:t=>{buf+=t+'\\n'}});py.setStderr({batched:t=>{buf+=t+'\\n'}});",
"  if(e.data.ide){const ide=e.data.ide;let err=null,ires=null;const ns=py.globals.get('dict')();",
"    try{const src=Object.keys(ide.files).filter(n=>n.endsWith('.py')).map(n=>ide.files[n]).join('\\n').split('\\n').filter(l=>!/^\\s*(import|from)\\s+pytest\\b/.test(l)).join('\\n');",
"      try{await py.loadPackagesFromImports(src)}catch(_){}",
"      ns.set('_IDE_JSON',JSON.stringify(ide));await py.runPythonAsync(IDE_DRIVER,{globals:ns});ires=JSON.parse(ns.get('_IDE_RESULT'))",
"    }catch(x){err=String(x.message||x)}",
"    try{ns.destroy()}catch(_){}postMessage({id,out:buf,err,ide:ires});return}",
"  const ns=py.globals.get('dict')();let err=null,tres=null;",
"  try{",
"    await py.runPythonAsync(code,{globals:ns});",
"    if(tests){ns.set('_TESTS_JSON',JSON.stringify(tests));ns.set('_FN',fn);await py.runPythonAsync(HARNESS,{globals:ns});tres=JSON.parse(ns.get('_RESULT'))}",
"  }catch(x){err=String(x.message||x)}",
"  try{ns.destroy()}catch(_){}",
"  postMessage({id,out:buf,err,tres});",
"};"].join('\n');
let W=null,wReady=null,runId=0,pending=null,runTimer=null;
const RUN_LIMIT=10;
function getWorker(){
  if(wReady)return wReady;
  wReady=new Promise((res,rej)=>{
    try{W=new Worker(URL.createObjectURL(new Blob([WSRC],{type:'text/javascript'})))}catch(e){rej(e);return}
    W.onmessage=e=>{const d=e.data;if(d.ready)res();else if(d.fatal)rej(new Error(d.fatal));else onResult(d)};
    W.onerror=ev=>{rej(ev);if(pending)finishError('The Python worker crashed. Press Run to start a fresh one.')};
  });
  wReady.catch(()=>{killWorker()});
  return wReady;
}
function killWorker(){if(W){try{W.terminate()}catch(_){}}W=null;wReady=null}
function runUI(busy){$('run').disabled=busy;$('stop').hidden=!busy;$('reset').disabled=busy}
function finishError(msg){clearTimeout(runTimer);pending=null;runUI(false);$('out').textContent=msg}
function stopRun(reason){
  if(!pending&&reason!=='load')return;
  clearTimeout(runTimer);const p=pending;pending=null;runId++;killWorker();
  if(p&&p.kind==='ide')return ideStopped(reason);
  runUI(false);ideUI(false);
  const ex=$('explain'),v=$('verdict');
  if(reason==='timeout'){v.className='verdict bad';v.textContent=`Stopped after ${RUN_LIMIT} seconds.`;
    ex.innerHTML=`<h3>Your code didn't finish</h3><p>It ran for ${RUN_LIMIT} seconds, which usually means an infinite loop. Check that every <code>while</code> condition can become False and that loop variables actually change inside the loop. Also look for recursion without a base case.</p>`;ex.hidden=false;
    $('out').textContent='(stopped)'}
  else{v.className='verdict';v.textContent='Stopped.';$('out').textContent='(stopped by you)'}
}
$('stop').addEventListener('click',()=>stopRun(pending?'user':'load'));
$('run').addEventListener('click',async()=>{
  if(pending)return;
  const drill=cur,code=$('ed').value,id=++runId;
  const out=$('out'),v=$('verdict'),ex=$('explain');v.textContent='';v.className='verdict';ex.hidden=true;runUI(true);
  out.textContent=wReady?'Running…':'Loading Python… (first run only, about 10 MB)';
  try{await getWorker()}catch(e){if(id===runId){runUI(false);out.textContent='Could not load the Python runtime. Check your connection and try again.'}return}
  if(id!==runId)return;
  out.textContent='Running…';
  pending={id,drill,code};
  W.postMessage({id,code,fn:drill.fn||null,tests:drill.tests||null});
  runTimer=setTimeout(()=>stopRun('timeout'),RUN_LIMIT*1000);
});
function onResult(d){
  if(!pending||d.id!==pending.id)return;
  if(pending.kind==='ide')return onIdeResult(d);
  clearTimeout(runTimer);const {drill,code}=pending;pending=null;runUI(false);
  const errMsg=d.err,tres=d.tres,buf=d.out||'';
  let ok=false;
  if(drill.tests)ok=!errMsg&&!!tres&&tres.every(t=>t[3]);
  else if(drill.exp){const norm=x=>x.trim().split('\n').map(l=>l.trimEnd()).join('\n');ok=!errMsg&&norm(buf)===drill.exp}
  if(ok)recordSolve(drill);
  let imMsg='';logCount('drun');
  if(ok&&S.imode&&imT0&&drill===cur&&drill.id!=='free'){const sec=Math.max(1,Math.round((Date.now()-imT0)/1000));S.times=S.times||{};(S.times[drill.id]=S.times[drill.id]||[]).push({d:day(),s:sec});S.times[drill.id]=S.times[drill.id].slice(-20);save();imT0=null;imShow();imMsg=` · ${fmtT(sec)} in interview mode`}
  if(ok)logItem('drill',`Solved “${drill.name}”${imMsg?' — '+imMsg.replace(/^ · /,''):''}`);
  if(drill!==cur)return;               // you switched drills: result recorded, UI left alone
  const out=$('out'),v=$('verdict'),ex=$('explain');
  out.textContent=(buf+(errMsg?errMsg.trim().split('\n').pop():'')).trimEnd()||(tres?'(tests ran — see results below)':'(no output)');
  const sol=SOL[drill.id]&&!S.imode?`<button class="btn ghost sm" data-showsol="${drill.id}">Stuck? Full solution walkthrough</button>`:'';
  if(errMsg){ex.innerHTML=explainError(errMsg,code)+sol;ex.hidden=false}
  if(drill.tests&&!errMsg&&tres){
    const pass=tres.filter(t=>t[3]).length;
    v.className='verdict '+(ok?'ok':'bad');v.textContent=ok?`All ${tres.length} tests passed!${S.solo&&S.solo['ch_'+drill.id]?' Solved without help.':''}${imMsg}`:`${pass} of ${tres.length} tests passed — see which failed below.`;
    if(!ok){ex.innerHTML=explainTests(tres,drill.fn)+sol;ex.hidden=false}
  }
  if(drill.tests&&errMsg){v.className='verdict bad';v.textContent='Your code stopped with an error before the tests ran — see why below.'}
  if(drill.exp){
    v.className='verdict '+(ok?'ok':'bad');v.textContent=ok?`Solved!${S.solo&&S.solo['ch_'+drill.id]?' Solved without help.':''}${imMsg}`:errMsg?'Your code stopped with an error — see why below.':'Not yet — see what differs below.';
    if(!ok&&!errMsg){ex.innerHTML=explainDiff(buf,drill.exp)+sol;ex.hidden=false}
  }
}
function recordSolve(drill){
  mark('code');const k='ch_'+drill.id;S.solo=S.solo||{};S.dhelp=S.dhelp||{};
  if(!S.done[k]){S.done[k]=true;S.xp+=5;if(!S.dhelp[drill.id])S.solo[k]=true;bump()}
  save();head();const b=document.querySelector(`[data-c="${drill.id}"]`);if(b&&!b.textContent.startsWith('✓'))b.textContent='✓ '+b.textContent;
}

document.querySelector('.trackbar').addEventListener('scroll',e=>{const b=e.currentTarget;b.classList.toggle('end',b.scrollLeft+b.clientWidth>=b.scrollWidth-4)},{passive:true});
/* ---------- file saving (artifact downloads capability, plain download elsewhere) ---------- */
async function saveFile(filename,data){
  let dl=null;try{if(window.claude&&typeof window.claude.use==='function')dl=await window.claude.use('downloads')}catch(_){}
  if(dl){try{await dl.save({filename,data});return'saved'}catch(e){const c=e&&e.code;if(c==='declined')return'declined';if(c==='rate_limited')return'busy';if(!['unavailable','not_granted','capability_disabled','capability_removed'].includes(c))return'error'}}
  const blob=data instanceof Blob?data:new Blob([data]),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);return'saved';
}
const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRCT[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zipFiles(files){
  const enc=new TextEncoder(),parts=[],cen=[];let off=0;
  const d=new Date(),dt=((d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1)),dd=(((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate());
  for(const [name,text] of Object.entries(files)){
    const nb=enc.encode(name),db=enc.encode(text),crc=crc32(db),lh=new DataView(new ArrayBuffer(30));
    [[0,0x04034b50,4],[4,20,2],[6,0x0800,2],[8,0,2],[10,dt,2],[12,dd,2],[14,crc,4],[18,db.length,4],[22,db.length,4],[26,nb.length,2],[28,0,2]].forEach(([o,v,s])=>s===4?lh.setUint32(o,v,true):lh.setUint16(o,v,true));
    const ch=new DataView(new ArrayBuffer(46));
    [[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x0800,2],[10,0,2],[12,dt,2],[14,dd,2],[16,crc,4],[20,db.length,4],[24,db.length,4],[28,nb.length,2],[30,0,2],[32,0,2],[34,0,2],[36,0,2],[38,0,4],[42,off,4]].forEach(([o,v,s])=>s===4?ch.setUint32(o,v,true):ch.setUint16(o,v,true));
    parts.push(lh,nb,db);cen.push(ch,nb);off+=30+nb.length+db.length;
  }
  const csize=cen.reduce((a,x)=>a+x.byteLength,0),n=Object.keys(files).length,end=new DataView(new ArrayBuffer(22));
  [[0,0x06054b50,4],[4,0,2],[6,0,2],[8,n,2],[10,n,2],[12,csize,4],[16,off,4],[20,0,2]].forEach(([o,v,s])=>s===4?end.setUint32(o,v,true):end.setUint16(o,v,true));
  return new Blob([...parts,...cen,end],{type:'application/zip'});
}
/* ---------- IDE: multi-file Python workspace ---------- */
const IDE_LIMIT=15;
const IDE_DEFAULT={active:'main.py',stdin:'Sri Charan\n',args:'',files:{
'main.py':"# Welcome to the CodeTrail IDE.\n# Files here can import each other, and open() can read them.\nfrom utils import parse_line, summarize\n\nname = input(\"Your name: \")  # reads the Input box below\nwith open(\"access.log\") as f:\n    rows = [parse_line(line) for line in f if line.strip()]\n\nprint(f\"\\nHi {name} - parsed {len(rows)} requests\")\nfor status, count in summarize(rows):\n    print(f\"{status}: {count}\")\n",
'utils.py':"from collections import Counter\n\n\ndef parse_line(line):\n    \"\"\"'10.0.0.1 GET /api 200' -> {'ip': '10.0.0.1', 'status': 200}\"\"\"\n    ip, method, path, status = line.split()\n    return {\"ip\": ip, \"status\": int(status)}\n\n\ndef summarize(rows):\n    \"\"\"Status codes, most common first.\"\"\"\n    return Counter(r[\"status\"] for r in rows).most_common()\n",
'access.log':"10.0.0.1 GET /api 200\n10.0.0.2 GET /api 500\n10.0.0.1 POST /login 200\n10.0.0.3 GET /health 200\n10.0.0.2 GET /api 503\n10.0.0.4 GET /api 200\n",
'test_utils.py':"import pytest\nfrom utils import parse_line, summarize\n\n\ndef test_parse_line():\n    assert parse_line(\"1.2.3.4 GET / 404\") == {\"ip\": \"1.2.3.4\", \"status\": 404}\n\n\n@pytest.mark.parametrize(\"codes, top\", [([200, 200, 500], 200), ([503, 503, 200], 503)])\ndef test_summarize_top(codes, top):\n    rows = [{\"ip\": \"x\", \"status\": c} for c in codes]\n    assert summarize(rows)[0][0] == top\n\n\ndef test_bad_line():\n    with pytest.raises(ValueError):\n        parse_line(\"not a log line\")\n"}};
const IDE_TPL=[
['Log parser','log_parser.py',"import re\nfrom collections import Counter\n\nLOG = \"\"\"2026-11-21T10:00:01 ERROR svc=api code=E503 took=812ms\n2026-11-21T10:00:02 INFO  svc=web code=OK   took=40ms\n2026-11-21T10:00:05 ERROR svc=db  code=E500 took=1203ms\n2026-11-21T10:00:09 ERROR svc=api code=E503 took=950ms\"\"\"\n\npat = re.compile(r\"(?P<level>\\w+)\\s+svc=(?P<svc>\\w+)\\s+code=(?P<code>\\w+)\\s+took=(?P<ms>\\d+)ms\")\nerrors = Counter()\nslow = []\nfor line in LOG.splitlines():\n    m = pat.search(line)\n    if not m:\n        continue\n    if m[\"level\"] == \"ERROR\":\n        errors[(m[\"svc\"], m[\"code\"])] += 1\n    if int(m[\"ms\"]) > 900:\n        slow.append(line)\n\nfor (svc, code), n in errors.most_common():\n    print(f\"{svc:4} {code}: {n}\")\nprint(\"slow:\", len(slow))\n"],
['CLI with argparse','cli.py',"# Put arguments in the Arguments box, e.g.:  --env prod --dry-run web1 web2\nimport argparse\n\np = argparse.ArgumentParser(description=\"Restart services safely\")\np.add_argument(\"hosts\", nargs=\"+\")\np.add_argument(\"--env\", choices=[\"dev\", \"prod\"], default=\"dev\")\np.add_argument(\"--dry-run\", action=\"store_true\")\nargs = p.parse_args()\n\nfor h in args.hosts:\n    action = \"would restart\" if args.dry_run else \"restarting\"\n    print(f\"[{args.env}] {action} {h}\")\n"],
['Retry with backoff','retry.py',"import random, time\n\ncalls = 0\ndef flaky():\n    global calls\n    calls += 1\n    if calls < 3:\n        raise ConnectionError(f\"attempt {calls} failed\")\n    return \"ok\"\n\ndef retry(fn, attempts=5, base=0.05):\n    for i in range(attempts):\n        try:\n            return fn()\n        except ConnectionError as e:\n            if i == attempts - 1:\n                raise\n            wait = base * 2 ** i * random.uniform(0.5, 1.5)  # backoff + jitter\n            print(f\"{e}; retrying in {wait:.2f}s\")\n            time.sleep(wait)\n\nprint(retry(flaky))\n"],
['JSON API response','api_json.py',"import json\n\nresp = '''{\"items\": [\n  {\"name\": \"web-1\", \"state\": \"running\", \"cpu\": 71},\n  {\"name\": \"web-2\", \"state\": \"stopped\", \"cpu\": 0},\n  {\"name\": \"db-1\",  \"state\": \"running\", \"cpu\": 93}\n], \"next\": null}'''\n\ndata = json.loads(resp)\nhot = [i[\"name\"] for i in data[\"items\"] if i[\"state\"] == \"running\" and i.get(\"cpu\", 0) > 80]\nprint(\"hot:\", hot)\nprint(\"more pages:\", data.get(\"next\") is not None)\n"],
['SQLite queries','sqlite_demo.py',"import sqlite3\n\ndb = sqlite3.connect(\":memory:\")\ndb.executescript(\"\"\"\nCREATE TABLE runs(test TEXT, ok INT, ts INT);\nINSERT INTO runs VALUES ('login',1,1),('login',0,2),('login',0,3),('cart',1,1),('cart',1,2);\n\"\"\")\nq = \"\"\"SELECT test, SUM(ok = 0) AS fails, COUNT(*) AS runs\n       FROM runs GROUP BY test HAVING fails > 0 ORDER BY fails DESC\"\"\"\nfor row in db.execute(q):\n    print(row)\n"],
['LRU cache class','lru.py',"from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap, self.d = cap, OrderedDict()\n    def get(self, k):\n        if k not in self.d:\n            return None\n        self.d.move_to_end(k)\n        return self.d[k]\n    def put(self, k, v):\n        self.d[k] = v\n        self.d.move_to_end(k)\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)\n\nc = LRU(2)\nc.put(\"a\", 1); c.put(\"b\", 2); c.get(\"a\"); c.put(\"c\", 3)\nprint(list(c.d))  # b was least recently used\n"],
['pytest-style tests','test_example.py',"import pytest\n\ndef slugify(s):\n    return \"-\".join(s.lower().split())\n\n@pytest.mark.parametrize(\"raw, want\", [(\"Hello World\", \"hello-world\"), (\"  CI  CD \", \"ci-cd\")])\ndef test_slugify(raw, want):\n    assert slugify(raw) == want\n\ndef test_type_error():\n    with pytest.raises(AttributeError):\n        slugify(None)\n"]];
let ideDelArm=false;
function ideState(){if(!S.ide||!S.ide.files||!Object.keys(S.ide.files).length)S.ide=JSON.parse(JSON.stringify(IDE_DEFAULT));if(S.ide.files[S.ide.active]==null)S.ide.active=Object.keys(S.ide.files)[0];return S.ide}
const PYKW=new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
const PYBI=new Set('print len range enumerate zip dict list set tuple str int float bool open input sorted reversed sum min max abs any all map filter isinstance type super object self Exception ValueError KeyError TypeError IndexError'.split(' '));
function hlPy(src){
  const re=/(#[^\n]*)|([rRbBfFuU]{0,2}(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(@[\w.]+)|([A-Za-z_]\w*)/g;
  let out='',last=0,m,prev='';
  while((m=re.exec(src))){
    out+=esc(src.slice(last,m.index));last=re.lastIndex;const t=esc(m[0]);
    if(m[1])out+='<i class="hc">'+t+'</i>';
    else if(m[2])out+='<i class="hs">'+t+'</i>';
    else if(m[3])out+='<i class="hn">'+t+'</i>';
    else if(m[4])out+='<i class="hd">'+t+'</i>';
    else{const w=m[5];out+=PYKW.has(w)?'<i class="hk">'+t+'</i>':(prev==='def'||prev==='class')?'<i class="hf">'+t+'</i>':PYBI.has(w)?'<i class="hb">'+t+'</i>':t;prev=w;continue}
    prev='';
  }
  return out+esc(src.slice(last));
}
function ideSync(){
  const st=ideState(),ta=$('ide'),v=ta.value;st.files[st.active]=v;
  $('ideHl').innerHTML=(st.active.endsWith('.py')?hlPy(v):esc(v))+'\n ';
  const n=v.split('\n').length;let g='';for(let i=1;i<=n;i++)g+=i+'\n';$('ideGut').textContent=g;
  ideScroll();clearTimeout(ideSync.t);ideSync.t=setTimeout(save,400);
}
function ideScroll(){const ta=$('ide');$('ideHl').scrollTop=ta.scrollTop;$('ideHl').scrollLeft=ta.scrollLeft;$('ideGut').scrollTop=ta.scrollTop}
function renderIde(){
  const st=ideState();
  $('ftabs').innerHTML=Object.keys(st.files).map(f=>`<button data-file="${esc(f)}" aria-pressed="${f===st.active}">${esc(f)}</button>`).join('');
  $('ide').value=st.files[st.active];$('ideIn').value=st.stdin||'';$('ideArgs').value=st.args||'';
  const py=st.active.endsWith('.py');$('ideRun').textContent='▶ Run '+(py?st.active:'main.py');
  ideDelArm=false;$('ideDel').textContent='Delete';$('ideForm').hidden=true;$('ideTpl').hidden=true;ideSync();
}
function ideIns(text,a,b){const ta=$('ide');ta.focus();ta.setSelectionRange(a,b);let ok=false;try{ok=document.execCommand('insertText',false,text)}catch(_){}if(!ok)ta.setRangeText(text,a,b,'end');ideSync()}
function ideLines(fn){
  const ta=$('ide'),v=ta.value,a=ta.selectionStart,b=ta.selectionEnd;
  const ls=v.lastIndexOf('\n',a-1)+1,le=(i=>i<0?v.length:i)(v.indexOf('\n',b>a&&v[b-1]==='\n'?b-1:b));
  const block=v.slice(ls,le),nb=block.split('\n').map(fn).join('\n');
  ideIns(nb,ls,le);ta.setSelectionRange(ls,ls+nb.length);
}
function ideTab(shift){const ta=$('ide'),a=ta.selectionStart,b=ta.selectionEnd,v=ta.value;
  if(!shift&&a===b){ideIns('    ',a,b);return}
  ideLines(l=>shift?l.replace(/^ {1,4}/,''):'    '+l);
}
const PAIRS={'(':')','[':']','{':'}'};
function ideKey(e){
  const ta=$('ide'),a=ta.selectionStart,b=ta.selectionEnd,v=ta.value;
  if((e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();ideRun('run');return}
  if((e.metaKey||e.ctrlKey)&&e.key==='/'){e.preventDefault();const ls=v.lastIndexOf('\n',a-1)+1,le=(i=>i<0?v.length:i)(v.indexOf('\n',b));const lines=v.slice(ls,le).split('\n'),all=lines.every(l=>!l.trim()||/^\s*#/.test(l));ideLines(l=>!l.trim()?l:all?l.replace(/^(\s*)# ?/,'$1'):l.replace(/^(\s*)/,'$1# '));return}
  if(e.key==='Tab'){e.preventDefault();ideTab(e.shiftKey);return}
  if(e.key==='Enter'&&!e.shiftKey&&!e.altKey){e.preventDefault();const ls=v.lastIndexOf('\n',a-1)+1,line=v.slice(ls,a),ind=(line.match(/^ */)||[''])[0];
    const ni=/:\s*(#.*)?$/.test(line)?ind+'    ':/^\s*(return|pass|break|continue|raise)\b/.test(line)?ind.slice(4):ind;ideIns('\n'+ni,a,b);return}
  if(e.key==='Backspace'&&a===b&&a>0){const ls=v.lastIndexOf('\n',a-1)+1,before=v.slice(ls,a);if(before.length&&/^ +$/.test(before)){e.preventDefault();const k=before.length%4||4;ideIns('',a-k,a);return}
    if(PAIRS[v[a-1]]&&v[a]===PAIRS[v[a-1]]){e.preventDefault();ideIns('',a-1,a+1);return}}
  if(PAIRS[e.key]&&a===b&&(!v[a]||/[\s)\]},:]/.test(v[a]))){e.preventDefault();ideIns(e.key+PAIRS[e.key],a,b);ta.setSelectionRange(a+1,a+1);return}
  if(/^[)\]}]$/.test(e.key)&&a===b&&v[a]===e.key){e.preventDefault();ta.setSelectionRange(a+1,a+1);return}
}
function ideGoto(file,ln){
  const st=ideState();if(st.files[file]==null)return;st.active=file;renderIde();
  const ta=$('ide'),ls=ta.value.split('\n');let p=0;for(let i=0;i<ln-1&&i<ls.length;i++)p+=ls[i].length+1;
  ta.focus();ta.setSelectionRange(p,p+(ls[ln-1]||'').length);const lh=parseFloat(getComputedStyle(ta).lineHeight)||24;ta.scrollTop=Math.max(0,(ln-4)*lh);ideScroll();
}
function ideUI(busy){$('ideRun').disabled=busy;$('ideTest').disabled=busy;$('ideStop').hidden=!busy}
async function ideRun(mode){
  if(pending)return;
  const st=ideState();ideSync();
  const entry=st.active.endsWith('.py')?st.active:(st.files['main.py']!=null?'main.py':Object.keys(st.files).find(f=>f.endsWith('.py')));
  if(!entry){$('ideOut').textContent='Add a .py file first.';return}
  if(mode==='tests'&&!Object.keys(st.files).some(f=>/(^|\/)test_.*\.py$|_test\.py$/.test(f))){$('ideOut').textContent='No test files yet. Name a file test_something.py and write functions starting with test_.';return}
  const id=++runId;mark('code');
  $('ideVerdict').className='verdict';$('ideVerdict').textContent='';$('ideExplain').hidden=true;ideUI(true);
  $('ideOut').textContent=wReady?'Running…':'Loading Python… (first run only, about 10 MB)';
  try{await getWorker()}catch(e){if(id===runId){ideUI(false);$('ideOut').textContent='Could not load the Python runtime. Check your connection and try again.'}return}
  if(id!==runId)return;
  $('ideOut').textContent='Running…';
  const args=(st.args||'').match(/"[^"]*"|'[^']*'|\S+/g)||[];
  pending={id,kind:'ide',mode,entry};
  W.postMessage({id,ide:{files:st.files,entry,mode,stdin:st.stdin||'',args:args.map(x=>x.replace(/^["']|["']$/g,''))}});
  runTimer=setTimeout(()=>stopRun('timeout'),IDE_LIMIT*1000);
}
function ideErrHTML(tb){
  const last=tb.trim().split('\n').pop(),type=(last.match(/^(\w+)/)||[])[1]||'Error';
  const fr=[...tb.matchAll(/File "\/tmp\/ct_ws\/([^"]+)", line (\d+)/g)],f=fr.length?fr[fr.length-1]:null;
  return`<h3>${esc(type)}${f?` in ${esc(f[1])}, line ${f[2]}`:''}</h3><p>${esc(ERR[type]||'Read the last line of the traceback: it names the problem; the line above it shows where.')}</p><p class="note" style="margin:0 0 8px">Python said: ${esc(last)}</p>${f?`<button class="btn ghost sm" data-goto="${esc(f[1])}:${f[2]}">Go to ${esc(f[1])} line ${f[2]}</button>`:''}`;
}
function onIdeResult(d){
  clearTimeout(runTimer);const {mode}=pending;pending=null;ideUI(false);logCount('ide');
  const st=ideState(),r=d.ide,v=$('ideVerdict'),ex=$('ideExplain');
  let out=(d.out||'').replace(/\n$/,'');
  if(d.err){out+=(out?'\n':'')+d.err.trim();v.className='verdict bad';v.textContent='The runner hit an internal error.';$('ideOut').textContent=out;return}
  const tb=r&&r.err?r.err.trim():'';
  if(tb)out+=(out?'\n\n':'')+tb.split('\n').filter(l=>!/^\s*~*\^+~*\s*$/.test(l)).join('\n');
  $('ideOut').textContent=out||(mode==='tests'?'(no output)':'(no output — use print() to show values)');
  const changed=r&&r.changed?Object.keys(r.changed):[];
  changed.forEach(f=>{st.files[f]=r.changed[f]});
  const note=changed.length?`<p class="note" style="margin:8px 0 0">Your program wrote ${changed.map(esc).join(', ')} — ${changed.length>1?'they are':'it is'} now in the file tabs.</p>`:'';
  if(changed.length){$('ftabs').innerHTML=Object.keys(st.files).map(f=>`<button data-file="${esc(f)}" aria-pressed="${f===st.active}">${esc(f)}</button>`).join('');save()}
  if(mode==='tests'&&r&&r.tests){
    const t=r.tests,p=t.filter(x=>x[2]).length,fl=t.length-p;
    v.className='verdict '+(fl||tb?'bad':'ok');v.textContent=tb?'Tests stopped with an error.':`${p} passed${fl?`, ${fl} failed`:''} · ${r.ms} ms`;
    ex.innerHTML=`<h3>Test results</h3><ul style="list-style:none;padding:0">${t.map(([f,n,ok,e])=>`<li style="margin-bottom:8px">${ok?'✓':'✗'} <code>${esc(f)}::${esc(n)}</code>${ok?'':`<br><span>${esc(e[0])}</span>${e[1]?` <button class="btn ghost sm" data-goto="${esc(e[1])}" style="min-height:34px;padding:4px 10px;margin-top:4px">Go to ${esc(e[1])}</button>`:''}`}</li>`).join('')}</ul>${tb?ideErrHTML(tb):''}${note}`;ex.hidden=false;
    if(!fl&&!tb&&t.length){S.ideTests=(S.ideTests||0)+1;logCount('idet');save()}
    return;
  }
  if(tb){v.className='verdict bad';v.textContent=`Stopped with an error after ${r.ms} ms.`;ex.innerHTML=ideErrHTML(tb)+note;ex.hidden=false}
  else{v.className='verdict ok';v.textContent=`Finished in ${r.ms} ms.`;if(note){ex.innerHTML=note;ex.hidden=false}}
}
function ideStopped(reason){
  ideUI(false);const v=$('ideVerdict');
  if(reason==='timeout'){v.className='verdict bad';v.textContent=`Stopped after ${IDE_LIMIT} seconds.`;$('ideExplain').innerHTML=`<h3>Your program didn't finish</h3><p>Usually an infinite loop, or input() waiting for more lines than the Input box has. Check while conditions, and add one line to Input per input() call.</p>`;$('ideExplain').hidden=false}
  else{v.className='verdict';v.textContent='Stopped.'}
  $('ideOut').textContent+='\n(stopped)';
}
function ideName(n){n=(n||'').trim().replace(/\\/g,'/').replace(/^\/+/,'');return /^[\w.\-\/]{1,60}$/.test(n)&&!n.includes('..')?n:null}
function ideUnique(n){const st=ideState();if(!st.files[n])return n;const m=n.match(/^(.*?)(\.[^.]*)?$/);for(let i=2;;i++){const c=m[1]+'_'+i+(m[2]||'');if(!st.files[c])return c}}
let ideFormMode=null;
function ideForm(mode){ideFormMode=mode;const st=ideState();$('ideForm').hidden=false;$('ideTpl').hidden=true;$('ideNameLab').textContent=mode==='new'?'New file name':'Rename '+st.active+' to';$('ideName').value=mode==='new'?'':st.active;$('ideName').focus();$('ideFormMsg').textContent=''}
function ideFormSave(){
  const st=ideState(),n=ideName($('ideName').value);
  if(!n){$('ideFormMsg').textContent='Use letters, numbers, _ - . or / (for folders), e.g. helpers.py';return}
  if(ideFormMode==='new'){if(st.files[n]!=null){$('ideFormMsg').textContent='That file already exists.';return}st.files[n]=n.endsWith('.py')?'':'';st.active=n}
  else if(n!==st.active){if(st.files[n]!=null){$('ideFormMsg').textContent='That name is taken.';return}const t=st.files[st.active];delete st.files[st.active];st.files[n]=t;st.active=n}
  save();renderIde();$('ide').focus();
}
async function ideDownload(){ideSync();const r=await saveFile(`codetrail-ide-${day()}.zip`,zipFiles(ideState().files));$('ideVerdict').className='verdict';$('ideVerdict').textContent=r==='saved'?'Workspace saved as a .zip.':r==='declined'?'Download cancelled.':r==='busy'?'A save prompt is already open.':'Download is not available here.'}
function ideInit(){
  const ta=$('ide');
  $('ideKeys').innerHTML=[['tab','⇥'],['untab','⇤'],[':',':'],['(','('],[')',')'],['[','['],[']',']'],['{','{'],['}','}'],['"','"'],["'","'"],['=','='],['_','_'],['.','.'],[',',','],['#','#'],['left','←'],['right','→']].map(([k,l])=>`<button data-k="${esc(k)}" tabindex="-1" aria-label="${k==='tab'?'Indent':k==='untab'?'Unindent':k==='left'?'Cursor left':k==='right'?'Cursor right':esc(k)}">${esc(l)}</button>`).join('');
  ta.addEventListener('input',ideSync);ta.addEventListener('scroll',ideScroll);ta.addEventListener('keydown',ideKey);
  $('ftabs').addEventListener('click',e=>{const b=e.target.closest('[data-file]');if(b){ideSync();ideState().active=b.dataset.file;save();renderIde()}});
  $('ideRun').addEventListener('click',()=>ideRun('run'));$('ideTest').addEventListener('click',()=>ideRun('tests'));
  $('ideStop').addEventListener('click',()=>stopRun(pending?'user':'load'));
  $('ideIn').addEventListener('input',e=>{ideState().stdin=e.target.value;save()});$('ideArgs').addEventListener('input',e=>{ideState().args=e.target.value;save()});
  $('ideNew').addEventListener('click',()=>ideForm('new'));$('ideRen').addEventListener('click',()=>ideForm('rename'));
  $('ideFormOk').addEventListener('click',ideFormSave);$('ideFormNo').addEventListener('click',()=>{$('ideForm').hidden=true});
  $('ideName').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ideFormSave()}});
  $('ideDel').addEventListener('click',e=>{const st=ideState();if(Object.keys(st.files).length<2){$('ideDel').textContent='Keep at least one file';return}
    if(!ideDelArm){ideDelArm=true;e.target.textContent='Tap again to delete '+st.active;setTimeout(()=>{ideDelArm=false;e.target.textContent='Delete'},3000);return}
    delete st.files[st.active];st.active=Object.keys(st.files)[0];save();renderIde()});
  $('ideDl').addEventListener('click',ideDownload);
  $('ideTplBtn').addEventListener('click',()=>{$('ideForm').hidden=true;const t=$('ideTpl');t.hidden=!t.hidden;t.innerHTML=IDE_TPL.map(([n,f],i)=>`<button class="btn ghost sm" data-tpl="${i}">${esc(n)} <span class="note">· ${esc(f)}</span></button>`).join('')});
  $('ideTpl').addEventListener('click',e=>{const b=e.target.closest('[data-tpl]');if(!b)return;const [,f,code]=IDE_TPL[+b.dataset.tpl],st=ideState(),n=ideUnique(f);st.files[n]=code;st.active=n;save();renderIde()});
  $('ideReset').addEventListener('click',e=>{if(e.target.dataset.arm!=='1'){e.target.dataset.arm='1';e.target.textContent='Tap again — replaces all files';setTimeout(()=>{e.target.dataset.arm='';e.target.textContent='Reset workspace'},3000);return}S.ide=null;save();renderIde()});
  $('ideKeys').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-k]');if(!b)return;e.preventDefault();const k=b.dataset.k,ta=$('ide'),a=ta.selectionStart,z=ta.selectionEnd;
    if(k==='tab')ideTab(false);else if(k==='untab')ideTab(true);else if(k==='left'){ta.focus();ta.setSelectionRange(Math.max(0,a-1),Math.max(0,a-1))}else if(k==='right'){ta.focus();ta.setSelectionRange(z+1,z+1)}
    else if(k==='run')ideRun('run');else ideIns(k,a,z)});
  $('ideUI').addEventListener('click',e=>{const g=e.target.closest('[data-goto]');if(g){const m=g.dataset.goto.match(/^(.*):(\d+)$/);if(m)ideGoto(m[1],+m[2])}});
}

ideInit();
/* ---------- Time tracking: only active learning counts ---------- */
const KIND={lesson:'Lessons',quiz:'Quick drills',cards:'Q&A cards',mock:'Mock interviews',drill:'Code drills',ide:'IDE',sim:'Incidents',stories:'Stories',focus:'Focus timer'};
const IDLE_MS=90000;
let actAt=0,actK=null,lastTick=Date.now();
const logDay=(d=day())=>{S.log=S.log||{};const g=S.log[d]=S.log[d]||{};g.sec=g.sec||{};g.items=g.items||[];g.n=g.n||{};return g};
const daySec=d=>{const g=S.log&&S.log[d];return g&&g.sec?Object.values(g.sec).reduce((a,b)=>a+b,0):0};
const goalMin=()=>S.goalMin||30;
const hhmm=()=>new Date().toTimeString().slice(0,5);
function logItem(kind,text){const g=logDay();g.items.push([hhmm(),kind,text]);if(g.items.length>120)g.items.shift();save()}
function logCount(key){const g=logDay();g.n[key]=(g.n[key]||0)+1;save()}
function ctxKind(){
  if(L)return L.l.id==='quick'?'quiz':'lesson';
  if(!$('v-qa').hidden)return mock?'mock':'cards';
  if(!$('v-play').hidden)return !$('ideUI').hidden?'ide':!$('simUI').hidden?'sim':'drill';
  if(!$('v-roles').hidden&&rv==='stories')return 'stories';
  return null;
}
['pointerdown','keydown','input'].forEach(ev=>document.addEventListener(ev,()=>{const k=ctxKind();if(k){actAt=Date.now();actK=k}},{passive:true,capture:true}));
$('stage').addEventListener('scroll',()=>{if(L){actAt=Date.now();actK=ctxKind()}},{passive:true});
setInterval(()=>{
  const now=Date.now(),dt=Math.min(now-lastTick,10000);lastTick=now;
  if(S.focus&&S.focus.run){focusShow();return}          // the focus timer is counting instead
  const busy=pending&&document.visibilityState==='visible'; // waiting on your own code run counts
  if(!busy&&(document.visibilityState!=='visible'||!actK||now-actAt>IDLE_MS||ctxKind()!==actK))return;
  const k=busy?(pending.kind==='ide'?'ide':'drill'):actK,g=logDay();
  g.sec[k]=(g.sec[k]||0)+dt/1000;today().min=daySec(day())/60;save();updMin();
},5000);
function updMin(){
  const m=Math.floor(daySec(day())/60),G=goalMin(),el=$('minTxt'),bar=$('minBar'),rg=$('minRing');
  if(el)el.textContent=m>=G?`Goal met — ${m} min today`:`${G-m} min to today's goal`;if(bar)bar.style.width=Math.min(100,m/G*100)+'%';
  if(rg){rg.style.setProperty('--p',Math.min(100,Math.round(m/G*100)));rg.classList.toggle('done',m>=G);$('minNum').textContent=m}
  const ws=$('weekStrip');if(ws)ws.innerHTML=weekHTML();
}

/* ---------- Focus timer: for study outside the app (docs, labs, courses, mocks) ---------- */
const FOCUS_MAX=3*3600;
const focusSec=()=>{const f=S.focus;if(!f)return 0;return Math.min(FOCUS_MAX,(f.acc||0)+(f.run?(Date.now()-f.start)/1000:0))};
const fmtHM=s=>{s=Math.floor(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')};
function focusShow(){
  const c=$('focusChip'),f=S.focus;if(!c)return;
  c.classList.toggle('on',!!(f&&f.run));c.classList.toggle('paused',!!(f&&!f.run));
  $('focusTxt').textContent=f?fmtHM(focusSec()):'Focus';
  if(f&&f.run&&focusSec()>=FOCUS_MAX){f.acc=FOCUS_MAX;f.run=false;save();focusSheet(true)}
}
function focusSheet(capped){
  const f=S.focus,sh=$('focusSheet');
  if(!f){sh.hidden=true;return}
  sh.hidden=false;
  sh.innerHTML=`<div class="sheet"><h3 style="margin:0 0 4px">Focus timer · ${fmtHM(focusSec())}</h3><p class="note" style="margin:0 0 12px">${capped?'Stopped automatically at 3 hours. ':''}Use this for study outside the app. While it runs, in-app time isn't double-counted.</p>
   <div class="btnrow" style="margin-bottom:12px">${f.run?`<button class="btn ghost sm" data-fx="pause">Pause</button>`:`<button class="btn ghost sm" data-fx="resume">Resume</button>`}<button class="btn ghost sm" data-fx="discard">Discard</button><button class="btn ghost sm" data-fx="close">Keep going</button></div>
   <label>What did you work on?</label><div class="chips" id="fxKind">${['Reading / course','Hands-on lab','Mock interview','Applications & networking','Revision','Other'].map((x,i)=>`<button data-fk="${esc(x)}" aria-pressed="${(f.kind||'Reading / course')===x}">${esc(x)}</button>`).join('')}</div>
   <label for="fxNote">Note (optional)</label><input id="fxNote" value="${esc(f.note||'')}" placeholder="e.g. KodeKloud CKA lab: etcd backup">
   <div class="row"><button class="btn" data-fx="save">Stop &amp; log ${Math.round(focusSec()/60)} min</button></div></div>`;
}
function focusSave(){
  const f=S.focus;if(!f)return;const sec=focusSec(),day0=f.d||day();
  if(sec>=30){const g=logDay(day0);g.sec.focus=(g.sec.focus||0)+sec;g.items.push([f.t||hhmm(),'focus',`${Math.round(sec/60)} min · ${f.kind||'Reading / course'}${f.note?': '+f.note:''}`]);bump()}
  S.focus=null;save();$('focusSheet').hidden=true;focusShow();updMin();head();if(!$('v-me').hidden)renderMe();
}
function focusInit(){
  $('focusChip').addEventListener('click',()=>{
    if(!S.focus){S.focus={run:true,start:Date.now(),acc:0,d:day(),t:hhmm()};save();focusShow();return}
    focusSheet(false);
  });
  $('focusSheet').addEventListener('click',e=>{
    if(e.target.id==='focusSheet'){$('focusSheet').hidden=true;return}
    const fk=e.target.closest('[data-fk]');if(fk){S.focus.kind=fk.dataset.fk;S.focus.note=$('fxNote').value;save();focusSheet(false);return}
    const b=e.target.closest('[data-fx]');if(!b)return;const f=S.focus,a=b.dataset.fx;
    if(a==='pause'&&f.run){f.acc=focusSec();f.run=false;save();focusSheet(false);focusShow()}
    if(a==='resume'&&!f.run){f.start=Date.now();f.run=true;save();focusSheet(false);focusShow()}
    if(a==='discard'){S.focus=null;save();$('focusSheet').hidden=true;focusShow()}
    if(a==='close')$('focusSheet').hidden=true;
    if(a==='save'){f.note=$('fxNote').value.trim();focusSave()}
  });
  focusShow();
}

/* ---------- 90-day calendar and history ---------- */
const addDays=(d,n)=>{const x=new Date(d+'T12:00');x.setDate(x.getDate()+n);return x.toLocaleDateString('en-CA')};
const p90Start=()=>S.p90||day();
const p90Day=()=>Math.round((new Date(day()+'T12:00')-new Date(p90Start()+'T12:00'))/864e5)+1;
function dayState(d){
  const s=daySec(d),g=S.log&&S.log[d],any=s>=60||(g&&g.items&&g.items.length);
  if(d>day())return'fut';
  if(s>=goalMin()*60)return'met';
  if(any)return'part';
  if(d===day())return'today';
  if(d<p90Start())return'pre';
  return'miss';
}
function weekHTML(){
  const t=new Date(day()+'T12:00'),dow=(t.getDay()+6)%7,mon=addDays(day(),-dow);
  return [0,1,2,3,4,5,6].map(i=>{const d=addDays(mon,i),st=dayState(d);return`<span class="wd ${st}${d===day()?' now':''}" title="${d}"><i>${'MTWTFSS'[i]}</i><b>${st==='met'?'✓':st==='miss'?'✕':+d.slice(8)}</b></span>`}).join('');
}
let calM=null,calSel=null;
function renderCal(){
  const box=$('meCal');if(!box)return;
  calSel=calSel||day();calM=calM||day().slice(0,7);
  const [y,m]=calM.split('-').map(Number),first=new Date(y,m-1,1),lead=(first.getDay()+6)%7,days=new Date(y,m,0).getDate();
  const end=addDays(p90Start(),89),dn=p90Day();
  const logged=Object.keys(S.log||{}).filter(d=>d>=p90Start()&&d<=day());
  let miss=0;for(let d=p90Start();d<day();d=addDays(d,1))if(dayState(d)==='miss')miss++;
  const tot=Object.keys(S.log||{}).reduce((a,d)=>a+daySec(d),0),met=logged.filter(d=>dayState(d)==='met').length;
  let cells='';for(let i=0;i<lead;i++)cells+='<span></span>';
  for(let i=1;i<=days;i++){const d=`${calM}-${String(i).padStart(2,'0')}`,st=dayState(d),inP=d>=p90Start()&&d<=end;
    cells+=`<button class="cd ${st}${inP?' in':''}${d===calSel?' sel':''}${d===day()?' now':''}" data-cal="${d}" aria-label="${d} ${st}">${i}</button>`}
  const mn=first.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
  box.innerHTML=`<h3>90-day plan · day ${Math.max(1,Math.min(dn,90))} of 90</h3>
   <p class="note" style="margin:0 0 10px">${esc(fmtD(p90Start()))} → ${esc(fmtD(end))} · ${met} day${met===1?'':'s'} on target · ${miss} missed · ${(tot/3600).toFixed(1)} h learned in total</p>
   <div class="calhd"><button class="btn ghost sm" data-calm="-1" aria-label="Previous month">‹</button><b>${esc(mn)}</b><button class="btn ghost sm" data-calm="1" aria-label="Next month">›</button></div>
   <div class="cal"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>${cells}</div>
   <p class="note legend"><i class="lg met"></i>goal met <i class="lg part"></i>some learning <i class="lg miss"></i>nothing done <i class="lg in"></i>inside the 90 days</p>
   <label for="goalSel">Daily goal</label><select id="goalSel">${[15,20,30,45,60,90].map(n=>`<option value="${n}" ${n===goalMin()?'selected':''}>${n} minutes</option>`).join('')}</select>
   <div id="calDay" style="margin-top:14px">${dayDetail(calSel)}</div>`;
}
const fmtD=d=>new Date(d+'T12:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
function dayDetail(d){
  const g=(S.log&&S.log[d])||{sec:{},items:[],n:{}},sec=daySec(d),st=dayState(d),G=goalMin();
  const rows=Object.entries(g.sec||{}).filter(([,v])=>v>=30).sort((a,b)=>b[1]-a[1]);
  const n=g.n||{},counts=[n.cards&&`Rated ${n.cards} Q&A card${n.cards>1?'s':''}`,n.ide&&`${n.ide} IDE run${n.ide>1?'s':''}`,n.idet&&`${n.idet} passing test run${n.idet>1?'s':''}`,n.drun&&`${n.drun} code drill run${n.drun>1?'s':''}`,...Object.keys(n).filter(k=>k.startsWith('st_')).map(k=>{const s=STORIES.find(x=>x.id===k.slice(3));return s?`Worked on story: ${s.q}`:null})].filter(Boolean);
  const head=st==='fut'?'Not yet.':st==='pre'?'Before your 90 days started.':st==='miss'?'Nothing logged this day.':`${Math.floor(sec/60)} of ${G} min${sec>=G*60?' — goal met':''}`;
  return`<h3 style="margin:0 0 6px">${esc(fmtD(d))}${d===day()?' · today':''}</h3><p class="note" style="margin:0 0 8px;color:${st==='miss'?'var(--rose)':'inherit'}">${head}</p>`+
   (rows.length?rows.map(([k,v])=>`<div class="trk" style="margin:6px 0"><div><span>${esc(KIND[k]||k)}</span><span>${Math.round(v/60)} min</span></div><div class="meter"><i style="width:${Math.min(100,v/Math.max(sec,1)*100)}%"></i></div></div>`).join(''):'')+
   ((g.items||[]).length||counts.length?`<h3 style="margin:12px 0 6px">What you did</h3><ul class="hist">${(g.items||[]).slice().reverse().map(([t,k,x])=>`<li><b>${esc(t)}</b> <span class="note">${esc(KIND[k]||k)}</span><br>${esc(x)}</li>`).join('')}${counts.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>`:'');
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-cal]');if(c){calSel=c.dataset.cal;renderCal();return}
  const m=e.target.closest('[data-calm]');if(m){const [y,mo]=calM.split('-').map(Number),d=new Date(y,mo-1+ +m.dataset.calm,1);calM=d.toLocaleDateString('en-CA').slice(0,7);renderCal();return}
  if(e.target.closest('#weekStrip')){show('me');setTimeout(()=>{const b=$('meCal');if(b)b.scrollIntoView({block:'start'})},30)}
});
document.addEventListener('change',e=>{if(e.target.id==='goalSel'){S.goalMin=+e.target.value;save();renderCal();updMin()}});

if(!S.p90){S.p90=day();save()}
focusInit();
/* ---------- 30-minute daily session + minutes ---------- */
const SESS=[[`Quick 10 drill`,5],[`One lesson`,10],[`One code drill`,10],[`Q&A review`,5]];
let lastAct=Date.now(),sessT=null;
['click','keydown','input','touchstart','scroll'].forEach(ev=>document.addEventListener(ev,()=>{lastAct=Date.now()},{passive:true}));
function nextLesson(){const t=TRACKS[S.track].lessons.find(l=>!S.done[l.id])||ALL.find(l=>!S.done[l.id])||ALL[Math.floor(Math.random()*ALL.length)];return t.id}
function nextDrill(){return(CHAL.find(c=>c.id!=='free'&&!S.done['ch_'+c.id])||CHAL[1]).id}
function sessGo(){
  const s=S.sess;if(!s)return;const i=s.step;
  if(i>=SESS.length){sessEnd(true);return}
  if(i===0)quick('mix');
  if(i===1)openLesson(nextLesson());
  if(i===2){if(!$('lesson').hidden)closeLesson();show('play');codeMode('drills');pick(nextDrill())}
  if(i===3){if(!$('lesson').hidden)closeLesson();deckF=dueN()?'due':'all';show('qa')}
  sessBar();
}
function sessStart(){S.sess={d:day(),step:0,ts:Date.now()};save();sessGo()}
function sessNext(){if(!S.sess)return;S.sess.step++;S.sess.ts=Date.now();save();sessGo()}
function sessEnd(done){
  if(done){S.xp+=10;bump();mark('sessions')}
  S.sess=null;save();sessBar();head();
  if(done){if(!$('lesson').hidden)closeLesson();show('learn');$('hero').insertAdjacentHTML('afterbegin',`<div class="explain" style="background:#173a33"><h3 style="color:var(--ok)">30-minute session done · +10 XP</h3><p style="margin:0">Same time tomorrow keeps the streak alive.</p></div>`)}
}
function sessBar(){
  const b=$('sbar'),s=S.sess;if(sessT){clearInterval(sessT);sessT=null}
  if(!s||s.d!==day()){b.hidden=true;document.body.classList.remove('sess');if(s&&s.d!==day()){S.sess=null;save()}return}
  b.hidden=false;document.body.classList.add('sess');
  const [lab,mins]=SESS[s.step]||['Done',0];
  const tick=()=>{const left=Math.max(0,mins*60-Math.floor((Date.now()-s.ts)/1000));
    b.innerHTML=`<span><b>${s.step+1}/4 · ${lab}</b> · ${left?`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')} left`:'time — move on'}</span><button id="sNext">${s.step===3?'Finish':'Next ›'}</button><button id="sEnd" aria-label="End session">×</button>`};
  tick();sessT=setInterval(tick,1000);
}
$('sbar').addEventListener('click',e=>{if(e.target.id==='sNext')sessNext();if(e.target.id==='sEnd')sessEnd(false)});

/* ---------- Code tab modes + incident simulator ---------- */
let simCur=null;
function codeMode(m){
  document.querySelectorAll('[data-cm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cm===m));
  $('drillUI').hidden=m!=='drills';$('simUI').hidden=m!=='sim';$('ideUI').hidden=m!=='ide';if(m==='sim')renderSim();if(m==='ide')renderIde();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cm]');if(b)codeMode(b.dataset.cm)});
function renderSim(){
  const box=$('simUI');
  if(!simCur){box.innerHTML=`<p class="note" style="margin:0 0 14px">Live-incident practice like the SRE on-call round. Pick the command you'd run; every choice shows realistic output and why it helps or not.</p>`+
    SIMS.map(s=>`<button class="role" data-sim="${s.id}"><h3>${S.done['sim_'+s.id]?'✓ ':''}${esc(s.title)}</h3><small>${esc(s.brief)}</small></button>`).join('');return}
  const s=SIMS.find(x=>x.id===simCur.id);
  if(simCur.step>=s.steps.length){
    if(!S.done['sim_'+s.id]){S.done['sim_'+s.id]=true;S.xp+=8;bump();save();head();logItem('sim',`Resolved incident: ${s.title}`)}
    box.innerHTML=`<button class="back" data-simback>← All incidents</button><div class="explain" style="background:#173a33"><h3 style="color:var(--ok)">Resolved · ${simCur.first}/${s.steps.length} right first time</h3><p><b>Root cause:</b> ${esc(s.root)}</p><p style="margin:0"><b>Fix and prevention:</b> ${esc(s.fix)}</p></div><p class="note">In the interview, narrate it this way: impact → mitigate → investigate → root cause → prevent.</p>`;return}
  const st=s.steps[simCur.step];
  box.innerHTML=`<button class="back" data-simback>← All incidents</button><div class="panel"><span class="tag">${esc(s.title)} · step ${simCur.step+1} of ${s.steps.length}</span><p style="margin:0 0 8px">${esc(s.brief)}</p><h3>${esc(st.q)}</h3></div>
   <div class="opts">${st.opts.map((o,i)=>{const tried=simCur.tried.includes(i);return`<button class="opt${tried?(o.ok?' right':' wrong'):''}" data-so="${i}" ${tried&&!o.ok?'disabled':''}><code style="background:none;padding:0">${esc(o.cmd)}</code></button>`}).join('')}</div>
   ${simCur.last!=null?(()=>{const o=st.opts[simCur.last];return`<pre style="margin-top:14px">${esc(o.out)}</pre><div class="explain" style="${o.ok?'background:#173a33':''}"><h3 style="${o.ok?'color:var(--ok)':''}">${o.ok?'Good move':'Not this time'}</h3><p style="margin:0">${esc(o.why)}</p></div>${o.ok?`<button class="btn" data-snext>Next step</button>`:''}`})():''}`;
}
$('simUI').addEventListener('click',e=>{
  const s=e.target.closest('[data-sim]');if(s){simCur={id:s.dataset.sim,step:0,tried:[],last:null,first:0};renderSim();return}
  if(e.target.closest('[data-simback]')){simCur=null;renderSim();return}
  const o=e.target.closest('[data-so]');if(o&&simCur){const i=+o.dataset.so,st=SIMS.find(x=>x.id===simCur.id).steps[simCur.step];
    if(!simCur.tried.length&&st.opts[i].ok)simCur.first++;if(!simCur.tried.includes(i))simCur.tried.push(i);simCur.last=i;renderSim();return}
  if(e.target.closest('[data-snext]')){simCur.step++;simCur.tried=[];simCur.last=null;renderSim();window.scrollTo(0,0)}
});

/* ---------- Companies + 4-week plans ---------- */
function renderCompanies(){
  return`<p class="note" style="margin:0 0 14px">Your A-list from the 2 Nov career report first (postings may have closed since — check the tracker), then what candidates report about other companies. Each card links the lessons that close your gaps.</p>`+
  COMP.map(c=>{const n=CARDS.filter(x=>x.src&&x.src[0].includes(c.match)).length;return`<div class="panel"><h3>${esc(c.name)}</h3><ul style="margin:0 0 10px;padding-left:18px">${c.notes.map(x=>`<li style="margin-bottom:6px">${esc(x)}</li>`).join('')}</ul>
   <div class="btnrow">${n?`<button class="btn sm" data-deck="co:${c.match}">${n} reported question${n>1?'s':''}</button>`:''}${c.focus.map(id=>{const l=ALL.find(x=>x.id===id);return l?`<button class="btn ghost sm" data-open="${id}">${S.done[id]?'✓ ':''}${esc(l.title)}</button>`:''}).join('')}</div>
   <div class="links" style="margin-top:8px">${c.src.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener" style="font-size:14px">${esc(t)} ↗</a>`).join('')}</div></div>`}).join('')+
  `<div class="panel"><h3>Questions to ask them</h3><p class="note">Always have two ready for the end of each round.</p><ol class="rounds">${ASK.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div>`;
}
function planHTML(r){
  const L=r.lessons,W=[[],[],[],[]];L.forEach((id,i)=>W[Math.floor(i*4/L.length)].push(id));
  const drills=CHAL.filter(c=>c.id!=='free').map(c=>c.id),sims=SIMS.map(s=>s.id);
  const extra=[[`Rate every skill above honestly`,`Write your "Tell me about yourself" story`],[`Write 2 more STAR stories`,`Do 2 incident simulations`],[`2 mock interviews for this role`,`Review every Due card each day`],[`3 mock interviews, aim for 80%+`,`Apply to 5 matching roles`]];
  S.plan=S.plan||{};
  return`<div class="panel"><h3>4-week plan · 30 min a day</h3>${W.map((ids,w)=>{
    const dr=[drills[(w*2)%drills.length],drills[(w*2+1)%drills.length]];
    const items=ids.map(id=>{const l=ALL.find(x=>x.id===id);return`<li><button class="skill ${S.done[id]?'s2':''}" data-open="${id}" style="border:0;padding:6px 0;min-height:40px"><i></i><span>Lesson: ${esc(l.title)}</span></button></li>`}).join('')+
      dr.map(id=>{const c=CHAL.find(x=>x.id===id);return`<li><button class="skill ${S.done['ch_'+id]?'s2':''}" data-drill="${id}" style="border:0;padding:6px 0;min-height:40px"><i></i><span>Code: ${esc(c.name)}</span></button></li>`}).join('')+
      extra[w].map((t,j)=>{const k=r.id+w+'_'+j;return`<li><button class="skill ${S.plan[k]?'s2':''}" data-plan="${k}" style="border:0;padding:6px 0;min-height:40px"><i></i><span>${esc(t)}</span></button></li>`}).join('');
    return`<h3 style="font-size:15px;margin:12px 0 2px;color:var(--dusk)">Week ${w+1}</h3><ul style="list-style:none;margin:0;padding:0">${items}</ul>`}).join('')}</div>`;
}
document.addEventListener('click',e=>{
  const p=e.target.closest('[data-plan]');if(p){S.plan[p.dataset.plan]=!S.plan[p.dataset.plan];save();const y=scrollY;renderRoles();scrollTo(0,y);return}
  const d=e.target.closest('[data-drill]');if(d){show('play');codeMode('drills');pick(d.dataset.drill)}
});

/* ---------- Application tracker ---------- */
function renderApps(){
  const A=S.apps;
  $('apps').innerHTML=`<h3>Applications</h3><p class="note">Your weekly job-scan task fills the Hyderabad Job Application Tracker; use the resume each posting names. Quick notes below stay on this device.</p><div class="links" style="margin-bottom:10px">${RESUMES.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div>
  <div style="display:grid;gap:8px"><input id="apCo" placeholder="Company" aria-label="Company"><input id="apRole" placeholder="Role" aria-label="Role">
  <div class="row" style="margin:0"><select id="apStage" aria-label="Stage">${STAGES.map(s=>`<option>${s}</option>`).join('')}</select><input id="apDate" type="date" aria-label="Next date"></div>
  <input id="apNote" placeholder="Notes — recruiter, referral, next step" aria-label="Notes"><button class="btn ghost" id="apAdd">Add application</button></div>
  ${A.length?`<div style="margin-top:12px">${A.map((a,i)=>`<div style="border-top:1px solid var(--line);padding:10px 0"><b>${esc(a.co)}</b> · ${esc(a.role)}<div class="row" style="margin:6px 0"><select data-apst="${i}" aria-label="Stage for ${esc(a.co)}">${STAGES.map(s=>`<option ${s===a.st?'selected':''}>${s}</option>`).join('')}</select><button class="btn ghost sm" data-apdel="${i}">Remove</button></div>${a.date?`<span class="note">Next: ${esc(a.date)}</span> `:''}${a.note?`<span class="note">${esc(a.note)}</span>`:''}</div>`).join('')}</div>`:''}`;
}
document.addEventListener('click',e=>{
  if(e.target.id==='apAdd'){const co=$('apCo').value.trim(),role=$('apRole').value.trim();if(!co)return $('apCo').focus();
    S.apps.unshift({co,role,st:$('apStage').value,date:$('apDate').value,note:$('apNote').value.trim()});save();renderApps()}
  const del=e.target.closest('[data-apdel]');if(del){if(del.dataset.arm){S.apps.splice(+del.dataset.apdel,1);save();renderApps()}else{del.dataset.arm=1;del.textContent='Tap to confirm'}}
});
document.addEventListener('change',e=>{const s=e.target.closest('[data-apst]');if(s){S.apps[+s.dataset.apst].st=s.value;save()}});

/* ---------- Walkthroughs ---------- */
const lessonOf=s=>ALL.find(l=>s.k&&s.k.startsWith(l.id+':'));
function filled(s){const p=s.code.split('___');return p.map((x,i)=>x+(i<p.length-1?s.ans[i]:'')).join('')}
function walkHTML(s,compact){
  const l=lessonOf(s),learn=l.steps.filter(x=>x.t==='learn');
  const ans=s.t==='mcq'?`<p style="margin:0 0 8px"><b>${esc(s.opts[s.a])}</b></p>`:s.t==='task'?`<pre style="white-space:pre-wrap"><code>${esc(s.model)}</code></pre>`:`<pre><code>${esc(filled(s))}</code></pre>`;
  return`${compact?`<h3 style="margin-top:4px">${esc(s.q)}</h3>`:`<span class="tag">Walkthrough · ${esc(l.title)}</span><h2>${esc(s.q)}</h2>`}${s.code&&s.t==='mcq'?`<pre><code>${esc(s.code)}</code></pre>`:''}
  <div class="panel"><h3>1 · The concept behind it</h3>${learn.map(x=>`<p><b>${esc(x.h)}.</b> ${x.body}</p>${x.code?`<pre><code>${esc(x.code)}</code></pre>`:''}`).join('')}</div>
  <div class="panel"><h3>2 · The answer</h3>${ans}${s.why?`<p style="margin:0">${esc(s.why)}</p>`:''}${s.w?`<p style="margin:10px 0 0">${esc(s.w)}</p>`:''}</div>
  ${s.t==='mcq'?`<div class="panel"><h3>3 · Every option, checked</h3><ul style="margin:0;padding-left:18px">${s.opts.map((o,i)=>`<li style="margin-bottom:6px">${i===s.a?'✓ <b>'+esc(o)+'</b> — correct.':'✗ '+esc(o)+(s.no&&s.no[i]?' — '+esc(s.no[i]):'')}</li>`).join('')}</ul></div>`:s.t==='task'?`<div class="panel"><h3>3 · What a strong answer includes</h3><ul style="margin:0;padding-left:18px">${(s.kind==='cmd'?s.checks.map(c=>c[1]):s.rubric).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:`<div class="panel"><h3>3 · How to work it out</h3><p style="margin:0">Read the code line by line and ask what each blank must do. The answer fills ${s.ans.length} blank${s.ans.length>1?'s':''}: ${s.ans.map(a=>`<code>${esc(a)}</code>`).join(', ')}.</p></div>`}
  ${(l.ref||[]).length?`<div class="panel links"><h3>Read the official source</h3>${l.ref.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div>`:''}`;
}
function openWalkList(){
  const steps=ALL.flatMap(l=>l.steps.filter(s=>s.t!=='learn'&&S.miss[s.k]));
  L={l:{id:'read',title:'Walkthroughs',steps:[]},q:[],done:0,miss:0,wrong:new Set(),state:'read'};
  $('lesson').hidden=false;document.body.style.overflow='hidden';$('lbar').style.width='100%';
  $('stage').innerHTML=`<span class="tag">Your weak spots</span><h2>${steps.length} walkthrough${steps.length===1?'':'s'}</h2>`+(steps.length?steps.map(s=>`<details class="panel"><summary style="cursor:pointer;font-weight:700">${esc(s.q)}</summary>${walkHTML(s,true)}</details>`).join(''):'<p>No weak spots yet. Wrong answers collect here with full walkthroughs.</p>');
  $('lfoot').className='lfoot';$('fb').innerHTML='';$('act').disabled=false;$('act').textContent='Close';
}

/* ---------- Code solutions ---------- */
function solHTML(id){
  const s=SOL[id];if(!s)return'';
  return`<div class="panel" id="solPanel"><h3>Solution walkthrough</h3><p class="note">Try it yourself first — reading the answer too early teaches far less.</p>
  <ol class="rounds">${s.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
  <pre style="margin-top:10px"><code>${esc(s.code)}</code></pre>
  <p style="margin:0 0 6px"><b>Complexity:</b> ${esc(s.big)}</p>
  <p style="margin:0 0 6px"><b>Common mistakes:</b></p><ul style="margin:0 0 10px;padding-left:18px">${s.pit.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  <button class="btn ghost sm" data-loadsol="${id}">Load into editor and run it</button></div>`;
}
document.addEventListener('click',e=>{
  const sb=e.target.closest('[data-showsol]');if(sb){const id=sb.dataset.showsol;S.dhelp=S.dhelp||{};S.dhelp[id]=1;sb.insertAdjacentHTML('afterend',solHTML(id));sb.remove();S.dmiss=S.dmiss||{};S.dmiss[id]=1;save();return}
  const ls=e.target.closest('[data-loadsol]');if(ls){$('ed').value=SOL[ls.dataset.loadsol].code;$('ed').scrollIntoView({behavior:'smooth',block:'center'})}
  if(e.target.closest('[data-walk]')&&L){L.prev=$('stage').innerHTML;const s=L.l.steps[L.q[0]];$('stage').innerHTML=walkHTML(s)+`<button class="back" data-unwalk>← Back to the question</button>`;$('stage').scrollTop=0}
  if(e.target.closest('[data-unwalk]')&&L&&L.prev){$('stage').innerHTML=L.prev;L.prev=null}
  if(e.target.closest('[data-walklist]'))openWalkList();
});

/* ---------- 90-day plan ---------- */
function weekNow(){if(!S.p90)return 0;const d=Math.floor((new Date(day())-new Date(S.p90))/864e5);return Math.min(11,Math.max(0,Math.floor(d/7)))}
function itemDone(it){const[k,v]=it;return k==='l'?!!S.done[v]:k==='d'?!!S.done['ch_'+v]:k==='s'?!!S.done['sim_'+v]:!!(S.plan&&S.plan['p90_'+v])}
function itemHTML(it){
  const[k,v]=it,d=itemDone(it);let lab,attr;
  if(k==='l'){const l=ALL.find(x=>x.id===v);lab=`Lesson: ${l.title}`;attr=`data-open="${v}"`}
  else if(k==='d'){const c=CHAL.find(x=>x.id===v);lab=`Code: ${c.name}`;attr=`data-drill="${v}"`}
  else if(k==='s'){const s=SIMS.find(x=>x.id===v);lab=`Incident sim: ${s.title}`;attr=`data-gosim="${v}"`}
  else {lab=v;attr=`data-plan="p90_${esc(v)}"`}
  return`<li><button class="skill ${d?'s2':''}" ${attr} style="border:0;padding:6px 0;min-height:40px"><i></i><span>${esc(lab)}</span></button></li>`;
}
function renderPlan90(){
  const box=$('plan90');if(!box)return;
  if(!S.p90){box.innerHTML=`<h3>90-day job plan</h3><p class="note">Twelve focused weeks: coding without AI, Linux, storage (your edge), Kubernetes, CI/CD, SRE, security, system design, then mocks and applications. 30 minutes a day on weekdays, a bit more at weekends.</p><button class="btn" id="p90start">Start my 90 days today</button>`;return}
  const w=weekNow(),done=PLAN90.flat().length&&PLAN90.reduce((a,[_,its])=>a+its.filter(itemDone).length,0),tot=PLAN90.reduce((a,[_,its])=>a+its.length,0);
  box.innerHTML=`<h3>90-day job plan · week ${w+1} of 12</h3><div class="meter" style="margin:8px 0"><i style="width:${Math.round(done/tot*100)}%"></i></div><p class="note">${done} of ${tot} tasks done · started ${esc(S.p90)}</p>`+
   PLAN90.map(([title,its],i)=>`<details ${i===w?'open':''} style="border-top:1px solid var(--line);padding:8px 0"><summary style="cursor:pointer;font-weight:700;min-height:32px">${its.every(itemDone)?'✓ ':''}Week ${i+1} · ${esc(title)}${i===w?' · this week':''}</summary><ul style="list-style:none;margin:6px 0 0;padding:0">${its.map(itemHTML).join('')}</ul></details>`).join('')+
   `<p class="note" style="margin-top:10px">Lessons, drills and simulations tick themselves when you finish them; tap the others when done.</p>`;
}
document.addEventListener('click',e=>{
  if(e.target.id==='p90start'){S.p90=day();save();renderPlan90();return}
  const g=e.target.closest('[data-gosim]');if(g){show('play');codeMode('sim');simCur={id:g.dataset.gosim,step:0,tried:[],last:null,first:0};renderSim()}
  const p=e.target.closest('[data-plan^="p90_"]');if(p&&!$('v-me').hidden){const y=scrollY;renderPlan90();scrollTo(0,y)}
});

/* ---------- Pipeline (private: from your job tracker) ---------- */
const pkey=p=>p.co+'|'+p.role;
const pst=p=>(S.pipe&&S.pipe[pkey(p)]&&S.pipe[pkey(p)].st)||p.st;
const daysTo=d=>Math.round((new Date(d)-new Date(day()))/864e5);
function pipeCard(p){
  const st=pst(p),les=p.les.map(id=>{const l=ALL.find(x=>x.id===id);return l?`<button class="btn ghost sm" data-open="${id}">${S.done[id]?'✓ ':''}${esc(l.title)}</button>`:''}).join('');
  const dd=p.dl?daysTo(p.dl):null;
  return`<div class="panel" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:8px"><h3 style="margin:0">${esc(p.co)}</h3><span class="note" style="white-space:nowrap">${p.pri?'Priority '+esc(p.pri)+' · ':''}fit ${esc(p.fit)}</span></div>
  <p style="margin:4px 0 6px">${p.url?`<a href="${esc(p.url)}" target="_blank" rel="noopener" style="color:var(--rose)">${esc(p.role)} ↗</a>`:esc(p.role)}</p>
  <p class="note" style="margin:0 0 4px"><b>Status:</b> ${esc(st)}${S.pipe&&S.pipe[pkey(p)]?` (updated ${esc(S.pipe[pkey(p)].d)})`:''}${dd!=null?` · <b style="color:${dd<=3?'var(--rose)':'inherit'}">deadline ${esc(p.dl)}${dd>=0?` (${dd===0?'today':dd===1?'tomorrow':dd+' days'})`:' (passed)'}</b>`:''}</p>
  ${p.res?`<p class="note" style="margin:0 0 4px"><b>Resume:</b> ${esc(p.res)}</p>`:''}
  ${p.gap?`<p class="note" style="margin:0 0 4px"><b>Gaps:</b> ${esc(p.gap)}</p>`:''}
  ${p.next?`<p class="note" style="margin:0 0 8px"><b>Next:</b> ${esc(p.next)}</p>`:''}
  ${les?`<div class="btnrow" style="margin-bottom:8px">${les}</div>`:''}
  <div class="btnrow">${st!=='Applied'?`<button class="btn sm" data-pset="Applied" data-pk="${esc(pkey(p))}">Mark applied</button>`:''}${st!=='Interviewing'?`<button class="btn ghost sm" data-pset="Interviewing" data-pk="${esc(pkey(p))}">Interviewing</button>`:''}${st!=='Skipped for now'?`<button class="btn ghost sm" data-pset="Skipped for now" data-pk="${esc(pkey(p))}">Skip</button>`:''}</div></div>`;
}
function renderPipeline(){
  if(!PIPE.length)return`<div class="panel"><h3>Your job pipeline</h3><p class="note" style="margin:0">Add the roles you're tracking to <code>js/personal.js</code> (copy <code>js/personal.example.js</code>). That file stays on your machine and is never committed.</p></div>`;
  const all=PIPE.map(p=>({...p,cur:pst(p)}));
  const dls=all.filter(p=>p.dl&&daysTo(p.dl)>=0&&!['Applied','Interviewing','Skipped for now'].includes(p.cur)).sort((a,b)=>a.dl<b.dl?-1:1);
  const grp=(f)=>all.filter(f);
  const live=grp(p=>['Pinned','Interviewing','Applied'].includes(p.cur));
  const A=grp(p=>p.cur==='To review'&&p.pri==='A'),B=grp(p=>p.cur==='To review'&&p.pri!=='A'),sk=grp(p=>p.cur==='Skipped for now');
  return`<p class="note" style="margin:0 0 12px">From your job tracker (checked ${PIPE_ASOF}) · ${all.length} open roles · ${A.length} A-priority to review. This view is private to you; postings may have closed since — confirm before applying. Status changes you make here stay on this device; mirror them in your tracker.</p>
  ${dls.length?`<div class="explain" style="background:#3d1a26"><h3>Deadlines</h3><ul>${dls.map(p=>`<li><b>${esc(p.dl)}</b> (${daysTo(p.dl)===0?'today':daysTo(p.dl)===1?'tomorrow':daysTo(p.dl)+' days'}) — ${esc(p.co)}: ${esc(p.role)}</li>`).join('')}</ul></div>`:''}
  ${live.length?`<h3 class="unit">In progress</h3>${live.map(pipeCard).join('')}`:''}
  <h3 class="unit">A-priority · apply next (${A.length})</h3>${A.map(pipeCard).join('')}
  <details><summary class="unit" style="cursor:pointer">B / C priority (${B.length})</summary>${B.map(pipeCard).join('')}</details>
  ${sk.length?`<details><summary class="unit" style="cursor:pointer">Skipped (${sk.length})</summary>${sk.map(pipeCard).join('')}</details>`:''}`;
}
document.addEventListener('click',e=>{if(e.target.closest('[data-gopipe]')){rv='pipe';show('roles');return}const b=e.target.closest('[data-pset]');if(!b)return;S.pipe=S.pipe||{};S.pipe[b.dataset.pk]={st:b.dataset.pset,d:day()};save();const y=scrollY;renderRoles();scrollTo(0,y)});

document.addEventListener('click',e=>{if(e.target.closest('[data-sess]')){if(S.sess&&S.sess.d===day())sessGo();else sessStart()}});
pick('free');renderLearn();sessBar();
if('serviceWorker' in navigator&&location.hostname.endsWith('github.io')){try{navigator.serviceWorker.register('sw.js')}catch(e){}}