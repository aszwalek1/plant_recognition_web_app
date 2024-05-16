const express = require('express');
const router = express.Router();

const plants = require("../controllers/plants");
const dbpedia = require("../controllers/dbpedia")

/** GET plant page */
router.get('/:id', async (req, res, next) => {
    const plantPromise = plants.get(req.params.id);

    plantPromise.then(plantStr => {
        if (plantStr) {
            const plant = JSON.parse(plantStr)
            const linkedDataPromise = dbpedia.queryPlant(plant.name)

            linkedDataPromise.then(linkedData => {
                res.render('plant', {title: "View Plant", plant: plant, plantLinkedData: linkedData});
            })

        } else {
            res.render('error', {title: 'Plant could not be found'})
        }

    })
});

module.exports = router;
