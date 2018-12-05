var express = require('express');
var router = express.Router();
var settings_controller = require('../controllers/labelsController');
// var formData = new FormData();

// test route to make sure everything is working (accessed at GET http://localhost:9000/)
router.get('/', function(req, res, next) {

	res.json({ message: 'm76xxsim server is up and running. Please proceed to http://hostipaddress:9000/m76xxsim' });
});

router.route('/m76xxsim')

	.post(function(req, res, next) {
		res.json({ message: 'POST function is not supported' });

	})

	.get(function(req, res, next) {
			console.log('GET active');
			console.log('req.query: ' + req.query.breakerModel);

			// formData.set('title','Recloser Simulator');
			if (req.query.breakerModel === undefined) {
				// send index page
				settings_controller.index(req, res);
			}
			else {
				// send index page
				settings_controller.settings_update_put(req, res);
			}
	})

.put(function(req, res, next) {
	console.log('PUT active');
	// send index page
	settings_controller.settings_update_put(req, res);
});

module.exports = router;
