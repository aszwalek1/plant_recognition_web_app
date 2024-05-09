navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
        console.log('SW registered: ', registration.scope);
        navigator.serviceWorker.ready
    },(registrationError) => {
        console.log('SW registration failed: ', registrationError);
    });

// if(navigator.online) {
//     fetch('https://localhost:3000/create')
//         .then(function(res) {
//             return res.json();
//         }).then(function(newPost) {
//             openIDB
//     })
// }