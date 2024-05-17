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
                'idb-index.js',
                'javascripts/chat_client.js',
                '/stylesheets/style.css',
                '/stylesheets/media.css',
                '/javascripts/create.js',
                '/javascripts/locationname2.js',
                '/javascripts/filter.js'
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch {
            console.log("error occurred while caching...")
        }

    })());
});

self.addEventListener('activate', async (event) => {
    console.log('[Service Worker] : Activated');
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if (cache !== "static") {
                    console.log('Service Worker: Removing old cache: ' + cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
    const status = await navigator.permissions.query({name: 'periodic-background-sync'});
    console.log(status)
    if (status.state === 'granted') {
        console.log("periodic sync permission granted");
        await registerPeriodicSync();
    }
});

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const cache = await caches.open("static");
        try {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                console.log('Service Worker: Fetching from Cache: ', event.request.url);
                return cachedResponse;
            }

            const response = await fetch(event.request);
            if (event.request.url.includes('/plant/')) {
                cache.put(event.request, response.clone());
            }
            console.log('Service Worker: Fetching from URL: ', event.request.url);
            return response;
        } catch (err) {
            console.error('Service Worker: Fetch failed: ', err);
            return new Response('Network error occurred', { status: 408 });
        }
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
                        deleteSyncPost(syncPostDB, Number(syncPost.get("id")));
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
