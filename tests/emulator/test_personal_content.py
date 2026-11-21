import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="qa"]'); pg.tap('[data-f="you"]'); pg.tap('#reveal'); print('YOU card:',pg.inner_text('#deck')[:260].replace('\n',' | '))
    pg.tap('nav [data-v="roles"]'); pg.tap('[data-rv="stories"]'); pg.locator('details.story').nth(7).locator('summary').tap()
    print('WHY story:',pg.input_value('#st-why-s')[:120])
    b.close(); print('ERRORS',errs)
