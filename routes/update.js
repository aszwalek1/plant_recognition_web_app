const express = require('express');
const router = express.Router();

// Import the Plant model
const Plant = require('../models/plant');

// Route to render the update form for a specific plant
router.get('/:id', async (req, res, next) => {
    try {
        // Find the plant by ID
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            // If plant not found, render a 404 page or redirect to an error page
            return res.status(404).send('Plant not found');
        }
        // Render the update form with the plant data
        res.render('update', { title: 'Update Plant', plant: plant });
    } catch (err) {
        // Handle errors
        next(err);
    }
});

// Route to handle the form submission and update the plant
router.post('/:id', async (req, res, next) => {
    try {
        // Find the plant by ID and update its details
        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlant) {
            // If plant not found, render a 404 page or redirect to an error page
            return res.status(404).send('Plant not found');
        }
        // Redirect to the plant details page or any other appropriate page
        res.redirect('/plant/' + updatedPlant._id);
    } catch (err) {
        // Handle errors
        next(err);
    }
});

module.exports = router;