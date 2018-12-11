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
// const debounce = require('./m76xxsim').debounceTime; // const debounce = 20;

const beagle3_3V = 3.3; // 3.3V power supply
const VIH = 2.0; // High-level input voltage per datasheet
const VHYS = 0.44; // max Hysteresis voltage at an input per datasheet
const logicHighVoltage = VIH + VHYS; // calculated High-level input voltage
const resistorSize = 2.4e3 * 1.05; // 2.4Kohm
const capSize = 4.7e-6 * 1.2; // 4.7uF cap
const secTomsecRate = 1e3; // 1 sec = 1000msec
const logicHighRatio = (beagle3_3V - logicHighVoltage) / beagle3_3V;
const debounce = (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2);


// detection edge.
const edge = 'both';

// Logic One;
const Logic1 = 1;

// Logic zero;
const Logic0 = 0;

// GPIO control library.
const Gpio = require('onoff').Gpio;

let breakerModel;
let startPosition;
let operationMode;
let aOperationDelay;
let bOperationDelay;

// operator
// const Operator = require('./m76xx-io-operate');

// common IO attributes.
function IOs(name, gpio, direction) {
	this.name = name;
	this.gpio = gpio;
	this.direction = direction;
}

// input attributes
var SetupInputs = function(name, gpio, direction) {

	// General io stuff.
	IOs.call(this, name, gpio, direction);

	// only input items.
	this.edge = edge;
	this.debounceTimeout = debounce;

	// Setup input.
	this.inputs = new Gpio(this.gpio, this.direction, this.edge, {
		debounceTimeout: this.debounceTimeout,
		label: this.name
	});

	if (process.env.NODE_ENV === 'development') {
		console.log('SetupInputs:\tNew GPIO:\t' + this.inputs._gpio);
	}
	SetupInputs.prototype.Watch.call(this);
};

SetupInputs.prototype.Watch = function() {
	if (process.env.NODE_ENV === 'development') {
		console.log('SetupInputs:\tNew GPIO:\t' + this.inputs._gpio);
	}
	// newGpio.Watch();
	// TODO: Move watch to its own file/function.
	// Setup watch to detect changes.
	this.inputs.watch((err, value) => {
		if (err) {
			throw err;
		}
		// TODO: operate outputs per watched inputs.
		// console.log('SetupInputs:\t' + this.inputs._gpio + '\toperated...\tName: ' + this.name);

		switch (this.name) {
			case 'Close_PhA':
				if (process.env.NODE_ENV === 'development') {
					console.log('SetupInputs:\tOperating PhA_52a.CLOSE');
				}
				break;
			case 'Trip_PhA':
				if (process.env.NODE_ENV === 'development') {
					console.log('SetupInputs:\tOperating PhA_52a.TRIP');
				}
				break;
			default:
				// code
		}
		if (process.env.NODE_ENV === 'development') {
			console.log('SetupInputs:\t' + this.inputs._gpio + '\toperated...\tName: ' + this.name);
			console.log('SetupInputs:\tBreaker Model:\t' + breakerModel);
			console.log('SetupInputs:\tStart Position:\t' + startPosition);
			console.log('SetupInputs:\tOperation Mode:\t' + operationMode);
			console.log('SetupInputs:\t52a Operation Delay:\t' + aOperationDelay);
			console.log('SetupInputs:\t52b Operation Delay:\t' + bOperationDelay);
		}
	});
};

// output attributes
var SetupOutputs = function(name, gpio, direction) {

	// Grap General io stuff.
	IOs.call(this, name, gpio, direction);

	// Setup output.
	this.output = new Gpio(this.gpio, this.direction, {
		label: this.name
	});

	if (process.env.NODE_ENV === 'development') {
		console.log('SetupOutputs:\tNew GPIO:\t' + this.output._gpio);
	}
};

// 52a operation set HIGH
SetupOutputs.prototype.Close = function() {
	if (process.env.NODE_ENV === 'development') {
		console.log('SetupOutputs:\tNew GPIO:\t' + this.output._gpio + '\tcommand: CLOSE');
	}
	setTimeout(() => {
		this.output.writeSync(Logic1);
	}, aOperationDelay);
};

SetupOutputs.prototype.Trip = function() {
	if (process.env.NODE_ENV === 'development') {
		console.log('SetupOutputs:\tNew GPIO:\t' + this.output._gpio + '\tcommand: TRIP');
	}
	setTimeout(() => {
		this.output.writeSync(Logic0);
	}, bOperationDelay);
};

// Output IO operation set to HIGH
SetupOutputs.prototype.Read = function() {
	if (process.env.NODE_ENV === 'development') {
		console.log('SetupOutputs:\tReading GPIO value: ' + this.output.readSync());
	}
	return this.output.readSync();
};

// user specified items.
var UserSetupInputs = function(opts) {
	// User specified items.
	breakerModel = opts.breakerModel;
	startPosition = opts.startPosition;
	operationMode = opts.operationMode;
	aOperationDelay = opts.aOperationDelay;
	bOperationDelay = opts.bOperationDelay;

	if (process.env.NODE_ENV === 'development') {
		console.log('UserSetupInputs:\tvalues:');
		console.log('Breaker model:\t' + breakerModel);
		console.log('Start Position:\t' + startPosition);
		console.log('Operation mode:\t' + operationMode);
		console.log('52a Operation Delay:\t' + aOperationDelay);
		console.log('52b Operation Delay:\t' + bOperationDelay);
	}
};

exports.UserInputs = UserSetupInputs;
exports.Outputs = SetupOutputs;
exports.Inputs = SetupInputs;
