import sys,json,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import handler, APP
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ['CHROME']) if os.environ.get('CHROME') else p.chromium.launch(); ctx=b.new_context(**p.devices['iPhone 13']); ctx.route('**/*',handler)
    pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.clock.install(); pg.goto(APP)
    sec=lambda: pg.evaluate("()=>{const s=JSON.parse(localStorage.getItem('codetrail'));const g=(s.log||{})[new Date().toLocaleDateString('en-CA')];return g?g.sec:{}}")
    pg.clock.run_for(120000); print('1 idle on home 2 min:',sec())
    pg.tap('#hero [data-open]')
    for i in range(6): pg.clock.run_for(20000); pg.tap('#stage')   # active 2 min
    print('2 active lesson 2 min:',sec())
    pg.clock.run_for(300000); print('3 then idle 5 min in lesson:',sec())
    pg.tap('#xBtn'); pg.tap('nav [data-v="qa"]'); pg.tap('#reveal'); pg.clock.run_for(15000); pg.tap('[data-r="got"]'); pg.clock.run_for(10000)
    print('4 cards:',sec())
    # focus timer
    pg.tap('#focusChip'); pg.clock.run_for(25*60000); print('5 focus chip:',pg.inner_text('#focusTxt'))
    pg.tap('#focusChip'); pg.tap('[data-fk="Hands-on lab"]'); pg.fill('#fxNote','KodeKloud CKA etcd backup lab'); pg.tap('[data-fx="save"]')
    print('6 after focus save:',{k:round(v) for k,v in sec().items()})
    pg.tap('nav [data-v="me"]'); print('7 calendar:',pg.inner_text('#meCal')[:500].replace('\n',' | '))
    # yesterday red: set p90 to 3 days ago
    pg.evaluate("()=>{const s=JSON.parse(localStorage.getItem('codetrail'));const d=new Date();d.setDate(d.getDate()-3);s.p90=d.toLocaleDateString('en-CA');localStorage.setItem('codetrail',JSON.stringify(s))}")
    pg.reload(); pg.tap('nav [data-v="me"]'); print('8 states:',pg.evaluate("()=>[...document.querySelectorAll('#meCal .cd.miss, #meCal .cd.met, #meCal .cd.part')].map(b=>b.dataset.cal+':'+b.className.split(' ')[1])"))
    pg.locator('#meCal .cd.miss').first.tap(); print('9 missed day detail:',pg.inner_text('#calDay')[:80].replace('\n',' | '))
    None
    pg.tap('nav [data-v="learn"]'); print('10 week strip:',pg.evaluate("()=>[...document.querySelectorAll('#weekStrip .wd')].map(x=>x.className.replace('wd ',''))"),pg.inner_text('.today').replace('\n',' '))
    None
    b.close(); print('ERRORS',errs)
