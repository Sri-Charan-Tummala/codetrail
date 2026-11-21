"""Regression for the Pyodide-only bugs found in review (stub mimics them):
consecutive IDE runs reuse one interpreter, and sqlite3 must be loaded first."""
import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
W="()=>!document.getElementById('ideRun').disabled"
R="()=>!document.getElementById('run').disabled"
fails=[]
def check(name,ok,detail=''):
    print(('PASS ' if ok else 'FAIL ')+name,detail[:160].replace('\n',' / '))
    if not ok: fails.append(name)
with sync_playwright() as p:
    b,pg,errs=start(p)
    # SQL drill first, in a fresh worker
    pg.tap('nav [data-v="play"]')
    sql=pg.evaluate("()=>CHAL.filter(c=>/sqlite3/.test(c.start)).map(c=>c.id)")
    sol=pg.evaluate("()=>Object.fromEntries(Object.entries(SOL).map(([k,v])=>[k,v.code]))")
    check('found SQL drills',len(sql)>=6,str(sql))
    for i in sql:
        pg.evaluate(f"()=>pick('{i}')"); pg.fill('#ed',sol[i]); pg.tap('#run'); pg.wait_for_function(R,timeout=30000)
        v=pg.inner_text('#verdict'); check('SQL '+i,'passed!' in v or 'Solved' in v,v+' '+pg.inner_text('#out')[-150:])
    # IDE: tests, tests again, run, tests
    pg.tap('[data-cm="ide"]')
    for step,btn in [('tests #1','#ideTest'),('tests #2','#ideTest'),('run main','#ideRun'),('tests after run','#ideTest'),('run again','#ideRun')]:
        pg.tap(btn); pg.wait_for_function(W,timeout=30000)
        v=pg.inner_text('#ideVerdict'); x=pg.inner_text('#ideExplain')+pg.inner_text('#ideOut')
        check('IDE '+step,'FileExistsError' not in x and 'busy' not in x and ('passed' in v if btn=='#ideTest' else 'rror' not in v),v+' | '+x[:120])
    check('no page errors',not errs,str(errs))
    b.close()
print('RESULT:', 'OK' if not fails else 'FAILED '+', '.join(fails))
sys.exit(1 if fails else 0)
