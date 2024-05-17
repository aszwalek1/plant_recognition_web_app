const Plant = require("../models/plant");

exports.init = function(io) {
    io.on('connection', function(socket) {
        try {
            socket.on('join chat', function(plantID, userID) {
                io.emit('joined chat', plantID, userID);
            });

            socket.on('send chat', async function(plantID, userID, chatText) {
                try {
                    const plant = await Plant.findOneAndUpdate(
                        { _id: plantID },
                        { $push: { chatMessages: { message: chatText, username: userID, datetime: new Date() }}},
                        { new: true }
                    );
                    io.emit('sent chat', plantID , userID, chatText);
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
