import sys, json, io, traceback, contextlib
req = json.loads(sys.stdin.read())
g = {'__name__': '__main__'}
g.update(req.get('vars', {}))
chunks = req['chunks']
out = io.StringIO(); err = None
for i, code in enumerate(chunks):
    last = i == len(chunks) - 1
    buf = out if last else io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(code, '<exec>', 'exec'), g)
    except BaseException:
        if last: err = traceback.format_exc()
        else: err = traceback.format_exc(); break
vars_out = {k: v for k, v in g.items() if k.startswith('_') and not k.startswith('__') and isinstance(v, str)}
print(json.dumps({'out': out.getvalue(), 'err': err, 'vars': vars_out}))
