/* Mimics two real-Pyodide behaviours the plain CPython bridge would hide:
   1) the interpreter (and its cwd / filesystem) persists between runs in one worker;
   2) unvendored packages such as sqlite3 import only after loadPackagesFromImports. */
self.loadPyodide=async()=>{let out=()=>{};const st={cwd:null,loaded:[]};const UNV=['sqlite3','lzma','ssl'];
 const mk=()=>{const m={},o={set:(k,v)=>{m[k]=v},get:k=>m[k],destroy(){},_m:m,_c:[]};return o};
 return{setStdout(o){out=o.batched},setStderr(){},globals:{get:()=>mk},async loadPackagesFromImports(src){for(const m of UNV)if(new RegExp('^\\s*(import|from)\\s+'+m+'\\b','m').test(src)&&!st.loaded.includes(m))st.loaded.push(m)},
  async runPythonAsync(code,opts){const ns=opts.globals;ns._c.push(code);
   const r=await fetch('https://pybridge.test/run',{method:'POST',body:JSON.stringify({chunks:ns._c,vars:ns._m,cwd:st.cwd,loaded:st.loaded,unvendored:UNV})});
   const d=await r.json();if(d.out){const ls=d.out.split('\n');if(ls[ls.length-1]==='')ls.pop();ls.forEach(l=>out(l))}
   Object.assign(ns._m,d.vars);if(d.cwd)st.cwd=d.cwd;if(d.err)throw new Error(d.err)}}};
