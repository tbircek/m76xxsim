// var Resources = require('../models/labelsModel');
// var formData = require('../public/javascripts/main.js').formData;
// const debounceTime = require('../public/javascripts/m76xxsim').debounceTime;
// const sim = require('../public/javascripts/m76xxIOs').m76xxIOs;
let sim = require('../public/javascripts/m76xxIOSetup');
// var formData = require('form-data'); // new FormData();

// var formData = new FormData(document.querySelector('#m76xxsimForm'));
// INDEX page.
exports.index = function(req, res) {

	res.render('index', {
		title: 'Recloser Simulator', // formData.get('title'), //  
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: process.env.NODE_ENV + ' --- v2018.12.05',
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
	console.log('aOperationDelay: ' + req.query.aOperationDelay);
	console.log('bOperationDelay: ' + req.query.bOperationDelay);
	// sim.init(req.query.breakerModel, req.query.startPosition,req.query.operationMode,req.query.aOperationDelay,req.query.bOperationDelay);
	// // attach these values to user interface in web server.
	let userValues = {
		breakerModel: req.query.breakerModel,
		startPosition: req.query.startPosition,
		operationMode: req.query.operationMode,
		aOperationDelay: req.query.aOperationDelay,
		bOperationDelay: req.query.bOperationDelay
	};

	new sim.UserInputs(userValues);
	// new sim({
	// 	breakerModel: req.query.breakerModel,
	// 	startPosition: req.query.startPosition,
	// 	operationMode: req.query.operationMode,
	// 	aOperationDelay: req.query.aOperationDelay,
	// 	bOperationDelay: req.query.bOperationDelay
	// });

	res.render('index', {
		title: 'Recloser Simulator',
		author: 'T. Bircek',
		description: 'Recloser simulator for Protection relays.',
		keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
		ver: process.env.NODE_ENV + ' --- v2018.12.05',
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
		defaultValues: [req.query.aOperationDelay, req.query.bOperationDelay]
	});
};
