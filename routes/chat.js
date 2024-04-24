var express = require('express');
var Plant = require('../models/plant');
var router = express.Router();


router.post('/save-message-to-db', async(req, res, next) => {
    try {
        const { message, username } = req.body;

        // Get the plant by ID
        const plant = await findById(plantId);

        if (!plant) {
            return res.status(404).json({ error: 'Plant not found' });
        }

        // Save message to plant details
        plant.chatMessages.push({
            message: message,
            username: username,
            datetime: new Date()
        });
        // Save the updated plant
        await plant.save();
        res.sendStatus(200);

    } catch (error) {
        console.error('Error saving message to the database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;