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
 * startPosition:  default start up position for the simulator.
 *                 Depending on selected breakerModel, the simulator
 *                 set 52a and/or 52b as Close or Trip.
 *                 options: 
 *                        Close
 *                        Trip
 * 
 */

// interface to inputs/oututs of beaglebone black.
const beagle = require('./m76xxIOSetup');

// var IOControl = require('./m76xxIOs').m76xxIOs;

// // Holds all input values and initialize default values.
// var formData = new FormData();

// interface to the modbus communication library.
// const mdbus = require('./modbus-comm');

// interface to lcd.
// const lcd = require('./lcd');


// function init(breakerModel = '52a, 52b', startPosition = 'close', operationMode = '3trip 3close', aOperationDelay = 60, bOperationDelay = 60) {

// 	if (process.env.NODE_ENV === 'development') {
// 		console.log('new init() active');
// 		console.log('breakerModel: ' + breakerModel);
// 		console.log('startPosition: ' + startPosition);
// 		console.log('operationMode: ' + operationMode);
// 		console.log('operationDelayTime52a: ' + aOperationDelay);
// 		console.log('operationDelayTime52b: ' + bOperationDelay);
// 	}

// 	// activeLibrary;
// 	// library1();
// 	// IOInit();
// 	new IOControl({
// 		breakerModel: breakerModel, // '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
// 		startPosition: startPosition, // 'close', // 'trip', // 
// 		edge: 'both', // 'none', // 'rising', // 'falling', //
// 		operationMode: operationMode, //'3trip 3close', // '1trip 1close', // '1trip 3close', //
// 		debounceTime: debounceTime,
// 		aOperationDelay: aOperationDelay, // 60,
// 		bOperationDelay: bOperationDelay //60
// 	});

// 	// initialization completed.
// 	console.log('m76xxsim init completed...');
// }


