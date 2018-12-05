// var Resources = require('../models/labelsModel');
// var formData = require('../public/javascripts/main.js').formData;

// var formData = require('form-data'); // new FormData();

// var formData = new FormData(document.querySelector('#m76xxsimForm'));
// INDEX page.
exports.index = function(req, res) {
	
	res.render('index', {
		title: 'Recloser Simulator', // formData.get('title'), //  
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: 'v2018.12.05',
		inputLabels: ['Input 1:', 'Input 2:'],
		input1Checked: [true, false, false],
		input2Checked: [true, false, false, false],
		outputLabels: ['Output 1:', 'Output 2:'],
		output1Checked: [true, false],
		output2Checked: [true, false],
		aOptions: ['52a Phases ABC', '52a Phase A', 'General'],
		bOptions: ['52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General'],
		tripOptions: ['Trip ABC', 'Trip A'],
		closeOptions: ['Close ABC', 'Close A'],
		startPosition: ['Close', 'Trip'],
		submitButton: 'Update',
		infoButton: 'Monitor',
		defaultValues: [50, 75]
	});
	
	// var mainJS = require('../public/javascripts/main.js');
};

exports.settings_update_put = function(req, res) {

	console.log('PUT_update active');
	console.log('breakerModel: ' + req.query.breakerModel);
	console.log('startPosition: ' + req.query.startPosition);
	console.log('operationMode: ' + req.query.operationMode);
	console.log('aOperationDelay: ' + req.query.aOperationDelay);
	console.log('bOperationDelay: ' + req.query.bOperationDelay);

	// if (req.query.breakerModel === undefined) {
	// 	req.query.breakerModel = '52a, 52b';
	// }
	var sim = require('../public/javascripts/m76xxsim').initWithValues;

	new sim({
		breakerModel: req.query.breakerModel,
		startPosition: req.query.startPosition,
		operationMode: req.query.operationMode,
		aOperationDelay: req.query.aOperationDelay,
		bOperationDelay: req.query.bOperationDelay
	});

	res.render('index', {
		title: 'Recloser Simulator', // formData.get('title'), //  
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: 'v2018.12.05',
		inputLabels: ['Input 1:', 'Input 2:'],
		input1Checked: [true, false, false],
		input2Checked: [true, false, false, false],
		outputLabels: ['Output 1:', 'Output 2:'],
		output1Checked: [true, false],
		output2Checked: [true, false],
		aOptions: ['52a Phases ABC', '52a Phase A', 'General'],
		bOptions: ['52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General'],
		tripOptions: ['Trip ABC', 'Trip A'],
		closeOptions: ['Close ABC', 'Close A'],
		startPosition: ['Close', 'Trip'],
		submitButton: 'Update',
		infoButton: 'Monitor',
		defaultValues: [50, 75]
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
