import sys, json, io, traceback, contextlib
req = json.loads(sys.stdin.read())
import os, shutil, importlib.abc
# Persistent working directory, as in one long-lived Pyodide interpreter.
if req.get('cwd') and os.path.isdir(req['cwd']): os.chdir(req['cwd'])
# Pyodide's in-memory FS refuses to remove the directory you are standing in.
_rm = shutil.rmtree
def _rmtree(path, ignore_errors=False, *a, **k):
    here = os.path.realpath(os.getcwd()); tgt = os.path.realpath(path)
    if here == tgt or here.startswith(tgt + os.sep):
        if ignore_errors: return
        raise OSError(16, 'Device or resource busy', path)
    return _rm(path, ignore_errors, *a, **k)
shutil.rmtree = _rmtree
# Unvendored stdlib modules need loadPackagesFromImports first.
_blocked = set(req.get('unvendored', [])) - set(req.get('loaded', []))
class _Block(importlib.abc.MetaPathFinder):
    def find_spec(self, name, path=None, target=None):
        if name.split('.')[0] in _blocked:
            raise ModuleNotFoundError("No module named '%s' (load it with loadPackagesFromImports)" % name)
sys.meta_path.insert(0, _Block())
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
print(json.dumps({'out': out.getvalue(), 'err': err, 'vars': vars_out, 'cwd': os.getcwd()}))
