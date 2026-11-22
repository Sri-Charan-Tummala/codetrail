"""Brilliant/Mimo-style features: test out of a lesson, key-point recap + Notes notebook,
and Quick 10 practising finished lessons first (spaced review)."""
import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
fails=[]
def check(n,ok,d=''):
    print(('PASS ' if ok else 'FAIL ')+n,str(d)[:200])
    if not ok: fails.append(n)
def answer(pg,right=True):
    s=pg.evaluate("()=>{const s=L.l.steps[L.q[0]];return {t:s.t,a:s.a,n:(s.opts||[]).length,ans:s.ans,toks:s.toks}}")
    if s['t']=='mcq':
        i=s['a'] if right else (s['a']+1)%s['n']; pg.click(f'#stage [data-o="{i}"]')
    else:
        used=[]
        for k,a in enumerate(s['ans']):
            idx=[i for i,t in enumerate(s['toks']) if t==a and i not in used][0] if right else [i for i,t in enumerate(s['toks']) if t!=s['ans'][k] and i not in used][0]
            used.append(idx); pg.click(f'#stage [data-t="{idx}"]')
    pg.click('#act'); pg.click('#act')   # check, then continue
with sync_playwright() as p:
    b,pg,errs=start(p)
    ids=pg.evaluate("()=>ALL.filter(l=>l.steps.some(s=>s.t==='learn')&&l.steps.filter(s=>s.t!=='learn').length>=2&&l.steps.every(s=>['learn','mcq','fill'].includes(s.t))).map(l=>l.id)")
    check('lessons eligible for test-out',len(ids)>=2,ids[:6])
    good,bad=ids[0],ids[1]
    # pass a test-out
    pg.evaluate(f"()=>openLesson('{good}')")
    check('test-out button shown',pg.locator('[data-testout]').count()==1)
    pg.click('[data-testout]')
    while pg.evaluate("()=>L&&L.state!=='end'"): answer(pg,True)
    check('passed test-out marks lesson done',pg.evaluate(f"()=>!!S.done['{good}']"))
    t=pg.inner_text('#stage'); check('recap shows key points','Key points' in t,t[:120])
    pg.click('#act')
    # fail a test-out
    pg.evaluate(f"()=>openLesson('{bad}')"); pg.click('[data-testout]')
    answer(pg,False)
    while pg.evaluate("()=>L&&L.state!=='end'"): answer(pg,True)
    t=pg.inner_text('#stage')
    check('failed test-out keeps lesson open','take the full lesson' in t and not pg.evaluate(f"()=>!!S.done['{bad}']"),t[:120])
    pg.click('[data-open-lesson]')
    check('full lesson starts on a teaching card',pg.evaluate("()=>L.l.steps[L.q[0]].t==='learn'&&!L.testout"))
    pg.click('#xBtn')
    # notes
    pg.evaluate("()=>openNotes()"); t=pg.inner_text('#stage')
    title=pg.evaluate(f"()=>ALL.find(l=>l.id==='{good}').title")
    check('notes list finished lesson',title in t and pg.evaluate(f"()=>ALL.find(l=>l.id==='{bad}').title") not in t,t[:120])
    pg.click('#act')
    # quick practice prefers finished lessons (other than weak spots)
    pg.evaluate("()=>{S.miss={};S.seen={};save()}")
    pg.evaluate("()=>quick('mix')")
    ks=pg.evaluate("()=>L.l.steps.map(s=>s.k.split(':')[0])")
    n=pg.evaluate(f"()=>ALL.find(l=>l.id==='{good}').steps.filter(s=>s.t!=='learn').length")
    check('Quick 10 starts with finished-lesson questions',all(k==good for k in ks[:n]),ks)
    pg.click('#xBtn')
    pg.tap('nav [data-v="learn"]'); check('Notes button on home',pg.locator('[data-notes]').count()>=1)
    check('no page errors',not errs,errs)
    b.close()
print('RESULT:','OK' if not fails else 'FAILED '+', '.join(fails)); sys.exit(1 if fails else 0)
