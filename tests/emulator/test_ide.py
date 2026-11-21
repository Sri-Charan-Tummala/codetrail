import sys,time,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
W="()=>!document.getElementById('ideRun').disabled"
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="play"]'); pg.tap('[data-cm="ide"]')
    print('TABS:',pg.inner_text('#ftabs').replace('\n',' '))
    None
    pg.tap('#ideRun'); pg.wait_for_function(W,timeout=30000)
    print('RUN:',pg.inner_text('#ideVerdict'),'|',pg.inner_text('#ideOut').replace('\n',' / '))
    pg.tap('#ideTest'); pg.wait_for_function(W,timeout=30000)
    print('TESTS:',pg.inner_text('#ideVerdict'),'|',pg.inner_text('#ideExplain')[:300].replace('\n',' / '))
    # break utils and see error + goto
    pg.tap('[data-file="utils.py"]')
    pg.evaluate("()=>{const t=document.getElementById('ide');t.value=t.value.replace('int(status)','int(stats)');t.dispatchEvent(new Event('input'))}")
    pg.tap('[data-file="main.py"]'); pg.tap('#ideRun'); pg.wait_for_function(W,timeout=30000)
    print('ERR:',pg.inner_text('#ideVerdict'),'|',pg.inner_text('#ideExplain')[:250].replace('\n',' / '))
    pg.tap('#ideExplain [data-goto]'); print('GOTO active:',pg.inner_text('#ftabs [aria-pressed=true]'),'sel:',pg.evaluate("()=>{const t=document.getElementById('ide');return t.value.slice(t.selectionStart,t.selectionEnd)}"))
    # editor typing: auto-indent, brackets
    pg.tap('#ideNew'); pg.fill('#ideName','scratch.py'); pg.tap('#ideFormOk')
    pg.tap('#ide'); pg.keyboard.type('def f(x'); pg.keyboard.type('):'); pg.keyboard.press('Enter'); pg.keyboard.type('return x*2'); pg.keyboard.press('Enter'); pg.keyboard.type('print(f(21')
    print('TYPED:',repr(pg.evaluate("()=>document.getElementById('ide').value")))
    pg.tap('#ideRun'); pg.wait_for_function(W,timeout=30000); print('SCRATCH:',pg.inner_text('#ideOut'))
    print('HL spans:',pg.evaluate("()=>document.querySelectorAll('#ideHl i').length"))
    # template + args
    pg.tap('#ideTplBtn'); pg.tap('[data-tpl="1"]'); pg.tap('#ideUI summary'); pg.fill('#ideArgs','--env prod --dry-run web1 web2')
    pg.tap('#ideRun'); pg.wait_for_function(W,timeout=30000); print('CLI:',pg.inner_text('#ideOut').replace('\n',' / '))
    for i in [0,2,3,4,5,6]:
        pg.tap('#ideTplBtn'); pg.tap(f'[data-tpl="{i}"]'); pg.tap('#ideTest' if i==6 else '#ideRun'); pg.wait_for_function(W,timeout=30000)
        print('TPL',i,':',pg.inner_text('#ideVerdict'),'|',pg.inner_text('#ideOut')[:120].replace('\n',' / '))
    # file written by program
    pg.tap('#ideNew'); pg.fill('#ideName','writer.py'); pg.tap('#ideFormOk')
    pg.fill('#ide',"with open('report.csv','w') as f:\n    f.write('host,ok\\nweb1,1\\n')\nprint('saved')\n"); pg.tap('#ideRun'); pg.wait_for_function(W,timeout=30000)
    print('WRITE:',pg.inner_text('#ideExplain'),'| tabs:',pg.inner_text('#ftabs').replace('\n',' '))
    # infinite loop + stop
    pg.fill('#ide','while True:\n    pass\n'); t=time.time(); pg.tap('#ideRun'); pg.wait_for_timeout(1500); pg.tap('#ideStop')
    print('STOP:',pg.inner_text('#ideVerdict'),round(time.time()-t,1))
    pg.tap('#ideRun'); pg.wait_for_function(W,timeout=40000); print('TIMEOUT:',pg.inner_text('#ideVerdict'))
    # persistence
    pg.reload(); pg.tap('nav [data-v="play"]'); pg.tap('[data-cm="ide"]'); print('AFTER RELOAD tabs:',pg.inner_text('#ftabs').replace('\n',' '))
    # drills still work after IDE (cwd changed)
    pg.tap('[data-cm="drills"]'); pg.evaluate("()=>pick('c1')"); pg.fill('#ed','s = "devops is fun"\nprint(" ".join(s.split()[::-1]))\n'); pg.tap('#run'); pg.wait_for_function("()=>!document.getElementById('run').disabled",timeout=30000); print('DRILL:',pg.inner_text('#verdict'))
    pg.tap('[data-cm="ide"]'); pg.tap('[data-file="main.py"]'); None
    b.close(); print('PAGE ERRORS',errs)
