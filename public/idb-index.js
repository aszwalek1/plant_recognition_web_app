

function createPosts(db, newPosts) {
    const postsList = document.getElementById("posts-grid")
    // for (const postListElem of Array.from(postsList)) {
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
    // }
}
    // if (post.text) {
    //     const copy = document.getElementById("post_template").cloneNode()
    //     copy.removeAttribute("id") // otherwise this will be hidden as well
    //     copy.innerText = post.text
    //     copy.setAttribute("data-post-id", post.id)
    //
    //     // Insert sorted on string text order - ignoring case
    //     const postlist = document.getElementById("post_list")
    //     const children = postlist.querySelectorAll("li[data-post-id]")
    //     let inserted = false
    //     for (let i = 0; (i < children.length) && !inserted; i++) {
    //         const child = children[i]
    //         const copy_text = copy.innerText.toUpperCase()
    //         const child_text = child.innerText.toUpperCase()
    //         if (copy_text < child_text) {
    //             postlist.insertBefore(copy, child)
    //             inserted = true
    //         }
    //     }
    //     if (!inserted) { // Append child
    //         postlist.appendChild(copy)
    //     }
    // }


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
    fetch('http://localhost:3000/plants')
        .then(function (res) {
            console.log("fetch");
            return res.json();
        }).then(function (newPosts) {
        openPostsIDB().then((db) => {
            createPosts(db, newPosts)
            deleteAllExistingPostsFromIDB(db).then(() => {
                addPost(db, newPosts).then(() => {
                    console.log("All new posts added to IDB")
                })
            });
        });
    })

}