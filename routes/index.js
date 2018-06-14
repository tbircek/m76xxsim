var express = require('express');
var router = express.Router();

/* GET home page and redirect. */ 
router.get('/', function (req, res, next) {
  res.redirect('/settings');
});

module.exports = router;
