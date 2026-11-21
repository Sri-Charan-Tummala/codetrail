import sys,json,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="me"]'); print('note:',pg.inner_text('#bkNote')[-30:])
    with pg.expect_download() as dl: pg.tap('#bkDown')
    path=dl.value.path(); d=json.load(open(path)); print('file:',dl.value.suggested_filename,'| keys:',sorted(k for k in ['stories','ide','done','bk'] if k in d))
    print('note after:',pg.inner_text('#bkNote')[-30:])
    pg.evaluate("()=>localStorage.clear()"); pg.reload(); pg.tap('nav [data-v=\"me\"]')
    d['xp']=777; open(os.path.join(os.path.dirname(__file__),'.bk.json'),'w').write(json.dumps(d))
    pg.set_input_files('#bkUp',os.path.join(os.path.dirname(__file__),'.bk.json')); pg.wait_for_timeout(300)
    print('restore:',pg.inner_text('#impMsg'),'| xp in storage:',pg.evaluate("()=>JSON.parse(localStorage.getItem('codetrail')).xp"))
    None
    b.close(); print('ERRORS',errs)
