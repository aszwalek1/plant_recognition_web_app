var express = require('express');
var router = express.Router();

let plantsController = require('../controllers/plants')

/* GET home page. */
router.get('/', function (req, res, next) {
    let plantsPromise = plantsController.getAll()

    plantsPromise.then(plantsStr => {
        let plants = JSON.parse(plantsStr)
        res.render('index', {title: 'Plant Recognition', plants: plants})
    })
});

module.exports = router;
