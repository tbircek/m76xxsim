var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recloser Simulator', 
                        author: 'Turgay Bircek',
                        description: 'Recloser simulator for Beckwith Electric Protection relays.'});
});

module.exports = router;
