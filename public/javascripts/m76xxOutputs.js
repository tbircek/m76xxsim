#! /usr/bin/env node

/*
 * m76xxOutputs.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.0
 * Date: 12/12/2018
 *
 * Provides output operations for M76xx Simulator program.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// GPIO control library.
const Gpio = require('onoff').Gpio;

let IOSetup = require('./m76xxSetupClass').IOSetup;


class Outputs extends IOSetup {
	constructor(name, gpio, direction, breakerModel, startPosition, operationMode, aOperationDelay, bOperationDelay) {
		super(name, gpio, direction, breakerModel, startPosition, operationMode, aOperationDelay, bOperationDelay);

		// this.output = new Gpio('PhA_52a', 30, 'out', breakerModel, startPosition, operationMode, aOperationDelay, bOperationDelay);
		// Setup output.
		this.output = new Gpio(this.gpio, this.direction, {
			label: this.name
		});
	}

	// delete the input and release resources used by it.
	// A Gpio object should not be used after invoking its unexport method.
	// called before exiting this program.
	unexport() {
		// super.speak();
		super.unexport();
		// this.output.unexport();
		// if (process.env.NODE_ENV === 'development') {
		// 	console.log(`Outputs:\t${this.name} - GPIO${this.gpio} is deleted...`);
		// }
	}

	// Stop watching for hardware interrupts on the GPIO.
	// All callbacks are removed.
	unwatch() {
		// super.speak();
		this.inputs.unwatch();
		if (process.env.NODE_ENV === 'development') {
			console.log(`Inputs:\t${this.name} - GPIO${this.gpio} no longer monitored...`);
		}
	}

	// Operate Close command.
	close() {
		super.speak();
		// Setup output.
		// this.output = new Gpio(this.gpio, this.direction, {
		// 	label: this.name
		// });

		this.output.writeSync(Logic1);
	}

	trip() {
		super.speak();
		// // Setup output.
		// this.output = new Gpio(this.gpio, this.direction, {
		// 	label: this.name
		// });
		this.output.writeSync(Logic0);
	}
}

// provides methods to control and initialization of the Inputs.
exports.Outputs = Outputs;
