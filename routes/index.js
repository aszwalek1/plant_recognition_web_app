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
        const filters = req.body;
        const filteredPlants = await plantsController.filterPlants(filters);
        res.render('index', { title: 'Plant Recognition', plants: filteredPlants, currentFilters: filters });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
