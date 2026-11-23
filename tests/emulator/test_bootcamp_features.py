"""Timed assessment (12 questions, no retries, then a coding drill), the Claude
mock-interview prompt on role pages, the 120-minute goal and the project guide."""
import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
fails=[]
def check(n,ok,d=''):
    print(('PASS ' if ok else 'FAIL ')+n,str(d)[:200])
    if not ok: fails.append(n)
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="learn"]'); check('assessment button on home',pg.locator('[data-assess]').count()>=1)
    pg.click('[data-assess]')
    n=pg.evaluate("()=>L.l.steps.length"); check('12 questions',n==12,n)
    first=True
    for i in range(n):
        s=pg.evaluate("()=>{const s=L.l.steps[L.q[0]];return {t:s.t,a:s.a,n:(s.opts||[]).length,ans:s.ans,toks:s.toks}}")
        wrong=first; first=False
        if s['t']=='mcq': pg.click(f'#stage [data-o="{(s["a"]+1)%s["n"] if wrong else s["a"]}"]')
        else:
            used=[]
            for k,a in enumerate(s['ans']):
                cand=[j for j,t in enumerate(s['toks']) if (t!=a if wrong else t==a) and j not in used]; used.append(cand[0]); pg.click(f'#stage [data-t="{cand[0]}"]')
        pg.click('#act'); pg.click('#act')
    t=pg.inner_text('#stage'); check('score after exactly 12 answers (no retries)','11/12' in t,t[:80])
    check('saved to history',pg.evaluate("()=>S.assess.length===1&&S.assess[0].ok===11"))
    pg.click('#assessDrill'); pg.wait_for_timeout(300)
    check('coding drill opens in interview mode',pg.evaluate("()=>S.imode&&!document.getElementById('v-play').hidden&&cur&&cur.id!=='free'"))
    pg.evaluate("()=>{rv='roles';roleOpen='sre';show('roles')}"); pg.wait_for_timeout(200)
    check('Claude prompt button on role page',pg.locator('[data-aiprompt="sre"]').count()==1)
    txt=pg.evaluate("()=>aiPrompt(ROLES.find(r=>r.id==='sre'))")
    check('prompt has role and rounds','SRE' in txt and 'ONE question' in txt and 'score me' in txt,txt[:120])
    check('120-minute goal available',pg.evaluate("()=>{renderMe();return !!document.querySelector('#goalSel option[value=\"120\"]')}"))
    check('project guide present',pg.evaluate("()=>!!GUIDES.find(g=>g.id==='rgproject')"))
    check('no page errors',not errs,errs)
    b.close()
print('RESULT:','OK' if not fails else 'FAILED '+', '.join(fails)); sys.exit(1 if fails else 0)
