#! /usr/bin/env node

/* m76xxsim.js
 * Author: Turgay Bircek
 * Version: 1.0.1
 * Date: 11/19/2018
 * 
 * Provides main entry for M76xx Simulator program
 *
 */

/**********************************************************
 *
 * IOControl Options:
 * 
 * breakerModel: match with System Setup>Input>Functions.
 *               options:
 *                        52a only -> Inputs 1, 6 and 8 used only.
 *                        52b only -> Inputs 2, 7 and 9 used only.
 *                        52a, 52b -> Inputs 1, 2, 6, 7, 8, 9 used.
 *                        52a, 52b/69 -> For future use only.
 * 
 * cbPosition:  default start up position for the simulator.
 *              Depending on selected breakerModel, the simulator
 *              set 52a and/or 52b as Close or Trip.
 *              options: 
 *                      Close
 *                      Trip
 * 
 * recloserType: match with System Setup>System>Recloser Type.
 *               options:
 *                      3ph Ganged
 *                      Independent Phase Capable
 * 
 * operationMode: match F79 function>Operation Mode.
 *                3ph ganged options:
 *                                   
 */

// interface to inputs/oututs of beaglebone black.
const beagle = require('./m76xx-io-setup');

var IOControl = require('./m76xxIOs').m76xxIOs;

// // Holds all input values and initialize default values.
// var formData = new FormData();

// interface to the modbus communication library.
// const mdbus = require('./modbus-comm');

// interface to lcd.
// const lcd = require('./lcd');


const beagle3_3V = 3.3; // 3.3V power supply
const VIH = 2.0; // High-level input voltage per datasheet
const VHYS = 0.44; // max Hysteresis voltage at an input per datasheet
const logicHighVoltage = VIH + VHYS; // calculated High-level input voltage
const resistorSize = 2.4e3 * 1.05; // 2.4Kohm
const capSize = 4.7e-6 * 1.2; // 4.7uF cap
const secTomsecRate = 1e3; // 1 sec = 1000msec
const logicHighRatio = (beagle3_3V - logicHighVoltage) / beagle3_3V;
const debounceTime = (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2);

function init(breakerModel = '52a, 52b', startPosition = 'close', operationMode ='3trip 3close', aOperationDelay = 60, bOperationDelay = 60) {

	// connect modbus for future use?
	// mdbus.connect;

	// formData.set('breakerModel', breakerModel);
	// formData.set('operationMode', operationMode);
	// formData.set('aOperationDelay', aOperationDelay);
	// formData.set('bOperationDelay', bOperationDelay);

	console.log('new init() active');
	console.log('breakerModel: ' + breakerModel);
	console.log('startPosition: ' + startPosition);
	console.log('operationMode: ' + operationMode);
	console.log('operationDelayTime52a: ' + aOperationDelay);
	console.log('operationDelayTime52b: ' + bOperationDelay);

	// activeLibrary;
	// library1();
	// IOInit();
	IOControl({
		breakerModel: breakerModel, // '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
		startPosition: startPosition, // 'close', // 'trip', // 
		edge: 'both', // 'none', // 'rising', // 'falling', // 
		// recloserType: 'independent', // 'ganged', // 
		operationMode: operationMode, //'3trip 3close', // '1trip 1close', // '1trip 3close', //
		debounceTime: debounceTime, // (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2), // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds.
		aOperationDelay: aOperationDelay, // 60,
		bOperationDelay: bOperationDelay //60
	});
	
	// library1WithValues(defaultOpts);
	
	// initialization completed.
	console.log('m76xxsim init completed...');

	// load status of all ports from previously saved file 
	// if no file exists create a new one.
}


