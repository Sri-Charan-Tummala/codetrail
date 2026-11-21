import sys,time,os; sys.path.insert(0,os.path.dirname(__file__))
from emu import start
from playwright.sync_api import sync_playwright
R="()=>!document.getElementById('run').disabled"
with sync_playwright() as p:
    b,pg,errs=start(p)
    pg.tap('nav [data-v="play"]'); pg.evaluate("()=>pick('f_bsearch')")
    print('before:',pg.locator('#chalInfo [data-showsol], #hintBtn').count(),'help buttons')
    pg.tap('#imode'); print('after:',pg.locator('#chalInfo [data-showsol], #hintBtn').count(),'help buttons |',pg.inner_text('#imode'),'|',pg.inner_text('#chalInfo')[-90:].replace('\n',' '))
    pg.type('#ed','# thinking\n'); pg.wait_for_timeout(2200); print('clock:',pg.inner_text('#iclock'))
    pg.fill('#ed','def search(nums, target):\n    return nums.index(target)\n'); pg.tap('#run'); pg.wait_for_function(R,timeout=20000)
    print('wrong:',pg.inner_text('#verdict'),'| sol button:',pg.locator('#explain [data-showsol]').count())
    pg.fill('#ed',"def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n")
    pg.tap('#run'); pg.wait_for_function(R,timeout=20000); print('right:',pg.inner_text('#verdict'))
    pg.evaluate("()=>pick('f_bsearch')"); print('best shown:',pg.inner_text('#chalInfo')[-40:].replace('\n',' '))
    pg.tap('nav [data-v="me"]'); t=pg.inner_text('#meSkill'); print('progress:',t[t.find('Interview'):][:140].replace('\n',' | '))
    pg.tap('nav [data-v="play"]'); None
    b.close(); print('PAGE ERRORS',errs)
