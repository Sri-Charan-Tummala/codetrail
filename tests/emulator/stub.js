self.loadPyodide=async()=>{let out=()=>{};
 const mk=()=>{const m={},o={set:(k,v)=>{m[k]=v},get:k=>m[k],destroy(){},_m:m,_c:[]};return o};
 return{setStdout(o){out=o.batched},setStderr(){},globals:{get:()=>mk},async loadPackagesFromImports(){},
  async runPythonAsync(code,opts){const ns=opts.globals;ns._c.push(code);
   const r=await fetch('https://pybridge.test/run',{method:'POST',body:JSON.stringify({chunks:ns._c,vars:ns._m})});
   const d=await r.json();if(d.out){const ls=d.out.split('\n');if(ls[ls.length-1]==='')ls.pop();ls.forEach(l=>out(l))}
   Object.assign(ns._m,d.vars);if(d.err)throw new Error(d.err)}}};
