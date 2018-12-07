#! /usr/bin/env node

/*
 * m76xxIOs3.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.1
 * Date: 11/16/2018
 *
 * Provides IO functionality of a Recloser.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// TODO: Add file reading system instead of hard coding pins.

// debounce timeout.
const debounce = 20;

// detection edge.
const edge = 'both';

// GPIO control library.
const Gpio = require('onoff').Gpio;

// operator
// const Operator = require('./m76xx-io-operate');

// common IO attributes.
function IOs(name, gpio, direction) {
	this.name = name;
	this.gpio = gpio;
	this.direction = direction;
}

// input attributes
function SetupInputs(name, gpio, direction) {

	// General io stuff.
	IOs.call(this, name, gpio, direction);

	// only input items.
	this.edge = edge;
	this.debounceTimeout = debounce;

	// Setup input.
	let newGpio = new Gpio(this.gpio, this.direction, this.edge, {
		debounceTimeout: this.debounceTimeout,
		label: this.name
	});

	// TODO: Move watch to its own file/function.
	// Setup watch to detect changes.
	newGpio.watch((err, value) => {
		if (err) {
			throw err;
		}
		// TODO: operate outputs per watched inputs.
		console.log('SetupInputs:\t' + this.cbStartPosition);
		// Operator.operate.call(this, newGpio);
	});
}

// output attributes
var SetupOutputs = function (name, gpio, direction) {

	// UserSetupInputs.call(this, userInput);

	// General io stuff.
	IOs.call(this, name, gpio, direction);

	// Setup input.
	this.output = new Gpio(this.gpio, this.direction, {
		label: this.name
	});
	
	if (process.env.NODE_ENV === 'development') {
		// console.log(output);
		console.log('SetupOutputs:\tNew GPIO:\t' + this.output._gpio);
	// Operator.operate.call(this, newGpio);
	}
};

SetupOutputs.prototype.close = function(){
	this.output.writeSync(1);
};

// user specified items.
function UserSetupInputs(opts) {

	// User specified items.
	this.breakerModel = opts.breakerModel;
	this.startPosition = opts.startPosition;
	this.edge = opts.edge;
	this.operationMode = opts.operationMode;
	this.debounceTime = opts.debounceTime;
	this.aOperationDelay = opts.aOperationDelay;
	this.bOperationDelay = opts.bOperationDelay;

	console.log('Breaker model:\t' + this.breakerModel);
}


module.exports = {
	UserInputs: UserSetupInputs,
	Outputs: SetupOutputs,
	Inputs: SetupInputs
};
