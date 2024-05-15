/**
 * Adds a post to a 'sync-post' indexedDB of posts to that need to be synced. 
 * @param syncPostIDB the indexedDB
 * @param postData the post, as a FormData object
 */
function addPendingPost(syncPostIDB, postData) {
    const transaction = syncPostIDB.transaction(["sync-posts"], "readwrite")
    const postStore = transaction.objectStore("sync-posts")

    let postDataObj = {}
    for ([key, value] of postData) {
        postDataObj[key] = value
    }

    postStore.add(postDataObj)
    // TODO register sync
}

/**
 * Add a post to the 'post' indexedDB.
 * @param postIDB the indexedDB
 * @param post the post
 */
function addPost(postIDB, post) {
    return new Promise((resolve, reject) => {
        const transaction = postIDB.transaction(["post"], "readwrite");
        const postStore = transaction.objectStore("post");

        const addPromises = post.map(post => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = postStore.add(post);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + post);
                    const getRequest = postStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        console.log("Found " + JSON.stringify(getRequest.result));
                        insertPostInList(getRequest.result);
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

function getAllPendingPosts(syncPostIDB) {
    return new Promise((resolve, reject) => {
        const transaction = syncPostIDB.transaction(["sync-posts"]);
        const postStore = transaction.objectStore("sync-posts");
        const getAllRequest = postStore.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}


function deleteSyncPostFromIDB(syncPostIDB, id) {
    const transaction = syncPostIDB.transaction(["sync-posts"], "readwrite")
    const postStore = transaction.objectStore("sync-posts")
    const deleteRequest = postStore.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted " + id)
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
            postIDB = event.target.result;
            resolve(postIDB);
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