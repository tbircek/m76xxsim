#! /usr/bin/env node

/*
 * m76xxSetupClass.js
 *
 * Copyright (c) 2018-2019 Turgay Bircek
 * Version: 1.0.1
 * Date: 01/08/2019
 *
 * Provides IO functionality of a Recloser.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// TODO: Add file reading system instead of hard coding pins.

var async = require('async');

// GPIO control library.
const Gpio = require('onoff').Gpio;


const edge = 'rising';
const beagle3_3V = 3.3; // 3.3V power supply
const VIH = 2.0; // High-level input voltage per datasheet
const VHYS = 0.44; // max Hysteresis voltage at an input per datasheet
const logicHighVoltage = VIH + VHYS; // calculated High-level input voltage
const resistorSize = 2.4e3 * 1.05; // 2.4Kohm
const capSize = 2.2e-6 * 1.20; // 4.7uF cap
const secTomsecRate = 1e3; // 1 sec = 1000msec
// const m7679PulseWidth = 50; // additional X msec delay to software debounce time
const logicHighRatio = (beagle3_3V - logicHighVoltage) / beagle3_3V;
const debounceTimeout = parseInt(Math.ceil(-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2), 10);

// setup super class provides logic to operations.
// initializes hardware.
class IOSetup {
	constructor(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay) {
		this.name = name;
		this.gpio = gpio;
		this.direction = direction;
	}

	// handles initalization of every GPIO.
	init() {

		if (Gpio.accessible) {
			if (this.direction === 'out') {
				if (!this.outputs.has(this.name)) {
					if (process.env.NODE_ENV === 'development') {
						console.log('this OUTPUT is not defined yet');
					}

					// store in outputs set.
					this.outputs.set(this.name, new Gpio(this.gpio, this.direction)); 
					
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
						console.log(`\tWe are running --- this.direction === 'out') { ELSE breakerModel: ${this.m76xx.breakerModel} and startPosition: ${this.m76xx.startPosition}.`);
					}
					this.watchOutputs.call(this);
				}
			}
			else if (this.direction === 'in') {
				if (!this.inputs.has(this.name)) {
					if (process.env.NODE_ENV === 'development') {
						console.log('this INPUT is not defined yet');
					}
					this.inputs.set(this.name, new Gpio(this.gpio, this.direction, edge, {
						debounceTimeout: debounceTimeout 
					}));
					
					if (process.env.NODE_ENV === 'development') {
						console.log(`\t\t Counting mapped inputs: ${this.inputs.size} and value: ${this.inputs.get(this.name)._gpio} and exists: ${this.inputs.has(this.name)} debounceTimeout: ${debounceTimeout} msec.`);
					}
					
					let myThis = this;
					
					this.inputs.get(this.name).watch((err, value) => {
						
						if (err) {
							throw err;
						}

						console.time('start');
						async.parallel(this.speak());
						async.parallel(this.outputs.forEach(this.selectOutput, myThis));

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
				console.log(`Setup Class.watchOutputs() is running:`);
				console.log(`name: ${this.name} is running.`);
				console.log(`startPosition: ${this.m76xx.startPosition} is position.`);
				console.log(`breakerModel: ${this.m76xx.breakerModel} is model.`);
				console.log(`operationMode: ${this.m76xx.operationMode} is mode.`);
				console.log(`closeOperationDelay: ${this.m76xx.closeOperationDelay} is close delay.`);
				console.log(`tripOperationDelay: ${this.m76xx.tripOperationDelay} is trip delay.`);
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
			console.log(`${IOSetup.name} CLASS TALKS: Input changed detected: \t\t${this.name}`);
		}
	}

	selectOutput(value, key, map) {
		let outputName;
		let opDirection = this.name.split('_')[1];

		if (opDirection === 'Close' || opDirection === 'Trip') {
			outputName = this.name.split('_')[0];
		}
		else {
			outputName = key.toString();
			opDirection = this.m76xx.startPosition;
		}
		// to show passing every key.
		if (process.env.NODE_ENV === 'development') {
			console.time(key.toString());
		}

		if ((this.m76xx.breakerModel.includes('52a only') || this.m76xx.breakerModel === '52a, 52b') && (key.toString().endsWith('52a'))) {
			if (key.toString().startsWith(outputName)) {
				if (opDirection === 'Close') {
					async.parallel(this.close(key, this));
				}
				else if (opDirection === 'Trip') {
					async.parallel(this.trip(key, this));
				}
			}
		}
		else if ((this.m76xx.breakerModel.includes('52b only') || this.m76xx.breakerModel === '52a, 52b') && (key.toString().endsWith('52b'))) {
			if (key.toString().startsWith(outputName)) {
				if (opDirection === 'Close') {
					async.parallel(this.trip(key, this));
				}
				else if (opDirection === 'Trip') {
					async.parallel(this.close(key, this));
				}
			}
		}
		else {
			if ((key.toString().startsWith(outputName) || key.toString().startsWith('Neu_Gnd') || this.m76xx.operationMode === '3trip 3lockout') && key.toString().endsWith('Opn')) {
				if (opDirection === 'Close') {
					async.parallel(this.trip(key, this));
				}
				else if (opDirection === 'Trip') {
					async.parallel(this.close(key, this));
				}
			}
			else if ((key.toString().startsWith(outputName) || key.toString().startsWith('Neu_Gnd') || this.m76xx.operationMode === '3trip 3lockout') && key.toString().endsWith('Cls')) {
				if (opDirection === 'Close') {
					async.parallel(this.close(key, this));
				}
				else if (opDirection === 'Trip') {
					async.parallel(this.trip(key, this));
				}
			}
			else {
				if (process.env.NODE_ENV === 'development') {
					console.timeEnd(key.toString());
				}
			}
		}
	}
}

exports.IOSetup = IOSetup;
