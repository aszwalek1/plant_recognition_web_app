const Plant = require("../models/plant");

exports.init = function(io) {
    io.on('connection', function(socket) {
        // socket.on('join chat', function(userId) {
        //     console.log('User joined the chat:', userId);
        //     io.emit('joined', userId);
        // });
        //
        // socket.on('chat', async function(plantId, message, username) {
        //     console.log("chat")
        //     try {
        //         const plant = await Plant.findOneAndUpdate(
        //             { _id: plantId },
        //             { $push: { chatMessages: { message, username, datetime: new Date()}}},
        //             { new: true }
        //         );
        //
        //         if (!plant) {
        //             console.error('Plant not found');
        //             return;
        //         }
        //         console.log('Plant found:', plant)
        //         io.emit('chat', username, message);
        //     } catch (error) {
        //         console.error('Error saving message:', error);
        //     }
        // });
        // socket.on('disconnect', function() {
        //     console.log('A user disconnected');
        //
        // });
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
