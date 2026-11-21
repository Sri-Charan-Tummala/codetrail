import sys,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
SET="""(spec)=>{const s=JSON.parse(localStorage.getItem('codetrail')||'{}');const D=o=>{const d=new Date();d.setDate(d.getDate()+o);return d.toLocaleDateString('en-CA')};
s.done=s.done||{};s.p90=spec.start==null?null:D(spec.start);s.p90p=(spec.p||[]).map(([a,b])=>[D(a),b==null?null:D(b)]);localStorage.setItem('codetrail',JSON.stringify(s))}"""
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.evaluate(SET,{'start':None}); pg.reload()
    print('1 not started:',pg.inner_text('.ttxt'))
    pg.locator('.ttxt [data-p90="start"]').tap(); print('2 started:',pg.inner_text('.ttxt span').split('·')[0])
    pg.evaluate(SET,{'start':-10,'p':[[-6,-4]]}); pg.reload()
    print('3 10 days ago, 3 paused:',pg.inner_text('.ttxt span'))
    pg.tap('nav [data-v="me"]'); print('   cal states:',sorted(set(pg.evaluate("()=>[...document.querySelectorAll('#meCal .cd')].map(b=>b.className.split(' ')[1])"))))
    print('   paused cells:',pg.locator('#meCal .cd.pause').count(),'| missed cells:',pg.locator('#meCal .cd.miss').count())
    pg.locator('#meCal [data-p90="pause"]').tap(); print('4 after pause:',pg.inner_text('#meCal h3').split('\n')[0],'| resume btn:',pg.locator('#meCal [data-p90="resume"]').count())
    pg.locator('#meCal [data-p90="resume"]').tap(); print('5 resumed same day:',pg.inner_text('#meCal h3').split('\n')[0])
    pg.evaluate(SET,{'start':-10,'p':[[-2,None]]}); pg.reload(); print('6 paused since 2 days ago:',pg.inner_text('.ttxt span'))
    pg.tap('nav [data-v="me"]'); pg.locator('#meCal [data-p90="resume"]').tap(); print('7 resumed:',pg.inner_text('#meCal h3').split('\n')[0],'|',pg.inner_text('#meCal .note').split('·')[0])
    print('   plan week:',pg.inner_text('#plan90 h3'))
    b.close(); print('ERRORS',errs)
