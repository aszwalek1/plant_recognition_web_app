var express = require('express');
var router = express.Router();

/** GET plant page */
router.get('/', function(req, res, next) {

    options = {
        title: 'Plant Name Here',
        postTime: 'time here',
        postDate: 'date here',
        postImageURL: 'todo.png',
        postDetails: [
            "detail 1 lorem ipsum lorem ipsum",
            "detail 2 lorem ipsum",
            "detail 3 lorem ipsum"
        ],
        postLocation: 'location here',
        postUsername: 'user nickname here'
    }
    res.render('plant', options);
});

module.exports = router;