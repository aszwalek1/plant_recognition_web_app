exports.init = function(io) {
    io.on('connection', function(socket) {
        try {
            socket.on('join chat', function(userId) {
                console.log('join chat');
                io.emit('joined', userId);
            });
            socket.on('chat', function(userId, chatText) {
                io.emit('chat', userId, chatText);
            });
            socket.on('disconnect', function() {
                console.log('someone disconnected');
            });
        } catch(e) {
            console.log(e);
        }
    });
}
