var express = require('express');
var router = express.Router();
let plantsController = require('../controllers/plants')

/* GET home page. */

router.get('/', function (req, res, next) {
   res.render('index', {title: 'Plant Recognition', plants: {}, currentFilters: {}});
});

router.get('/plants', function (req, res, next) {
    plantsController.getAll().then(plants => {
        console.log(plants);
        return res.status(200).send(plants);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
})

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
