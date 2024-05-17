let plantID = null;
let username = null;
let socket = io();

window.onload = () => {
    document.getElementById('joinChat').hidden = false;
    document.getElementById('chatInterface').hidden = true;

    plantID = document.getElementById("plant_id").textContent
    document.getElementById('connectToChat').addEventListener('click', connectToChat)
    document.getElementById('chatSend').addEventListener('click', sendMessage)
}

socket.on('joined chat', (roomID, userId) => {
    if (roomID  === plantID) {
        if (userId === username) {
            hideUsernameInput();
        } else {
            writeOnHistory('<b>' + userId + '</b>' + ' joined the chat ')
        }
    }
});

socket.on('sent chat', (roomID, userID, chatText) => {
    if (roomID === plantID) {
        let who = userID
        if (userID === username) who = 'Me';
        writeOnHistory('<br>' + who + ':</b> ' + chatText);
    }
});

function connectToChat() {
    username = document.getElementById('username').value;
    if (socket.connected) {
        socket.emit('join chat', plantID, username);
    } else {
        // TODO
    }
}

function sendMessage() {
    let message = document.getElementById('chatInput').value;
    if (socket.connected) {
        socket.emit('send chat', plantID, username, message);
    } else {
        // TODO
    }
}

function hideUsernameInput() {
    document.getElementById('joinChat').hidden = true;
    document.getElementById('chatInterface').hidden = false;
}

function writeOnHistory(text) {
    let history = document.getElementById('chatHistory');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chatInput').value = '';
}


