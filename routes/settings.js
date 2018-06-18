var express = require('express');
var router = express.Router();

// Require controller modules.
var settings_controller;
const staticPage = true; // false; // 

if (staticPage) {
  settings_controller = require('../controllers/labelsController'); // require('../controllers/resourcesController'); // 
  // GET home page.
  router.get('/', settings_controller.index);
}
else {
  settings_controller = require('../controllers/resourcesController'); // 
  router.get('/', settings_controller.index_page);
}

// UPDATE settings.
// router.get('/:control-:value', settings_controller.settings_update);
// Route path: /flights/:from-:to
// Request URL: http://localhost:3000/flights/LAX-SFO
// req.params: { "from": "LAX", "to": "SFO" }

module.exports = router;
