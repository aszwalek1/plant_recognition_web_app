var express = require('express');
var router = express.Router();
let plantsController = require('../controllers/plants')

/* GET home page. */
router.get('/', function (req, res, next) {
    let plantsPromise = plantsController.getAll()

    plantsPromise.then(plantsStr => {
        let plants = JSON.parse(plantsStr)
        res.render('index', {title: 'Plant Recognition', plants: plants, currentFilters: {}})
    })
});

router.post('/', async function(req, res, next) {
    try {
        // Call the filterPlants function in the controller
        const filteredPlants = await plantsController.filterPlants(req.body);

        // Render the view with the filtered plants
        res.render('index', { title: 'Plant Recognition', plants: filteredPlants });
    } catch (error) {
        // Handle errors
        next(error);
    }
});


module.exports = router;
