let username = null;
let socket = io();

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

function sendMessage(plantId) {
    let message = document.getElementById('chatInput').value;
    if (message.length < 1) {
        alert("Message cannot be empty!");
        return;
    }
    socket.emit('chat', plantId, username, message);
}

function connectToChat() {
    username = document.getElementById('username').value;
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