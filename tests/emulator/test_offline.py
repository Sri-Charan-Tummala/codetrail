"""Offline install (GitHub Pages style): serve the app on localhost with its service worker,
prepare Python for offline, then cut the network and check the app and Python still work.
Also checks that a backup file carries personal data to a host without js/personal.js."""
import sys,os,json,threading,functools,http.server,socketserver,shutil,tempfile; sys.path.insert(0,os.path.dirname(__file__))
from emu import STUB,bridge
from playwright.sync_api import sync_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
# a copy WITHOUT js/personal.js, like the public repo
SITE=tempfile.mkdtemp(); shutil.copytree(ROOT,SITE+'/app',ignore=shutil.ignore_patterns('tests','.git','personal.js'))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=SITE+'/app')); port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
URL=f'http://localhost:{port}/'
state={'online':True,'cdn':0}
def handler(route):
    u=route.request.url
    if 'pybridge.test' in u: return bridge(route)          # stands in for the interpreter itself
    if 'cdn.jsdelivr.net/pyodide/' in u:
        if not state['online']: return route.abort('internetdisconnected')
        state['cdn']+=1
        return route.fulfill(body=STUB,content_type='text/javascript',headers={'Access-Control-Allow-Origin':'*'})
    if u.startswith(URL):
        if not state['online']: return route.abort('internetdisconnected')
        return route.continue_()
    return route.abort()
fails=[]
def check(n,ok,d=''):
    print(('PASS ' if ok else 'FAIL ')+n,str(d)[:200].replace('\n',' / '))
    if not ok: fails.append(n)
R="()=>!document.getElementById('run').disabled"
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(**p.devices['iPhone 13'],service_workers='allow'); ctx.route('**/*',handler)
    pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); pg.wait_for_function("()=>navigator.serviceWorker.controller||(location.reload(),false)",timeout=20000,polling=1500)
    pg.wait_for_load_state(); pg.wait_for_function("()=>!!navigator.serviceWorker.controller",timeout=20000)
    check('service worker controls page',True)
    check('no personal data before restore',pg.evaluate("()=>CT_PERSONAL_SRC")==None)
    # restore a backup that carries personal data (as downloaded from the Claude link)
    backup={'done':{'p1':1},'_personal':{'pipe':[{'co':'TestCo','role':'SRE','st':'Applied','pri':'A','fit':7,'les':[]}],'you':[]}}
    f=os.path.join(SITE,'bk.json'); open(f,'w').write(json.dumps(backup))
    pg.tap('nav [data-v="me"]') if pg.locator('nav [data-v="me"]').count() else None
    pg.set_input_files('#bkUp',f); pg.wait_for_timeout(1500); pg.wait_for_load_state()
    check('personal data restored on device',pg.evaluate("()=>CT_PERSONAL_SRC")=='device',pg.evaluate("()=>CT_PERSONAL_SRC"))
    check('progress restored',pg.evaluate("()=>!!S.done.p1"))
    check('_personal not kept in progress',pg.evaluate("()=>!('_personal' in S)"))
    # prepare Python for offline
    pg.evaluate("()=>pyPrefetch()"); pg.wait_for_function("()=>/saved for offline/.test(document.getElementById('pyOffMsg').textContent)",timeout=60000)
    check('Python prepared',True,pg.inner_text('#pyOffMsg'))
    # go offline: site server and CDN unreachable
    check('Pyodide was downloaded once online',state['cdn']>0,state['cdn'])
    state['online']=False; srv.shutdown(); n0=state['cdn']
    pg.reload(); pg.wait_for_function("()=>typeof CHAL!=='undefined'",timeout=20000)
    check('app opens offline',True)
    check('personal data still there offline',pg.evaluate("()=>CT_PERSONAL_SRC")=='device')
    pg.tap('nav [data-v="play"]')
    sol=pg.evaluate("()=>SOL.f_flaky_tests.code")
    pg.evaluate("()=>pick('f_flaky_tests')"); pg.fill('#ed',sol); pg.tap('#run'); pg.wait_for_function(R,timeout=30000)
    v=pg.inner_text('#verdict'); check('SQL drill runs offline','passed!' in v or 'Solved' in v,v+' '+pg.inner_text('#out')[-150:])
    check('Pyodide came from the offline cache',state['cdn']==n0,f"cdn hits offline: {state['cdn']-n0}")
    check('no page errors',not errs,errs)
    b.close()
print('RESULT:','OK' if not fails else 'FAILED '+', '.join(fails)); sys.exit(1 if fails else 0)
