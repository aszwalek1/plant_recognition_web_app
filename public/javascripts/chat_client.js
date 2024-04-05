let username = null;
let socket = io();

function init() {
    document.getElementById('joinChat').style.display = 'block';
    document.getElementById('chatInterface').style.display = 'none';

    document.getElementById('connectToChat').addEventListener('click', connectToChat)

    socket.on('joined', function(userId) {
        if(userId === username) {
            hideUsernameInput();
        } else {
            writeOnHistory('<b>' + userId + '</b>' + ' joined the chat ')
        }
    });

    socket.on('chat', function(userId, chatText) {
        let who = userId
        if(userId === username) who = 'Me';
        writeOnHistory('<br>' + who + ':</b> ' + chatText);
    });
}

function sendMessage() {
    let message = document.getElementById('chatInput').value;
    socket.emit('chat', username, message);
}

function connectToChat() {
    username = document.getElementById('username').value;
    console.log(username);
    socket.emit('join chat', username);
}

function writeOnHistory(text) {
    let history = document.getElementById('chatHistory');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chatInput').value = '';
}

function hideUsernameInput() {
    document.getElementById('joinChat').style.display = 'none';
    document.getElementById('chatInterface').style.display = 'block';
}