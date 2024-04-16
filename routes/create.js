var express = require('express');
var router = express.Router();
var multer = require('multer');
var plants = require('../controllers/plants');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/');
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        // Make the file name the date + the file extension
        filename =  Date.now() + '.' + file_extension[file_extension.length-1];
        cb(null, filename);
    }
});
let upload = multer({ storage: storage });

/** GET create page */
router.get('/', function(req, res, next) {
    res.render('create', { title: 'Create Post' });
});

// POST request handler for form submission
router.post('/', upload.single('myImg'), function (req, res, next) {
    let userData = req.body;
    let filePath = req.file.path;
    let result = plants.create(userData, filePath);
    console.log(result);
    res.redirect('/');
});

module.exports = router;