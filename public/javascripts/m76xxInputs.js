#! /usr/bin/env node

/*
 * m76xxInputs.js
 *
 * Copyright (c) 2018-2019 Turgay Bircek
 * Version: 1.0.1
 * Date: 01/08/2019
 *
 * Provides input operations for M76xx Simulator program.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// super class reference.
let IOSetup = require('./m76xxSetupClass').IOSetup;
// GPIO control library.
const Gpio = require('onoff').Gpio;

// arrays to hold input and output gpios.
let outputs = new Map();
let inputs = new Map();

// default M76xx operation parameters.
let m76xx = {
	model: '52a, 52b',
	position: 'Close',
	mode: '3trip 3lockout',
	closeDelay: 0,
	tripDelay: 0,
	get breakerModel() {
		return this.model;
	},
	get startPosition() {
		return this.position;
	},
	get operationMode() {
		return this.mode;
	},
	get closeOperationDelay() {
		return this.closeDelay;
	},
	get tripOperationDelay() {
		return this.tripDelay;
	},
	set breakerModel(val) {
		this.model = val;
	},
	set startPosition(val) {
		this.position = val;
	},
	set operationMode(val) {
		this.mode = val;
	},
	set closeOperationDelay(val) {
		this.closeDelay = val;
	},
	set tripOperationDelay(val) {
		this.tripDelay = val;
	}
};

const TRIP = Gpio.LOW;

const CLOSE = Gpio.HIGH;

class Inputs extends IOSetup {
	constructor(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay) {
		super(name, gpio, direction, breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
		this.outputs = outputs;
		this.inputs = inputs;
		this.m76xx = m76xx;

		if (breakerModel !== undefined) {
			m76xx.breakerModel = breakerModel;
		}
		if (startPosition !== undefined) {
			m76xx.startPosition = startPosition;
		}
		if (operationMode !== undefined) {
			m76xx.operationMode = operationMode;
		}
		if (closeOperationDelay !== undefined) {
			m76xx.closeOperationDelay = closeOperationDelay;
		}
		if (tripOperationDelay !== undefined) {
			m76xx.tripOperationDelay = tripOperationDelay;
		}
	}

	getBreakerModel() {
		return m76xx.breakerModel;
	}

	getStartPosition() {
		return m76xx.startPosition;
	}

	getOperationMode() {
		return m76xx.operationMode;
	}

	getCloseOperationDelay() {
		return m76xx.closeOperationDelay;
	}

	getTripOperationDelay() {
		return m76xx.tripOperationDelay;
	}

	close(outputName) {
		// this refers to setTimeout which don't have this.name
		setTimeout(function() {

			outputs.get(outputName).writeSync(CLOSE);
			// outputs.get(outputName).write(CLOSE);
			if (process.env.NODE_ENV === 'development') {
				console.log(`Inputs.close():\t${outputName} - \tGPIO${outputs.get(outputName)._gpio} is closed...`);
				console.timeEnd(outputName.toString());
				// console.timeLog('close');
			}
		}, m76xx.closeOperationDelay);
	}

	trip(outputName) {

		// this refers to setTimeout which don't have this.name
		setTimeout(function() {

			outputs.get(outputName).writeSync(TRIP);
			// outputs.get(outputName).write(TRIP);
			if (process.env.NODE_ENV === 'development') {
				console.log(`Inputs.trip():\t${outputName} - \tGPIO${outputs.get(outputName)._gpio} is tripped...`);
				console.timeEnd(outputName.toString());
				// console.timeLog('trip');
			}
		}, m76xx.tripOperationDelay);
	}
}

// provides methods to control and initialization of the Inputs.
exports.Inputs = Inputs;
