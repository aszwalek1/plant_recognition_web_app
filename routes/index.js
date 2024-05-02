var express = require('express');
var router = express.Router();
let plantsController = require('../controllers/plants')

/** GET home page. */
router.get('/', function (req, res, next) {
    let plantsPromise = plantsController.getAll()

    plantsPromise.then(plantsStr => {
        let plants = JSON.parse(plantsStr)
        res.render('index', {title: 'Plant Recognition', plants: plants})
    })
});

/** POST request to filter plants on home page */
router.post('/', async function(req, res, next) {
    try {
        const filterFormData = req.body;
        const filteredPlants = await plantsController.filterPlants(filterFormData);

        res.render('index', {
            title: 'Plant Recognition',
            plants: filteredPlants,
            currentFilters:filterFormData
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
