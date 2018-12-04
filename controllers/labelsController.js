// var Resources = require('../models/labelsModel');

// INDEX page.
exports.index = function(req, res) {

	res.render('index', {
		title: 'Recloser Simulator',
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: 'v2018.12.03',
		inputLabels: ['Input 1:', 'Input 2:'],
		outputLabels: ['Output 1:', 'Output 2:'],
		aOptions: ['52a Phases ABC', '52a Phase A', 'General'],
		bOptions: ['52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General'],
		tripOptions: ['Trip ABC', 'Trip A'],
		closeOptions: ['Close ABC', 'Close A'],
		cbOptions: ['Close', 'Trip'],
		submitButton: 'Update',
		infoButton: 'Monitor',
		defaultValues: [50, 50, 0, 0]
	});
};

exports.settings_update_put = function(req, res) {

	console.log('PUT_update active');
	console.log('breakerModel: ' + req.query.breakerModel);
	console.log('cbPosition: ' + req.query.startPosition);
	console.log('operationMode: ' + req.query.operationMode);
	console.log('aOperationDelay: ' + req.query.aOperationDelay);
	console.log('bOperationDelay: ' + req.query.bOperationDelay);
	
	var sim = require('../public/javascripts/m76xxsim').initWithValues;
	
	new sim({
		breakerModel: req.query.breakerModel,
		cbPosition: req.query.startPosition,
		operationMode: req.query.operationMode,
		aOperationDelay: req.query.aOperationDelay,
		bOperationDelay: req.query.bOperationDelay
	});

	// console.log('brakerModel: ' + req.query.aOptions + ', ' + req.query.bOptions);
	// sim.initWithValues(null, null, null, null, null, null);
	// 	sim.breakerModel = req.query.aOptions + ', ' + req.query.bOptions //,

	// );

	// var queryStuff = JSON.stringify(req.query);
	// var queryStuff = req.query.parse(req.query, { parameterLimit: 7 });
	// console.log(queryStuff);

	// res.send('NOT IMPLEMENTED: update PUT' + queryStuff);
	// res.json({
	// 	breakerModel: req.query.breakerModel,
	// 	startPositions: req.query.startPositions,
	// 	operationMode: req.query.operationMode,
	// 	aOperationDelay: req.query.aOperationDelay,
	// 	bOperationDelay: req.query.bOperationDelay
	// });
};
