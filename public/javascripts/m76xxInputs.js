#! /usr/bin/env node

/*
 * m76xxInputs.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.0
 * Date: 12/18/2018
 *
 * Provides input operations for M76xx Simulator program.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

let IOSetup = require('./m76xxSetupClass').IOSetup;
// let directions = require('./m76xxsim').directions;
// let Outputs = require('./m76xxOutputs').Outputs;

// GPIO control library.
const Gpio = require('onoff').Gpio;

// const directions = Object.freeze({
// 	IN: 'in',
// 	OUT: 'out'
// });

let outputs = new Map();
let inputs = new Map();
let myBreakerModel;

// Logic One;
const Logic1 = Gpio.HIGH;

// Logic zero;
const Logic0 = Gpio.LOW;

class Inputs extends IOSetup {
	constructor(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay) {
		super(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
		this.outputs = outputs;
		this.inputs = inputs;
		this.Logic0 = Logic0;
		this.Logic1 = Logic1;
	}

	webUpdate(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay) {
		super.name = name;
		super.gpio = gpio;
		super.direction = direction,
		super.breakerModel = breakerModel;
		super.startPosition = startPosition;
		super.operationMode = operationMode;
		super.closeOperationDelay = closeOperationDelay;
		super.tripOperationDelay = tripOperationDelay;
		if (process.env.NODE_ENV === 'development') {
			console.log(`\t\t User updated values are available.`);
		}
		super.init(this);
		// this.watchOutputs(this);
		// this.outputs.forEach(this.selectOutput, this);
		super.speak();
	}

	close(outputName) {
		if (process.env.NODE_ENV === 'development') {
			console.log(`Inputs.close():\t${this.name} - GPIO${this.gpio} is closed... --- breakerModel: ${this.breakerModel}`);
		}

		// this refers to setTimeout which don't have this.name
		// let outputName = this.name;
		setTimeout(function() {

			outputs.get(outputName).writeSync(Logic1);
		}, this.closeOperationDelay);
	}

	trip(outputName) {
		if (process.env.NODE_ENV === 'development') {
			console.log(`Inputs.trip():\t${this.name} - GPIO${this.gpio} is tripped... --- breakerModel: ${this.breakerModel}`);
		}

		// this refers to setTimeout which don't have this.name
		// let outputName = this.name;
		setTimeout(function() {

			outputs.get(outputName).writeSync(Logic0);
		}, this.tripOperationDelay);
	}

	// // Watch for hardware interrupts on the GPIO. 
	// // The edge argument that was passed to the constructor determines which hardware interrupts to watch for.
	// watchInputs() {
	// 	super.speak();
	// 	if (Gpio.accessible) {
	// 		if (this.direction === 'in') {
	// 			inputs.get(this.name).watch((err, value) => {
	// 				if (err) {
	// 					throw err;
	// 				}

	// 				this.outputs.forEach(this.selectOutput, this);
	// 			});
	// 		}
	// 		// else if (this.direction === 'out') {

	// 		// 	if (process.env.NODE_ENV === 'development') {
	// 		// 		console.log(`watchGpios detected an Output: ${this.name} is not defined.`);
	// 		// 	}

	// 		// 	// super.watchOutputs();

	// 		// 	this.outputs.forEach(this.selectOutput, this);
	// 		// }
	// 	}
	// 	else {
	// 		writeSync: (value) => {
	// 			console.log('virtual led now uses value: ' + value);
	// 		};
	// 	}
	// }
}

// provides methods to control and initialization of the Inputs.
exports.Inputs = Inputs;
