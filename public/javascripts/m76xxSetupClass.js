#! /usr/bin/env node

/*
 * m76xxSetupClass.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.0
 * Date: 12/18/2018
 *
 * Provides IO functionality of a Recloser.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// TODO: Add file reading system instead of hard coding pins.

// var async = require('async');

// GPIO control library.
const Gpio = require('onoff').Gpio;

const edge = 'both';
const beagle3_3V = 3.3; // 3.3V power supply
const VIH = 2.0; // High-level input voltage per datasheet
const VHYS = 0.44; // max Hysteresis voltage at an input per datasheet
const logicHighVoltage = VIH + VHYS; // calculated High-level input voltage
const resistorSize = 2.4e3 * 1.05; // 2.4Kohm
const capSize = 2.2e-6 * 1.20; // 4.7uF cap
const secTomsecRate = 1e3; // 1 sec = 1000msec
const logicHighRatio = (beagle3_3V - logicHighVoltage) / beagle3_3V;
const debounceTimeout = Math.ceil(-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2);

const directions = Object.freeze({
	IN: 'in',
	OUT: 'out'
});

class IOSetup {
	constructor(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay) {
		this.name = name;
		this.gpio = gpio;
		this.direction = direction;
		this.breakerModel = breakerModel;
		this.startPosition = startPosition;
		this.operationMode = operationMode;
		this.closeOperationDelay = closeOperationDelay;
		this.tripOperationDelay = tripOperationDelay;
		this.edge = edge;
		this.debounceTimeout = debounceTimeout;
	}

	// webUpdate(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay) {
	// 	this.name = name;
	// 	this.gpio = gpio;
	// 	this.direction = direction,
	// 	this.breakerModel = breakerModel;
	// 	this.startPosition = startPosition;
	// 	this.operationMode = operationMode;
	// 	this.closeOperationDelay = closeOperationDelay;
	// 	this.tripOperationDelay = tripOperationDelay;
	// 	if (process.env.NODE_ENV === 'development') {
	// 		console.log(`\t\t User updated values are available.`);
	// 	}
	// 	// this.init();
	// 	// this.watchOutput();
	// }

	// handles initalization of every GPIO.
	init() {

		// let name = this.name;
		// let startPosition = this.startPosition;
		// let breakerModel = this.breakerModel;
		// let operationMode = this.operationMode;
		// let closeOperationDelay = this.closeOperationDelay;
		// let tripOperationDelay = this.tripOperationDelay;

		if (Gpio.accessible) {
			if (this.direction === 'out') {
				if (!this.outputs.has(this.name)) {
					if (process.env.NODE_ENV === 'development') {
						console.log('this OUTPUT is not defined yet');
					}

					// store in outputs set.
					this.outputs.set(this.name, new Gpio(this.gpio, this.direction, {
						label: this.name
					}));

					if (process.env.NODE_ENV === 'development') {
						console.log(`\t\t Counting mapped outputs: ${this.outputs.size} and value: ${this.outputs.get(this.name)._gpio}.`);
					}

					// start Position activated.
					this.watchOutputs.call(this);
				}
				else {
					// init here.
					// start Position activated.
					if (process.env.NODE_ENV === 'development') {
						console.log(`\t\t this.direction === 'out') { ELSE breakerModel: ${this.breakerModel} and startPosition: ${this.startPosition}.`);
					}
					this.watchOutputs.call(this);
				}
			}
			else if (this.direction === 'in') {
				if (!this.inputs.has(this.name)) {
					if (process.env.NODE_ENV === 'development') {
						console.log('this INPUT is not defined yet');
					}
					this.inputs.set(this.name, new Gpio(this.gpio, this.direction, this.edge, {
						debounceTimeout: this.debounceTimeout //,
						// label: this.name
					}));

					if (process.env.NODE_ENV === 'development') {
						console.log(`\t\t Counting mapped inputs: ${this.inputs.size} and value: ${this.inputs.get(this.name)._gpio} and exists: ${this.inputs.has(this.name)}.`);
					}
					// this.watchInputs();

					// let inputToWatch = this.inputs.get(this.name);
					this.inputs.get(this.name).watch((err, value) => {
					// inputToWatch.watch((err, value) => {
						if (err) {
							throw err;
						}
						
						this.speak();
						this.outputs.forEach(this.selectOutput, this);
					
						// this.watchOutputs.call(this);
						
					});
				}
			}
			else if (this.direction === 'update') {
				if (process.env.NODE_ENV === 'development') {
					console.log(`\t\t User updated values are available.`);
				}

				// the user changed something that effects only the outputs re-initialize immediately.
				this.watchOutputs.call(this);
			}
			else {
				if (process.env.NODE_ENV === 'development') {
					console.log(`\t\t Sorry there is no ${this.direction} available.`);
				}
			}
		}
		else {
			writeSync: (value) => {
				console.log('virtual led now uses value: ' + value);
			};
		}
	}

	// handles initial and user updated startPositions of Outputs.
	watchOutputs() {
		if (Gpio.accessible) {
			if (process.env.NODE_ENV === 'development') {
				console.log(`name: ${this.name} is running.`);
				console.log(`startPosition: ${this.startPosition} is position.`);
				console.log(`breakerModel: ${this.breakerModel} is model.`);
				console.log(`operationMode: ${this.operationMode} is mode.`);
				console.log(`closeOperationDelay: ${this.closeOperationDelay} is close delay.`);
				console.log(`tripOperationDelay: ${this.tripOperationDelay} is trip delay.`);
			}

			this.outputs.forEach(this.selectOutput, this);
		}
		else {
			writeSync: (value) => {
				console.log('virtual led now uses value: ' + value);
			};
		}
	}

	// delete the input and release resources used by it.
	// A Gpio object should not be used after invoking its unexport method called before exiting this program.
	unexport() {
		switch (this.direction) {
			case 'in':
				// code
				this.inputs.get(this.name).unexport();
				break;

			case 'out':
				// code
				this.outputs.get(this.name).unexport();
				break;
			default:
				// code
		}
		if (process.env.NODE_ENV === 'development') {
			console.log(`Gpio.unexport():\t${this.name} - GPIO${this.gpio} is deleted...`);
		}
	}

	// Stop watching for hardware interrupts on the GPIO.
	// All callbacks are removed.
	unwatch() {
		if (this.inputs.direction === 'out') {
			throw 'only inputs can be unwatched';
		}
		else {
			this.inputs.get(this.name).unwatch();
			if (process.env.NODE_ENV === 'development') {
				console.log(`Inputs:\t${this.name} - GPIO${this.gpio} no longer monitored...`);
			}
		}
	}

	// prints some info about Gpios.
	speak() {
		if (process.env.NODE_ENV === 'development') {
			console.log(`${IOSetup.name} CLASS TALKS:`);
			console.log(`${this.name} \tis going to sleep!`);
			console.log(`${this.gpio} \t\tmakes a noise.`);
			console.log(`${this.direction} \t\tis eating!`);
			if (this.direction === directions.IN) {
				console.log(`${this.edge} \t\twhere growls!`);
				console.log(`${this.debounceTimeout}msec \tis break time.`);
			}
			console.log(`${this.breakerModel} \tis waking up!`);
			console.log(`${this.startPosition} \t\tis pounding its chest!`);
			console.log(`${this.operationMode} \tis climbing trees!`);
			console.log(`${this.closeOperationDelay} \t\tlooks at an example.`);
			console.log(`${this.tripOperationDelay} \t\tkeywords are used.`);
		}
	}

	selectOutput(value, key, map) {
		// console.log(IOSetup.prototype.name);
		let outputName; // = this.name.split('_')[0];
		let opDirection = this.name.split('_')[1];
		let breakerModel = this.breakerModel;

		if (opDirection === 'Close' || opDirection === 'Trip') {
			outputName = this.name.split('_')[0];
		}
		else {
			outputName = key.toString();
			opDirection = this.startPosition;
		}

		// to show passing every value.
		if (process.env.NODE_ENV === 'development') {
			console.log(`m[${key}] = ${value._gpio} command sent. \nMy original name: ${this.name}\t\tmy processed name: ${outputName} \nBreaker model: ${breakerModel} and requested operation was ${opDirection}`);
			console.log(`>-------------------------------------<`);
		}

		if ((this.breakerModel.includes('52a only') || this.breakerModel === '52a, 52b') && (key.toString().endsWith('52a'))) {
			if (key.toString().startsWith(outputName)) {
				if (opDirection === 'Close') {
					this.close(key, this);
				}
				else if (opDirection === 'Trip') {
					this.trip(key, this);
				}

				if (process.env.NODE_ENV === 'development') {
					console.log(`m[${key}] = ${value._gpio} command sent. \tBreaker model: ${this.breakerModel} and requested operation was ${opDirection}`);
					console.log(`>-------------------------------------<`);
				}
			}
		}
		else if ((this.breakerModel.includes('52b only') || this.breakerModel === '52a, 52b') && (key.toString().endsWith('52b'))) {
			if (key.toString().startsWith(outputName)) {
				if (opDirection === 'Close') {
					this.trip(key, this);
				}
				else if (opDirection === 'Trip') {
					this.close(key, this);
				}

				if (process.env.NODE_ENV === 'development') {
					console.log(`m[${key}] = ${value._gpio} command sent. \tBreaker model: ${this.breakerModel} and requested operation was ${opDirection}`);
					console.log(`>-------------------------------------<`);
				}
			}
		}
		else {
			if ((key.toString().startsWith(outputName) || key.toString().startsWith('Neu_Gnd')) && key.toString().endsWith('Cls')) {
				if (opDirection === 'Close') {
					this.close(key, this);
				}
				else if (opDirection === 'Trip') {
					this.trip(key, this);
				}
				if (process.env.NODE_ENV === 'development') {
					console.log(`m[${key}] = ${value._gpio} command sent. \tBreaker model: ${this.breakerModel} and requested operation was ${opDirection}`);
					console.log(`>-------------------------------------<`);
				}
			}
			else if ((key.toString().startsWith(outputName) || key.toString().startsWith('Neu_Gnd')) && key.toString().endsWith('Opn')) {
				if (opDirection === 'Close') {
					this.trip(key, this);
				}
				else if (opDirection === 'Trip') {
					this.close(key, this);
				}
				if (process.env.NODE_ENV === 'development') {
					console.log(`m[${key}] = ${value._gpio} command sent. \tBreaker model: ${this.breakerModel} and requested operation was ${opDirection}`);
					console.log(`>-------------------------------------<`);
				}
			}
		}
	}
}

exports.IOSetup = IOSetup;
