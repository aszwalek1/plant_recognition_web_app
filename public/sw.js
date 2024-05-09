console.log('Service Worker Called...');

self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open("static");
            cache.addAll([
                '/',
                '/create',
                // '/manifest.json',
                // '/javascripts/insert.js',
                // '/javascripts/index.js',
                // '/javascripts/idb-utility.js',
                '/stylesheets/style.css'
                // '/images/image_icon.png',
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch{
            console.log("error occured while caching...")
        }

    })());
});
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] : Activated');
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== "static") {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
});


self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open("static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
    })());
});

// self.addEventListener('sync', event => {
//     if(event.tag === 'sync-create') {
//         console.log('Syncing Created Post');
//         openSyncPostsDB().then((syncPostDB) => {
//             getAllSyncPosts(syncPostDB).then((syncPosts))
//         })
//     }
// });