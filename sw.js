// CodeTrail offline cache.
// App files: network first (so updates arrive), cache when offline.
// Python (Pyodide from jsDelivr): cache first, saved the first time it downloads,
// or all at once with "Get Python ready for offline".
const CACHE = 'codetrail-v5';
const PY_CACHE = 'codetrail-py-0.26.4';
const SHELL = ['./', './index.html', './css/app.css', './js/personal-loader.js', './js/lessons.js', './js/content.js', './js/library.js', './js/app.js', './js/pyworker.js', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).then(() => fetch('./js/personal.js').then(r => r.ok && c.put('./js/personal.js', r)).catch(() => {}))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== PY_CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/pyodide/')) {
    e.respondWith(caches.open(PY_CACHE).then(c => c.match(e.request, { ignoreVary: true }).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok || r.type === 'opaque') c.put(e.request, r.clone());
      return r;
    }))));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
