const CACHE_NAME = 'codexa-shell-v3';
const APP_SHELL = [
    './',
    './index.html',
    './css/styles.css?v=20260828-3',
    './js/main.js?v=20260828-3',
    './images/favicon.svg',
    './images/logo-codexa.png',
    './images/icon-192.png',
    './images/icon-512.png',
    './images/apple-touch-icon.png',
    './manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) { return cache.addAll(APP_SHELL); })
            .then(function() { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function(cacheName) { return cacheName !== CACHE_NAME; })
                        .map(function(cacheName) { return caches.delete(cacheName); })
                );
            })
            .then(function() { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(function() { return caches.match('./index.html'); })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {
            const networkResponse = fetch(event.request)
                .then(function(response) {
                    if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
                        const responseCopy = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, responseCopy); });
                    }
                    return response;
                })
                .catch(function() { return cachedResponse; });

            return cachedResponse || networkResponse;
        })
    );
});
