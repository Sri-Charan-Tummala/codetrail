/* Same-origin home for the Python worker, so the offline cache (sw.js) can serve Pyodide.
   The page sends the worker source as the first message; it replaces this handler. */
self.onmessage = e => { if (e.data && e.data.boot) (0, eval)(e.data.boot); };
