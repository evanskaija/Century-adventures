const CACHE_NAME = 'century-adventures-cache-v16';
const PRECACHE_URLS = [
  'index.html',
  'index.css',
  'index.js',
  'manifest.json',
  'assets/logo.png'
];

/* ── Install: precache core assets & take over immediately ── */
self.addEventListener('install', event => {
  self.skipWaiting();               // Activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});

/* ── Activate: purge ALL old caches & claim clients ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())   // Take control of all open pages
  );
});

/* ── Fetch: NETWORK-FIRST strategy ── */
// Always try the network first so updates show immediately.
// Fall back to cache only when offline.
self.addEventListener('fetch', event => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Got a fresh response — cache it for offline use
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed — serve from cache (offline mode)
        return caches.match(event.request);
      })
  );
});
