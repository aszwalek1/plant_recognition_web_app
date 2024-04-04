var express = require('express');
var router = express.Router();

/** GET plant page */
router.get('/', function(req, res, next) {
    res.render('update', { title: 'Update Post' });
});



module.exports = router;