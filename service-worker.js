const CACHE_NAME = 'market-pulse-v6';
const ASSETS = [
    './',
    './index.html',
    './data.js',
    './security.js',
    './manifest.json',
    './app_icon.png',
    './offline.html'
];

// Install - cache assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch - network first with cache fallback
self.addEventListener('fetch', (e) => {
    // Skip non-GET requests
    if (e.request.method !== 'GET') return;

    // Skip API requests (don't cache external data)
    if (e.request.url.includes('api.') || e.request.url.includes('feeds.')) {
        e.respondWith(fetch(e.request));
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Clone and cache successful responses
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                return response;
            })
            .catch(() => {
                // Fallback to cache, then offline page
                return caches.match(e.request).then((cached) =>
                    cached || caches.match('./offline.html')
                );
            })
    );
});
