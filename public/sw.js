importScripts('/idb-utility.js', '/fetch.js');

self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil((async () => {
        console.log('Service Worker: Caching App Shell at the moment......');

        try {
            const cache = await caches.open("static");
            await cache.addAll([
                '/',
                '/create/',
                'fetch.js',
                'idb-utility.js',
                '/stylesheets/style.css',
                '/stylesheets/media.css',
                '/javascripts/create.js',
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch {
            console.log("error occurred while caching...")
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

self.addEventListener('sync', event => {
    if (event.tag === 'sync-post') {
        console.log('Service Worker: Syncing new Posts');

        openSyncPostsIDB().then((syncPostDB) => {
            getAllSyncPosts(syncPostDB).then((syncPosts) => {
                for (const syncPost of syncPosts) {
                    console.log('Service Worker: Syncing new Post: ', syncPost);
                    postCreatePostForm(syncPost).then(() => {
                        deleteSyncPost(syncPostDB, syncPost.get("id"));
                        console.log('Service Worker: Syncing new Post: ', syncPost, ' done');
                        self.registration.showNotification('Post Synced', {
                            body: 'Post synced successfully!',
                        });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new Post: ', syncPost, ' failed');
                    });
                }
            });
        });
    }
});
