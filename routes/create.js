var express = require('express');
var router = express.Router();

/** GET plant page */
router.get('/', function(req, res, next) {
    res.render('create', { title: 'Create Post' });
});



module.exports = router;