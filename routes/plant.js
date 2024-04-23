var express = require('express');
var router = express.Router();
const Plant = require('../models/plant');

/** GET plant page */
router.get('/:id', async (req, res, next) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).send('Plant not found');
        }

        // Construct options object with plant details
        const options = {
            title: plant.name,
            //postTime: plant.createdAt.toLocaleTimeString(), // Example time formatting
            postDate: plant.date, // Example date formatting
            postImageURL: plant.imagePath,
            postDetails: [plant.description], // You can add more details here if needed
            postLocation: plant.location,
            postUsername: plant.username,
            postLeaves: plant.characteristics.hasLeaves,
            postSeeds: plant.characteristics.hasSeeds,
            postFlowers: plant.characteristics.hasFlowers,
            postFruit: plant.characteristics.hasFruit,
            postSun: plant.characteristics.sunExposure,
        };

        res.render('plant', options);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching plant details');
    }
});

module.exports = router;
