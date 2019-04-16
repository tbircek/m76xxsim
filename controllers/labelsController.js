#! /usr/bin/env node

/*
 * labelsController.js
 * Author: Turgay Bircek
 * Version: 1.0.1
 * Date: 04/10/2019
 *
 * Provides interaction between user and the web server.
 *
 */

// reference to hardware control and initializations.
let sim = require('../public/javascripts/m76xxsim');
let title = 'Recloser Simulator';
let ver = `${process.env.NODE_ENV} --- v2018.04.10`;
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
		defaultValues: [0, 0]
	});
};

exports.settings_update_put = function(req, res) {

	// initialize beaglebone gpios with the user specified values.
	sim.IOUserInit.call(this, req.query.breakerModel, req.query.startPosition, req.query.operationMode, req.query.closeOperationDelay, req.query.tripOperationDelay);

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
