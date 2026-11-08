const C = 'fin-v1', A = ['./', './index.html', './icon.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(A)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(C).then(async c => {
    const cached = await c.match(e.request);
    const net = fetch(e.request).then(r => { c.put(e.request, r.clone()); return r; }).catch(() => cached);
    return cached || net;
  }));
});
