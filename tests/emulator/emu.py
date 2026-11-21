"""Test harness: an emulated iPhone 13 (Chromium) running CodeTrail, with the app's
Pyodide API answered by real CPython, so drills and the IDE run real Python offline.
Needs: pip install playwright && playwright install chromium (or set CHROME=/path/to/chrome)."""
import json, os, subprocess, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
APP=(HERE.parents[1]/'index.html').as_uri()
from playwright.sync_api import sync_playwright
STUB=open(HERE/'stub.js').read()
def bridge(route):
    body=route.request.post_data
    if 'while True' in body and 'break' not in body: return  # emulate a hung interpreter: never answer
    try:
        p=subprocess.run([sys.executable,'-I',str(HERE/'pyexec.py')],input=body,capture_output=True,text=True,timeout=12)
        res=p.stdout or json.dumps({'out':'','err':p.stderr,'vars':{}})
    except subprocess.TimeoutExpired:
        res=json.dumps({'out':'','err':'Traceback\nTimeoutError: bridge timeout','vars':{}})
    route.fulfill(status=200,body=res,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'})
def handler(route):
    u=route.request.url
    if 'pybridge.test' in u: return bridge(route)
    if u.endswith('pyodide.js'): return route.fulfill(body=STUB,content_type='text/javascript',headers={'Access-Control-Allow-Origin':'*'})
    if u.startswith('file:') or u.startswith('blob:') or u.startswith('data:'): return route.continue_()
    return route.abort()
def start(p):
    b=p.chromium.launch(executable_path=os.environ.get('CHROME')) if os.environ.get('CHROME') else p.chromium.launch()
    ctx=b.new_context(**p.devices['iPhone 13'])
    ctx.route('**/*',handler)
    pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(APP)
    return b,pg,errs
