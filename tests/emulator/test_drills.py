import sys,time,json,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="play"]')
    ids=pg.evaluate("()=>CHAL.filter(c=>c.id!=='free').map(c=>c.id)");sol=pg.evaluate("()=>Object.fromEntries(Object.entries(SOL).map(([k,v])=>[k,v.code]))")
    bad=[]
    for i in ids:
        pg.evaluate(f"()=>pick('{i}')")
        for label,code in [('sol',sol[i]),('start',None)]:
            if code is not None: pg.fill('#ed',code)
            else: pg.evaluate(f"()=>pick('{i}')")
            pg.tap('#run'); pg.wait_for_function("()=>!document.getElementById('run').disabled",timeout=20000)
            v=pg.inner_text('#verdict')
            ok=('passed!' in v or 'Solved' in v)
            if (label=='sol')!=ok: bad.append((i,label,v,pg.inner_text('#out')[-200:]))
    print('checked',len(ids),'drills; problems:',json.dumps(bad,indent=1)[:3000])
    # error explanation path
    pg.evaluate("()=>pick('c1')"); pg.fill('#ed','x = 1\nprint(y)\n'); pg.tap('#run'); pg.wait_for_function("()=>!document.getElementById('run').disabled")
    print('ERR EXPLAIN:',pg.inner_text('#explain')[:200].replace('\n',' | '))
    # infinite loop
    pg.fill('#ed','while True:\n    pass\n'); t=time.time(); pg.tap('#run')
    pg.wait_for_function("()=>!document.getElementById('run').disabled",timeout=30000)
    print('LOOP:',pg.inner_text('#verdict'),round(time.time()-t,1),'s')
    # fresh namespace: define fn, then run 'pass' on function drill
    fid=[i for i in ids if i.startswith('f_')][0]
    pg.evaluate(f"()=>pick('{fid}')"); pg.fill('#ed',sol[fid]); pg.tap('#run'); pg.wait_for_function("()=>!document.getElementById('run').disabled",timeout=20000)
    pg.fill('#ed','pass\n'); pg.tap('#run'); pg.wait_for_function("()=>!document.getElementById('run').disabled",timeout=20000)
    print('FRESH NS:',pg.inner_text('#verdict')[:90])
    None
    b.close(); print('PAGE ERRORS',errs)
