const Plant = require("../models/plant");

exports.init = function(io) {
    io.on('connection', function(socket) {
        try {
            socket.on('join chat', function(userId) {
                console.log('joined chat: ', userId);
                io.emit('joined', userId);
            });
            socket.on('chat', async function(plantId, userId, chatText) {
                try {
                    const plant = await Plant.findOneAndUpdate(
                        { _id: plantId },
                        { $push: { chatMessages: { message: chatText, username: userId, datetime: new Date() }}},
                        { new: true }
                    );
                    io.emit('chat', userId, chatText);
                } catch (err) {
                    console.error('Error updating plant with chat message', err)
                }
            });
            socket.on('disconnect', function() {
                console.log('someone disconnected');
            });
        } catch(e) {
            console.log(e);
        }
    });
};
