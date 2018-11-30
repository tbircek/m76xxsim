// var Resources = require('../models/labelsModel');

// INDEX page.
exports.index = function(req, res) {

	res.render('index', {
		title: 'Recloser Simulator',
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: 'v2018.11.27 ',
		inputLabels: ['Input 1:', 'Input 2:'],
		outputLabels: ['Output 1:', 'Output 2:'],
		fiftyTwoAOptions: ['52a Phases ABC', '52a Phase A', 'General'],
		fiftyTwoBOptions: ['52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General'],
		tripOptions: ['Trip ABC', 'Trip A'],
		closeOptions: ['Close ABC', 'Close A'],
		cbOptions: ['Close', 'Trip'],
		submitButton: 'Update',
		infoButton: 'Monitor',
		defaultValues: [50, 50, 0, 0]
	});
};

exports.settings_update_put = function(req, res) {


	// var queryStuff = JSON.stringify(req.query);
	// var queryStuff = req.query.parse(req.query, { parameterLimit: 7 });
	// console.log(queryStuff);

	// res.send('NOT IMPLEMENTED: update PUT' + queryStuff);
	res.json (
		{
			aOptions : req.query.aOptions,
			bOptions : req.query.bOptions,
			startPositionOptions: req.query.startPositionOptions,
			tripOptions: req.query.tripOptions,
			closeOptions: req.query.closeOptions,
			aOperationDelay: req.query.aOperationDelay,
			bOperationDelay: req.query.bOperationDelay
		});
};
