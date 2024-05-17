/**
 * createPosts copies a post template div and creates new posts in the posts-grid div on the index page
 * It sets attributes of each post
 *
 * @param {IDBDatabase} db - The IndexedDB database object for managing posts.
 * @param {Array} newPosts - An array of objects representing new posts to be displayed.
 * Each object should contain properties such as imagePath, name, _id, location, date, and nameStatus.
 *
 */

function createPosts(db, newPosts) {
    const postsList = document.getElementById("posts-grid")
    for(const plant of newPosts) {
        const copy = document.getElementById("post-template").cloneNode(true);
        copy.hidden = false;
        copy.removeAttribute("id");
        copy.querySelector(".image").src = plant.imagePath;
        copy.querySelector(".name").textContent = plant.name;
        copy.querySelector(".details").href = `/plant/${plant._id}`;
        copy.querySelector("#location_").value = plant.location;
        copy.querySelector("#plant-location_").textContent = plant.location;

        let date = new Date(plant.date)
        copy.querySelector(".date").textContent = date.toLocaleString()
        copy.querySelector(".status").textContent = plant.nameStatus

        postsList.appendChild(copy)
    }

}

// Register service worker to control making site work offline

window.onload = function () {
    console.log("onload");
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }

    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted") {
            // Notifications are allowed, you can proceed to create notifications
            // Or do whatever you need to do with notifications
        } else if (Notification.permission !== "denied") {
            // If the user hasn't been asked yet or has previously denied permission,
            // you can request permission from the user
            Notification.requestPermission().then(function (permission) {
                // If the user grants permission, you can proceed to create notifications
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Post App",
                                {body: "Notifications are enabled!"})
                                .then(r =>
                                    console.log(r)
                                );
                        });
                }
            });
        }
    }
    // fetch the plants when the page is online and add them to indexeddb
    fetch('http://localhost:3000/plants')
        .then(function (res) {
            console.log("fetch");
            return res.json();
        }).then(async function (newPosts) {
        const db = await openPostsIDB();
        createPosts(db, newPosts);
        await deleteAllExistingPostsFromIDB(db);
        await addPost(db, newPosts);
        console.log("All new posts added to IDB");

    }).catch(async function (err) {
        console.log("Page is offline");
        const db = await openPostsIDB();
        const posts = await getAllPosts(db);
        createPosts(db, posts);
    });

}