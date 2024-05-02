console.log('Service Worker Called...');

self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil(
        caches.open('core').then((cache) => {
            return cache.addAll([
                '/create'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] : Activated');
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker]: Fetching');
    const request = event.request;
    if (request.url.includes('/create')) {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(request).then((cachedResponse) => {
                    return cachedResponse || fetch(request);
                });
            })
        );
    } else {
        event.respondWith(fetch(request));
    }
});