function IOInit() {

	// attach these values to user interface in web server.
	var userValues = {
		breakerModel: '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
		startPosition: 'Close', // 'Trip', // 
		edge: 'both', // 'none', // 'rising', // 'falling', // 
		recloserType: 'Independent Phase Capable', // '3ph Ganged', // 
		operationMode: '1Trip 1Close', // '3Trip 3Close', // '1Trip 3Close', // 
		// closeDebounceTime: 10, // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds.
		// tripDebounceTime: 10, // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds. 
		tripTime52aDelay: 0, // 
		tripTime52bDelay: 0, // 
		closeTime52aDelay: 0, // 
		closeTime52bDelay: 0 // 
	};
	beagle.UserInputs(userValues);
	// userValues.breakerModel, 
	// userValues.cbPosition,
	// userValues.edge,
	// userValues.recloserType,
	// userValues.operationMode,
	// userValues.closeDebounceTime,
	// userValues.tripDebounceTime,
	// userValues.tripTime52aDelay,
	// userValues.tripTime52bDelay,
	// userValues.closeTime52aDelay,
	// userValues.closeTime52bDelay);

	// Phase A items.
	const PhA_52a = new beagle.Outputs('PhA_52a', 30, 'out');
	const PhA_52b = new beagle.Outputs('PhA_52b', 115, 'out');
	const Phs_A_Cls = new beagle.Outputs('Phs_A_Cls', 88, 'out');
	const Phs_A_Opn = new beagle.Outputs('Phs_A_Opn', 112, 'out');
	const Close_PhA = new beagle.Inputs('Close_PhA', 26, 'in');
	const Trip_PhA = new beagle.Inputs('Trip_PhA', 47, 'in');
	console.log('Phase A initialization completed.');

	// Phase B items.
	const PhB_52a = new beagle.Outputs('PhB_52a', 60, 'out');
	const PhB_52b = new beagle.Outputs('PhB_52b', 113, 'out');
	const Phs_B_Cls = new beagle.Outputs('Phs_B_Cls', 87, 'out');
	const Phs_B_Opn = new beagle.Outputs('Phs_B_Opn', 110, 'out');
	const Close_PhB = new beagle.Inputs('Close_PhB', 46, 'in');
	const Trip_PhB = new beagle.Inputs('Trip_PhB', 27, 'in');
	console.log('Phase B initialization completed.');

	// Phase C Items.
	const PhC_52a = new beagle.Outputs('PhC_52a', 31, 'out');
	const PhC_52b = new beagle.Outputs('PhC_52b', 111, 'out');
	const Phs_C_Cls = new beagle.Outputs('Phs_C_Cls', 89, 'out');
	const Phs_C_Opn = new beagle.Outputs('Phs_C_Opn', 20, 'out');
	const Close_PhC = new beagle.Inputs('Close_PhC', 65, 'in');
	const Trip_PhC = new beagle.Inputs('Trip_PhC', 22, 'in');
	console.log('Phase C initialization completed.');

	// Neu/GND items.
	const Neu_Gnd_Cls = new beagle.Outputs('Neu_Gnd_Cls', 50, 'out');
	const Neu_Gnd_Opn = new beagle.Outputs('Neu_Gnd_Opn', 117, 'out');
	console.log('Neu/GND initialization completed.');

	console.log('name: %s\t\tgpio: %s\tdirection: %s\tedge: %s\tdebounce: %dms',
		Close_PhA.name, Close_PhA.gpio, Close_PhA.direction, Close_PhA.edge, Close_PhA.debounceTimeout);
	console.log('name: %s\t\tgpio: %s\tdirection: %s\tedge: %s\tdebounce: %dms',
		Trip_PhA.name, Trip_PhA.gpio, Trip_PhA.direction, Trip_PhA.edge, Trip_PhA.debounceTimeout);
	console.log('name: %s\t\tgpio: %s\tdirection: %s\tedge: %s\tdebounce: %dms',
		Close_PhB.name, Close_PhB.gpio, Close_PhB.direction, Close_PhB.edge, Close_PhB.debounceTimeout);
	console.log('name: %s\t\tgpio: %s\tdirection: %s\tedge: %s\tdebounce: %dms',
		Trip_PhB.name, Trip_PhB.gpio, Trip_PhB.direction, Trip_PhB.edge, Trip_PhB.debounceTimeout);
	console.log('name: %s\t\tgpio: %s\tdirection: %s\tedge: %s\tdebounce: %dms',
		Close_PhC.name, Close_PhC.gpio, Close_PhC.direction, Close_PhC.edge, Close_PhC.debounceTimeout);
	console.log('name: %s\t\tgpio: %s\tdirection: %s\tedge: %s\tdebounce: %dms',
		Trip_PhC.name, Trip_PhC.gpio, Trip_PhC.direction, Trip_PhC.edge, Trip_PhC.debounceTimeout);
}

// function library2() {

//   console.log('Library 2 init.');
//   // second library.
//   m76xxIOs.init();
//   m76xxIOs.setupNeuGnd();
//   m76xxIOs.setupPhaseABC();
//   m76xxIOs.setupPhaseB();
//   m76xxIOs.setupPhaseC();
//   m76xxIOs.setCBPositions();
// }

function library1() { // first library.

	console.log('Library 1 init.');
	// var ioControl = new IOControl({
	IOControl({
		breakerModel: '52a only', // '52b only', // '52a, 52b/69', //'52a, 52b', //
		startPosition: 'close', // 'trip', // 
		edge: 'both', // 'none', // 'rising', // 'falling', // 
		// recloserType: 'independent', // 'ganged', // 
		operationMode: '1trip 1close', // '3trip 3close', // '1trip 3close', //
		debounceTime: (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2), // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds.
		operationDelayTime52a: 50, // due to javascript constraints
		operationDelayTime52b: 75 // , // due to javascript constraints
		// operationDurationTime52a: 50,
		// operationDurationTime52b: 50
	});
}

function library1WithValues(opts) {

	console.log('library1WithValues active');
	console.log('breakerModel: ' + opts.breakerModel);
	console.log('startPosition: ' + opts.startPosition);
	console.log('operationMode: ' + opts.operationMode);
	console.log('operationDelayTime52a: ' + opts.aOperationDelay);
	console.log('operationDelayTime52b: ' + opts.bOperationDelay);

	// var ioControl = new IOControl({
	IOControl({
		breakerModel: opts.breakerModel, // '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
		startPosition: opts.startPosition, // 'close', // 'trip', // 
		edge: 'both', // 'none', // 'rising', // 'falling', // 
		// recloserType: 'independent', // 'ganged', // 
		operationMode: opts.operationMode, // '1trip 1close', // '3trip 3close', // '1trip 3close', //
		debounceTime: (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2), // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds.
		operationDelayTime52a: opts.aOperationDelay, // 50,
		operationDelayTime52b: opts.bOperationDelay // 75
		// operationDurationTime52a: 50,
		// operationDurationTime52b: 50
	});
}

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
	console.log('exiting the program...');
	process.exit();
});

process.on('uncaughtException', function(err) {
	console.log(err);
});

// entry point.
//module.exports = init();
module.exports = {
	init: init(),
	debounceTime: debounceTime
// 	// initWithValues: library1WithValues
// 	// lib1: library1(breakerModel)
};