function IOInit(breakerModel = '52a, 52b', startPosition = 'close', operationMode = '3trip 3close', aOperationDelay = 60, bOperationDelay = 60) {

	// // attach these values to user interface in web server.
	let userValues = {
		breakerModel: breakerModel, // '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
		startPosition: startPosition, // 'close', // 'trip', // 
		operationMode: operationMode, //'3trip 3close', // '1trip 1close', // '1trip 3close', //
		aOperationDelay: aOperationDelay, // 60,
		bOperationDelay: bOperationDelay //60
	};

	new beagle.UserInputs(userValues);

	if (process.env.NODE_ENV === 'development') {
		console.log('IOInit:\tNew userValues:');
		console.log('IOInit:\tNew userValues:\tBreaker Model: ' + userValues.breakerModel);
		console.log('IOInit:\tNew userValues:\tStart Position: ' + userValues.startPosition);
		console.log('IOInit:\tNew userValues:\tOperation Mode: ' + userValues.operationMode);
		console.log('IOInit:\tNew userValues:\t52a Operation Delay: ' + userValues.aOperationDelay);
		console.log('IOInit:\tNew userValues:\t52b Operation Delay: ' + userValues.bOperationDelay);
	}

	// Phase A items.
	let PhA_52a = new beagle.Outputs('PhA_52a', 30, 'out');
	let PhA_52b = new beagle.Outputs('PhA_52b', 115, 'out');
	let Phs_A_Cls = new beagle.Outputs('Phs_A_Cls', 88, 'out');
	let Phs_A_Opn = new beagle.Outputs('Phs_A_Opn', 112, 'out');
	let Close_PhA = new beagle.Inputs('Close_PhA', 26, 'in');
	let Trip_PhA = new beagle.Inputs('Trip_PhA', 47, 'in');
	PhA_52a.Read();
	// Close_PhA.Watch();
	// Trip_PhA.Watch();
	console.log('Phase A initialization completed.');
	// Phase B items.
	let PhB_52a = new beagle.Outputs('PhB_52a', 60, 'out');
	let PhB_52b = new beagle.Outputs('PhB_52b', 113, 'out');
	let Phs_B_Cls = new beagle.Outputs('Phs_B_Cls', 87, 'out');
	let Phs_B_Opn = new beagle.Outputs('Phs_B_Opn', 110, 'out');
	let Close_PhB = new beagle.Inputs('Close_PhB', 46, 'in');
	let Trip_PhB = new beagle.Inputs('Trip_PhB', 27, 'in');
	console.log('Phase B initialization completed.');
	var map1 = new Map();
	map1.set(PhB_52a = new beagle.Outputs('PhB_52a', 60, 'out'), PhB_52b = new beagle.Outputs('PhB_52b', 113, 'out'));

	console.log('MAP 1 is here : .... ' + map1.get(PhB_52a.name));
	// Phase C Items.
	let PhC_52a = new beagle.Outputs('PhC_52a', 31, 'out');
	let PhC_52b = new beagle.Outputs('PhC_52b', 111, 'out');
	let Phs_C_Cls = new beagle.Outputs('Phs_C_Cls', 89, 'out');
	let Phs_C_Opn = new beagle.Outputs('Phs_C_Opn', 20, 'out');
	let Close_PhC = new beagle.Inputs('Close_PhC', 65, 'in');
	let Trip_PhC = new beagle.Inputs('Trip_PhC', 22, 'in');
	console.log('Phase C initialization completed.');

	// Neu/GND items.
	let Neu_Gnd_Cls = new beagle.Outputs('Neu_Gnd_Cls', 50, 'out');
	let Neu_Gnd_Opn = new beagle.Outputs('Neu_Gnd_Opn', 117, 'out');
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

	if (startPosition === 'close') {
		PhA_52a.Close();
		PhB_52a.Close();
		PhC_52a.Close();
	}
	else if (startPosition === 'trip') {
		PhA_52a.Trip();
		PhB_52a.Trip();
		PhC_52a.Trip();
	}
	else {
		if (process.env.NODE_ENV === 'development') {
			console.log('no startPosition: ' + startPosition);
		}
	}
	// to ignore gpios.
	// Close_PhA.Unwatch();
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

// function library1() { 

// 	console.log('Library 1 init.');
// 	// var ioControl = new IOControl({
// 	IOControl({
// 		breakerModel: '52a only', // '52b only', // '52a, 52b/69', //'52a, 52b', //
// 		startPosition: 'close', // 'trip', // 
// 		edge: 'both', // 'none', // 'rising', // 'falling', // 
// 		// recloserType: 'independent', // 'ganged', // 
// 		operationMode: '1trip 1close', // '3trip 3close', // '1trip 3close', //
// 		debounceTime: (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2), // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds.
// 		operationDelayTime52a: 50, // due to javascript constraints
// 		operationDelayTime52b: 75 // , // due to javascript constraints
// 		// operationDurationTime52a: 50,
// 		// operationDurationTime52b: 50
// 	});
// }

// function library1WithValues(opts) {

// 	console.log('library1WithValues active');
// 	console.log('breakerModel: ' + opts.breakerModel);
// 	console.log('startPosition: ' + opts.startPosition);
// 	console.log('operationMode: ' + opts.operationMode);
// 	console.log('operationDelayTime52a: ' + opts.aOperationDelay);
// 	console.log('operationDelayTime52b: ' + opts.bOperationDelay);

// 	// var ioControl = new IOControl({
// 	IOControl({
// 		breakerModel: opts.breakerModel, // '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
// 		startPosition: opts.startPosition, // 'close', // 'trip', // 
// 		edge: 'both', // 'none', // 'rising', // 'falling', // 
// 		// recloserType: 'independent', // 'ganged', // 
// 		operationMode: opts.operationMode, // '1trip 1close', // '3trip 3close', // '1trip 3close', //
// 		debounceTime: (-Math.log(logicHighRatio) * (resistorSize * capSize * secTomsecRate)).toPrecision(2), // The watch callback will not be invoked until the input stops bouncing and has been in a stable state for debounceTimeout milliseconds.
// 		operationDelayTime52a: opts.aOperationDelay, // 50,
// 		operationDelayTime52b: opts.bOperationDelay // 75
// 		// operationDurationTime52a: 50,
// 		// operationDurationTime52b: 50
// 	});
// }

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
	console.log('exiting the program...');
	process.exit();
	// beagle.Inputs.prototype.UnwatchAll.call();
});

process.on('uncaughtException', function(err) {
	console.log(err);
});

IOInit();
// entry point.
// exports.initAll = IOInit();
//module.exports = init();
// module.exports = {
// 	init: IOInit(), // init(),
// 	// debounceTime: debounceTime
// 	// 	// initWithValues: library1WithValues
// 	// 	// lib1: library1(breakerModel)
// };
