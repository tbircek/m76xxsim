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
function SetupOutputs(name, gpio, direction) {

	// UserSetupInputs.call(this, userInput);

	// General io stuff.
	IOs.call(this, name, gpio, direction);

	// Setup input.
	let newGpio = new Gpio(this.gpio, this.direction, {
		label: this.name
	});
	console.log('SetupOutputs:\t' + this.name + '  \tBreaker model:\t' + this.breakerModel + '\tNew GPIO:\t' + this.gpio);
	// Operator.operate.call(this, newGpio);
}

// user specified items.
function UserSetupInputs(opts) {

	// User specified items.
	this.breakerModel = opts.breakerModel;
	this.cbStartPosition = opts.cbStartPosition;
	this.edge = opts.edge;
	// this.recloserType = recloserType;
	this.operationMode = opts.operationMode;
	this.tripTime52aDelay = opts.tripTime52aDelay;
	this.tripTime52bDelay = opts.tripTime52bDelay;
	this.closeTime52aDelay = opts.closeTime52aDelay;
	this.closeTime52bDelay = opts.closeTime52bDelay;

	console.log('Breaker model:\t' + this.breakerModel);
}

module.exports = {
	UserInputs: UserSetupInputs,
	Outputs: SetupOutputs,
	Inputs: SetupInputs
};
