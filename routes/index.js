var express = require('express');
var router = express.Router();

let plants = require('../controllers/plants')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Plant Recognition' });
});

// TODO remove temp test function below
router.get('/temp', function(req, res, next) {
  let resultPromise = plants.create(
    {
      name: "hi",
      description: "hi hi",
      characteristics: {
        hasFlowers: true,
        hasLeaves: true,
        hasFruit: true,
        hasSeeds: true,
        sunExposure: "full",
        height: 10,
        spread: 5,
        colour: "#e66465"
      },
      nameStatus: "in-progress",
      username: "username",
      date: Date.now(),
    },
    ""
  )

  resultPromise.then(result => {
      console.log(result);
  })

  res.render('index', { title: 'temp database test' });
})

module.exports = router;
