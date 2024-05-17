

function syncPosts() {
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-post")
    }).then(() => {
        console.log("Sync registered");
    })
}

/**
 * Adds a post to a 'sync-post' indexedDB of posts to that need to be synced.
 * @param syncPostIDB the 'sync-post' indexedDB
 * @param postData the post, as a FormData object
 */
function addPendingPost(syncPostIDB, postData) {
    const transaction = syncPostIDB.transaction(["sync-posts"], "readwrite")
    const postStore = transaction.objectStore("sync-posts")

    let postDataObj = {}
    for (const [key, value] of postData) {
        postDataObj[key] = value
    }

    const addRequest = postStore.add(postDataObj)
    addRequest.addEventListener("success", () => {
        // make sure post is in sync posts idb before registering sync
        const getRequest = postStore.get(addRequest.result)
        getRequest.addEventListener("success", () => {
            console.log("Successfully saved sync post: " + JSON.stringify(getRequest.result))
        })
        getRequest.addEventListener("error", () => {
            console.error("Error saving sync post");
        });
    });
}

/**
 * Adding posts to the 'post' indexedDB.
 * @param postIDB the indexedDB
 * @param posts the post
 */
function addPost(postIDB, posts) {
    return new Promise((resolve, reject) => {
        const transaction = postIDB.transaction(["posts"], "readwrite");
        const postStore = transaction.objectStore("posts");

        const addPromises = posts.map(post => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = postStore.add(post);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + post);
                    const getRequest = postStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + JSON.stringify(getRequest.result));
                        resolveAdd();
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function deleteAllExistingPostsFromIDB(postIDB) {
    const transaction = postIDB.transaction(["posts"], "readwrite");
    const postStore = transaction.objectStore("posts");
    const clearRequest = postStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}


function getAllPosts(postIDB) {
    return new Promise((resolve, reject) => {
        const transaction = postIDB.transaction(["posts"]);
        const postStore = transaction.objectStore("posts");
        const getAllRequest = postStore.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

/**
 * Gets all posts in a 'sync-post' indexedDB, i.e. all the posts that need to be synced.
 * @param syncPostIDB the 'sync-post' indexedDB
 * @return {Promise<[FormData]>}
 */
function getAllSyncPosts(syncPostIDB) {
    return new Promise((resolve, reject) => {
        const transaction = syncPostIDB.transaction(["sync-posts"]);
        const postStore = transaction.objectStore("sync-posts");
        const getAllRequest = postStore.getAll();

        getAllRequest.addEventListener("success", () => {
            const postsObj = getAllRequest.result
            let postsFormData = [];

            for (const postObj of postsObj) {
                let postFormData = new FormData()
                for (const field in postObj) {
                    postFormData.append(field, postObj[field])
                }
                postsFormData.push(postFormData)
            }
            resolve(postsFormData);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

/**
 * Deletes a post with some key in a 'sync-post' indexedDB.
 * @param syncPostIDB the 'sync-post' indexedDB
 * @param key the key of the post in the idb
 */
function deleteSyncPost(syncPostIDB, key) {
    const transaction = syncPostIDB.transaction(["sync-posts"], "readwrite")
    const postStore = transaction.objectStore("sync-posts")
    const deleteRequest = postStore.delete(key)

    deleteRequest.addEventListener("success", () => {
        console.log("Deleted sync post with id:" + key)
    })
}

function openSyncPostsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-posts", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sync-posts', {keyPath: 'id', autoIncrement: true});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function openPostsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("posts", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('posts', {keyPath: '_id'});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function addPostToIDB(plantData) {
    return new Promise((resolve, reject) => {
        const transaction = postIDB.transaction(["posts"], "readwrite");
        const postStore = transaction.objectStore("posts");

        const addRequest = postStore.add(plantData);
        addRequest.addEventListener("success", () => {
            console.log("Plant added to IndexedDB");
            resolve();
        });
        addRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}