importScripts('/idb-utility.js');

self.addEventListener('install', (event) => {
    console.log('[Service Worker] : Installed');
    event.waitUntil((async () => {
        console.log('Service Worker: Caching App Shell at the moment......');

        try {
            const cache = await caches.open("static");
            await cache.addAll([
                '/',
                '/create/',
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

// self.addEventListener('sync', event => {
//     if (event.tag === 'sync-post') {
//         console.log('Service Worker: Syncing new Posts');
//         openSyncPostsIDB().then((syncPostDB) => {
//             getAllSyncPosts(syncPostDB).then((syncPosts) => {
//                 for (const syncPost of syncPosts) {
//                     console.log('Service Worker: Syncing new : ', syncPost);
//                     console.log(syncPost.text);
//                     // Create a FormData object
//                     const formData = new URLSearchParams();
//
//                     // Iterate over the properties of the JSON object and append them to FormData
//                     formData.append("text", syncPost.text);
//
//                     // Fetch with FormData instead of JSON
//                     fetch('http://localhost:3000/create', {
//                         method: 'POST',
//                         body: formData,
//                         headers: {
//                             'Content-Type': 'application/x-www-form-urlencoded',
//                         },
//                     }).then(() => {
//                         console.log('Service Worker: Syncing new Post: ', syncPost, ' done');
//                         deleteSyncPostFromIDB(syncPostDB, syncPost.id);
//                         // Send a notification
//                         self.registration.showNotification('Post Synced', {
//                             body: 'Post synced successfully!',
//                         });
//                     }).catch((err) => {
//                         console.error('Service Worker: Syncing new Post: ', syncPost, ' failed');
//                     });
//                 }
//             });
//         });
//     }
// });
