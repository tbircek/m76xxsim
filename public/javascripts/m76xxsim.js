#! /usr/bin/env node

/* m76xxsim.js
 * Author: Turgay Bircek
 * Version: 1.0.2
 * Date: 12/18/2018
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
// const beagle = require('./m76xxIOSetup');
let setInputs = require('./m76xxInputs').Inputs;
// let IOSetup = require('./m76xxSetupClass').IOSetup;


// Input variables.
let PhA_Close;
let PhA_Trip;
let PhB_Close;
let PhB_Trip;
let PhC_Close;
let PhC_Trip;

// Output variables.
let PhA_52a;
let PhA_52b;
let PhA_Cls;
let PhA_Opn;
let PhB_52a;
let PhB_52b;
let PhB_Cls;
let PhB_Opn;
let PhC_52a;
let PhC_52b;
let PhC_Cls;
let PhC_Opn;
let Neu_Gnd_Cls;
let Neu_Gnd_Opn;

// interface to the modbus communication library.
// Future use.
// const mdbus = require('./modbus-comm');

// interface to lcd.
// Future use.
// const lcd = require('./lcd');

function IOInit(breakerModel = '52a, 52b', startPosition = 'Close', operationMode = '3trip 3lockout', closeOperationDelay = 0, tripOperationDelay = 0) {

	// Phase A items.
	PhA_52a = new setInputs('PhA_52a', 30, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhA_52a.init();
	PhA_52b = new setInputs('PhA_52b', 115, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhA_52b.init();
	PhA_Cls = new setInputs('PhA_Cls', 88, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhA_Cls.init();
	PhA_Opn = new setInputs('PhA_Opn', 112, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhA_Opn.init();
	PhA_Close = new setInputs('PhA_Close', 26, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhA_Close.init();
	PhA_Trip = new setInputs('PhA_Trip', 47, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhA_Trip.init();
	console.log('Phase A initialization completed.');

	// Phase B items.
	PhB_52a = new setInputs('PhB_52a', 60, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhB_52a.init();
	PhB_52b = new setInputs('PhB_52b', 113, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhB_52b.init();
	PhB_Cls = new setInputs('PhB_Cls', 87, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhB_Cls.init();
	PhB_Opn = new setInputs('PhB_Opn', 110, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhB_Opn.init();
	PhB_Close = new setInputs('PhB_Close', 46, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhB_Close.init();
	PhB_Trip = new setInputs('PhB_Trip', 27, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhB_Trip.init();
	console.log('Phase B initialization completed.');

	// Phase C Items.
	PhC_52a = new setInputs('PhC_52a', 31, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhC_52a.init();
	PhC_52b = new setInputs('PhC_52b', 111, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhC_52b.init();
	PhC_Cls = new setInputs('PhC_Cls', 89, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhC_Cls.init();
	PhC_Opn = new setInputs('PhC_Opn', 20, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhC_Opn.init();
	PhC_Close = new setInputs('PhC_Close', 65, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhC_Close.init();
	PhC_Trip = new setInputs('PhC_Trip', 22, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	PhC_Trip.init();
	console.log('Phase C initialization completed.');

	// Neu/GND items.
	Neu_Gnd_Cls = new setInputs('Neu_Gnd_Cls', 50, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	Neu_Gnd_Cls.init();
	Neu_Gnd_Opn = new setInputs('Neu_Gnd_Opn', 117, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);
	Neu_Gnd_Opn.init();
	console.log('Neu/GND initialization completed.');
}

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
	PhA_Close.unexport();
	PhA_Trip.unexport();
	PhB_Close.unexport();
	PhB_Trip.unexport();
	PhC_Close.unexport();
	PhC_Trip.unexport();
	PhA_52a.unexport();
	PhA_52b.unexport();
	PhA_Cls.unexport();
	PhA_Opn.unexport();
	PhB_52a.unexport();
	PhB_52b.unexport();
	PhB_Cls.unexport();
	PhB_Opn.unexport();
	PhC_52a.unexport();
	PhC_52b.unexport();
	PhC_Cls.unexport();
	PhC_Opn.unexport();
	Neu_Gnd_Cls.unexport();
	Neu_Gnd_Opn.unexport();
	console.log('exiting the program...');
	process.exit();
});

process.on('uncaughtException', function(err) {
	console.log(err);
});

IOInit();
