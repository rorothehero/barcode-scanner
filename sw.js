const CACHE = 'scanner-v1';
const URLS = ['/barcode-scanner/', '/barcode-scanner/index.html', '/barcode-scanner/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(URLS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      if (r) return r;
      const url = new URL(e.request.url);
      if (url.search) { url.search = ''; return caches.match(url.toString()).then((r2) => r2 || fetch(e.request)); }
      return fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const c = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, c));
        }
        return res;
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => { if (k !== CACHE) return caches.delete(k); }))));
});