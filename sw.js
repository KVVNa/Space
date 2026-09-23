// Service Worker for pick-duel-v77 - offline support with smart caching
const CACHE_NAME = 'pick-duel-v77';

// Install: skip waiting for immediate activation
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

// Activate: drop any cache from a previous build, then take over open pages
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first for the HTML document (so a reload always tries to get
// the latest build first), cache-first for everything else (so offline play
// still works once the page has loaded once).
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isDocument = request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/';

  if (isDocument) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) =>
          cached || new Response('Offline - page not cached', { status: 503, statusText: 'Service Unavailable' })
        ))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') return response;
          const copy = response.clone();
          cache.put(request, copy);
          return response;
        }).catch(() => new Response('Offline - resource not available', { status: 503, statusText: 'Service Unavailable' }));
      })
    )
  );
});
