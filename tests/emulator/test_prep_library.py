import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="roles"]'); print('nav label:',pg.inner_text('nav [data-v="roles"]'))
    pg.tap('[data-rv="syl"]'); print('SYL:',pg.inner_text('#roles')[:260].replace('\n',' | '))
    pg.tap('[data-rv="guides"]'); print('GUIDES count:',pg.locator('[data-guide]').count())
    pg.locator('[data-guide="k8s"]').tap(); print('GUIDE:',pg.inner_text('#roles')[:160].replace('\n',' | '))
    pg.locator('[data-guide=""]').first.tap()
    pg.tap('[data-rv="docs"]'); print('DOCS links:',pg.locator('#roles .links a').count())
    pg.type('#docQ','tls'); print('DOCS search tls:',pg.locator('#roles .links a').count(),'| focus kept:',pg.evaluate("()=>document.activeElement.id"))
    pg.tap('[data-rv="list"]'); pg.locator('[data-role="sre"]').tap(); print('ROLE detail has syllabus:',pg.locator('#roles .sy').count()>0)
    b.close(); print('ERRORS',errs)
