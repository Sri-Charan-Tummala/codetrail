import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="qa"]'); pg.tap('#mockBtn'); pg.locator('[data-mockfull="sre"]').tap()
    print('FULL first:',pg.inner_text('#deck .meta'))
    for i in range(8):
        pg.tap('#mockReveal'); pg.tap('[data-ms="1"]')
    print('END:',pg.inner_text('#deck')[:140].replace('\n',' | '),'| coding btn:',pg.locator('#mockDrill').count())
    pg.tap('#mockDrill'); print('DRILL:',pg.inner_text('#imode'),'|',pg.inner_text('#chalInfo h3'))
    pg.tap('[data-cm="sim"]'); print('SIMS:',pg.locator('[data-sim]').count())
    pg.locator('[data-sim="tls"]').tap(); print('SIM:',pg.inner_text('#simUI')[:120].replace('\n',' | '))
    pg.tap('nav [data-v="me"]'); print('PLAN wk1 items:',pg.locator('#plan90 details').first.locator('li').count())
    b.close(); print('ERRORS',errs)
