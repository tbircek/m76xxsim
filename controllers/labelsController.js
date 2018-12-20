// let sim = require('../public/javascripts/m76xxIOSetup');
let sim = require('../public/javascripts/m76xxsim');
let setInputs = require('../public/javascripts/m76xxInputs').Inputs;
let title = 'Recloser Simulator';
let ver = `${process.env.NODE_ENV} --- v2018.12.17`;
// INDEX page.
exports.index = function(req, res) {

	res.render('index', {
		title: title,
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: ver,
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
		defaultValues: [60, 60]
	});
};

exports.settings_update_put = function(req, res) {

	console.log('PUT_update active');
	console.log('breakerModel: ' + req.query.breakerModel);
	console.log('startPosition: ' + req.query.startPosition);
	console.log('operationMode: ' + req.query.operationMode);
	console.log('closeOperationDelay: ' + req.query.closeOperationDelay);
	console.log('tripOperationDelay: ' + req.query.tripOperationDelay);

	// attach these values to user interface in web server.
	// let userValues = {
	// 	breakerModel: req.query.breakerModel,
	// 	startPosition: req.query.startPosition,
	// 	operationMode: req.query.operationMode,
	// 	closeOperationDelay: req.query.closeOperationDelay,
	// 	tripOperationDelay: req.query.tripOperationDelay
	// };

	// {
	// 	name: 'update',
	// 	gpio: 'update',
	// 	direction: 'update',
	// 	breakerModel: req.query.breakerModel,
	// 	startPosition: req.query.startPosition,
	// 	operationMode: req.query.operationMode,
	// 	closeOperationDelay: req.query.closeOperationDelay,
	// 	tripOperationDelay: req.query.tripOperationDelay
	// };

	let updateValues = new setInputs('update','update','update',req.query.breakerModel, req.query.startPosition, req.query.operationMode, req.query.closeOperationDelay,req.query.tripOperationDelay);
	
	updateValues.webUpdate.bind('update','update','update',req.query.breakerModel, req.query.startPosition, req.query.operationMode, req.query.closeOperationDelay,req.query.tripOperationDelay);
	
	// new sim.IOInit(userValues);
	// sim.webUpdate(userValues);

	res.render('index', {
		title: title,
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: ver,
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
		defaultValues: [req.query.closeOperationDelay, req.query.tripOperationDelay]
	});
};
