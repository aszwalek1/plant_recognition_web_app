var express = require('express');
var router = express.Router();
const plants = require("../controllers/plants");

/** GET plant page */
router.get('/:id', async (req, res, next) => {
    const plantPromise = plants.get(req.params.id);
    plantPromise.then(
        plantStr => {
            if (plantStr) {
                let plant = JSON.parse(plantStr)
                res.render('plant', {title: plant.name, plant: plant});
            } else {
                res.render('error', {title: 'Plant could not be found'})
            }
        }
    )
});

module.exports = router;
