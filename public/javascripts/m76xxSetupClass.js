#! /usr/bin/env node

/*
 * m76xxSetupClass.js
 *
 * Copyright (c) 2018-2019 Turgay Bircek
 * Version: 1.0.2
 * Date: 01/23/2019
 *
 * Provides IO functionality of a Recloser.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// TODO: Add file reading system instead of hard coding pins.

// the logger.
var winston = require('../../winston');
require('winston-timer')(winston);

// provide async operations.
var async = require('async');

// GPIO control library.
const Gpio = require('onoff').Gpio;


const edge = 'rising';
const beagle3_3V = 3.3; // 3.3V power supply
const VIH = 2.0; // High-level input voltage per datasheet
const VHYS = 0.44; // max Hysteresis voltage at an input per datasheet
const logicHighVoltage = VIH + VHYS; // calculated High-level input voltage
const resistorSize = 2.4e3 * 1.05; // 2.4Kohm
const capSize = 2.2e-6 * 1.25; // 2.2uF cap
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
				if (this.canOperate()) {
					if (!this.outputs.has(this.name)) {
						// if (process.env.NODE_ENV === 'development') {
						// console.log('this OUTPUT is not defined yet');
						winston.log('info', 'this output is not defined yet');
						// }

						// store in outputs set.
						this.outputs.set(this.name, new Gpio(this.gpio, this.direction));

						// if (process.env.NODE_ENV === 'development') {
						winston.log('info', `\t\t Counting mapped outputs: ${this.outputs.size} and value: ${this.outputs.get(this.name)._gpio}.`);
						// }

						// start Position activated.
						this.watchOutputs.call(this);
						// this.outputs.get(this.selectOutput, this);
					}
					else {
						// start Position activated.
						// if (process.env.NODE_ENV === 'development') {
						winston.log('info', `\tWe are running --- this.direction === 'out') { ELSE breakerModel: ${this.m76xx.breakerModel} and startPosition: ${this.m76xx.startPosition}.`);
						// }
						if (this.canOperate()) {
							this.watchOutputs.call(this);
						}
					}
				}
			}
			else if (this.direction === 'in') {
				if (this.canOperate()) {
					if (!this.inputs.has(this.name)) {
						// if (process.env.NODE_ENV === 'development') {
						winston.log('info', 'this INPUT is not defined yet');
						// }
						this.inputs.set(this.name, new Gpio(this.gpio, this.direction, edge, {
							debounceTimeout: debounceTimeout
						}));

						// if (process.env.NODE_ENV === 'development') {
						winston.log('info', `\t\t Counting mapped inputs: ${this.inputs.size} and value: ${this.inputs.get(this.name)._gpio} and exists: ${this.inputs.has(this.name)} debounceTimeout: ${debounceTimeout} msec.`);
						// }

						let myThis = this;

						this.inputs.get(this.name).watch((err, value) => {

							if (err) {
								throw err;
							}

							// if (process.env.NODE_ENV === 'development') {
							// 	console.time('start');
							// }
							async.parallel(this.speak());
							async.parallel(this.outputs.forEach(this.selectOutput, myThis));

						});
					}
				}
			}
			else if (this.direction === 'update') {
				// if (process.env.NODE_ENV === 'development') {
				winston.log('info', `\t\t User updated values are available.`);
				// }

				// the user changed something that effects only the outputs re-initialize immediately.
				this.watchOutputs.call(this);
			}
			else {
				// if (process.env.NODE_ENV === 'development') {
				winston.log('error', `\t\t Sorry there is no ${this.direction} available.`);
				// }
			}
		}
		else {
			writeSync: (value) => {
				winston.log('info', `virtual led now uses value: ${value}`);
			};
		}
	}

	// handles initial and user updated startPositions of Outputs.
	watchOutputs() {
		if (Gpio.accessible) {
			// if (process.env.NODE_ENV === 'development') {
			winston.log('info', `Setup Class.watchOutputs() is running:`);
			winston.log('info', `name: ${this.name} is running.`);
			winston.log('info', `startPosition: ${this.m76xx.startPosition} is position.`);
			winston.log('info', `breakerModel: ${this.m76xx.breakerModel} is model.`);
			winston.log('info', `operationMode: ${this.m76xx.operationMode} is mode.`);
			winston.log('info', `closeOperationDelay: ${this.m76xx.closeOperationDelay} is close delay.`);
			winston.log('info', `tripOperationDelay: ${this.m76xx.tripOperationDelay} is trip delay.`);
			// }

			// if (this.canOperate()) {
			// 	if (process.env.NODE_ENV === 'development') {
			// 		console.log(`\t\tSetup Class.watchOutputs() is running:`);
			// 		console.log(`\t\tname: ${this.name} is added.`);
			// 	}
			this.outputs.forEach(this.selectOutput, this);
			// }

		}
		else {
			writeSync: (value) => {
				winston.log('info', `virtual led now uses value: ${value}`);
			};
		}
	}

	// provide decision to initialize gpio based on operationMode
	canOperate() {
		/*
		 * Following rules apply:
		 * 1 - All _Cls and All _Opn current interrupters initialize always.
		 * 1 - OperationMode == '3trip 3lockout'
		 *			Only following gpios should be operational:
		 *				a - PhA_52a and PhA_52b
		 *				b - PhA_Trip and PhA_Close		 *
		 */
		if (this.m76xx.operationMode === '3trip 3lockout') {

			if (this.name.toString().endsWith('_Opn') || this.name.toString().endsWith('_Cls') || this.name.toString().startsWith('PhA_')) {

				return true;
			}
			else {

				return false;
			}
		}
		else {
			// TODO: verify this condition accurate for rest of the operationMode-s
			return true;
		}
	}

	// delete the input and release resources used by it.
	// A Gpio object should not be used after invoking its unexport method called before exiting this program.
	unexport() {
		switch (this.direction) {
			case 'in':
				if (this.canOperate) {
					this.inputs.get(this.name).unexport();
				}
				break;

			case 'out':
				if (this.canOperate) {
					this.outputs.get(this.name).unexport();
				}
				break;
			default:
				// code
		}
		// if (process.env.NODE_ENV === 'development') {
		winston.log('info', `Gpio.unexport():\t${this.name} - GPIO${this.gpio} is deleted...`);
		// }
	}

	// Stop watching for hardware interrupts on the GPIO.
	// All callbacks are removed.
	unwatch() {
		if (this.inputs.direction === 'out') {
			throw 'only inputs can be unwatched';
		}
		else {
			this.inputs.get(this.name).unwatch();
			// if (process.env.NODE_ENV === 'development') {
			winston.log('info', `Inputs:\t${this.name} - GPIO${this.gpio} no longer monitored...`);
			// }
		}
	}

	// prints some info about Gpios.
	speak() {
		// if (process.env.NODE_ENV === 'development') {
		winston.log('info', `${IOSetup.name} CLASS TALKS: Input changed detected: \t\t${this.name}`);
		// }
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

		winston.log('info', `\t${key.toString()} operation starts.`);
		// winston.start_log(key.toString(), 'info');
		// to show passing every key.
		// if (process.env.NODE_ENV === 'development') {
		// 	console.time(key.toString());
		// }

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
				winston.stop_log(key.toString(), 'info');
				winston.log('error', `unexpected key.toString() value: ${key.toString()}`);
				// if (process.env.NODE_ENV === 'development') {
				// console.timeEnd(key.toString());
				// }
			}
		}
	}
}

exports.IOSetup = IOSetup;
