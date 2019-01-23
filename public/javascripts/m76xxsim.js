#! /usr/bin/env node

/* m76xxsim.js
 * Author: Turgay Bircek
 * Version: 1.0.3
 * Date: 01/23/2019
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

// the logger.
var winston = require('../../winston');

// interface to inputs/oututs of beaglebone black.
let setInputs = require('./m76xxInputs').Inputs;


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

// user inputs
let breakerModel;
let startPosition;
let operationMode;
let closeOperationDelay;
let tripOperationDelay;

// interface to the modbus communication library.
// Future use.
// const mdbus = require('./modbus-comm');

// interface to lcd.
const lcd = require('./lcd');

function IOInit() {

	// update the log.
	winston.log('info', 'program inits...');

	lcd.clear;
	/*********************************
	 * 
	 * Input items.
	 * Ph A always enabled.
	 * Ph B and Ph C enabled only if operationMode = '3trip 3lockout'
	 * 
	 * *******************************/
	PhA_Trip = new setInputs('PhA_Trip', 47, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_Close = new setInputs('PhA_Close', 26, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhB_Close = new setInputs('PhB_Close', 46, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhB_Trip = new setInputs('PhB_Trip', 27, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhC_Close = new setInputs('PhC_Close', 65, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhC_Trip = new setInputs('PhC_Trip', 22, 'in', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_Trip.init();
	PhA_Close.init();
	PhB_Trip.init();
	PhB_Close.init();
	PhC_Trip.init();
	PhC_Close.init();
	
	winston.log('info', 'Input initialization completed.');

	/*********************************
	 * 
	 * Current interrupting items.
	 * These items always initialized.
	 * 
	 * *******************************/
	Neu_Gnd_Opn = new setInputs('Neu_Gnd_Opn', 117, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	Neu_Gnd_Cls = new setInputs('Neu_Gnd_Cls', 50, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_Opn = new setInputs('PhA_Opn', 112, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_Cls = new setInputs('PhA_Cls', 88, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhB_Opn = new setInputs('PhB_Opn', 110, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhB_Cls = new setInputs('PhB_Cls', 87, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhC_Opn = new setInputs('PhC_Opn', 20, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhC_Cls = new setInputs('PhC_Cls', 89, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_Opn.init();
	PhA_Cls.init();
	PhB_Opn.init();
	PhB_Cls.init();
	PhC_Opn.init();
	PhC_Cls.init();
	Neu_Gnd_Opn.init();
	Neu_Gnd_Cls.init();
	winston.log('info', 'Current interrupter initialization completed.');

	/*********************************
	 * 
	 * Output items.
	 * Ph A always enabled.
	 * Ph B and Ph C enabled only if operationMode = '3trip 3lockout'
	 * 
	 * *******************************/
	PhA_52a = new setInputs('PhA_52a', 30, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_52b = new setInputs('PhA_52b', 115, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhB_52a = new setInputs('PhB_52a', 60, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhB_52b = new setInputs('PhB_52b', 113, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhC_52a = new setInputs('PhC_52a', 31, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhC_52b = new setInputs('PhC_52b', 111, 'out', breakerModel, startPosition, operationMode, closeOperationDelay, tripOperationDelay);

	PhA_52a.init();
	PhA_52b.init();
	// if (PhA_Trip.getOperationMode() !== '3trip 3lockout') {
	PhB_52a.init();
	PhB_52b.init();
	PhC_52a.init();
	PhC_52b.init();
	// }
	winston.log('info', 'Output initialization completed.');
	// lcd();
}

// once ran no possiblity of using same gpio ports.
// run it before stopping program.
function unexportAll() {
	PhA_Close.unexport();
	PhA_Trip.unexport();
	PhA_52a.unexport();
	PhA_52b.unexport();
	PhA_Cls.unexport();
	PhA_Opn.unexport();
	PhB_Cls.unexport();
	PhB_Opn.unexport();
	PhC_Cls.unexport();
	PhC_Opn.unexport();

	Neu_Gnd_Cls.unexport();
	Neu_Gnd_Opn.unexport();

	if (PhA_Trip.getOperationMode() !== '3trip 3lockout') {
		PhB_Close.unexport();
		PhB_Trip.unexport();
		PhB_52a.unexport();
		PhB_52b.unexport();
		PhC_Close.unexport();
		PhC_Trip.unexport();
		PhC_52a.unexport();
		PhC_52b.unexport();
	}

	winston.log('info', `operationMode ... ${PhA_Trip.getOperationMode()}`);
}

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
	winston.log('info', `exiting the program...`);
	unexportAll();
	// lcd.close();
	process.exit();
});

process.on('uncaughtException', function(err) {
	winston.log('error', err);
});

// call by the user interactions in webpage.
function IOUserInit(userBreakerModel, userStartPosition, userOperationMode, userCloseOperationDelay, userTripOperationDelay) {
	breakerModel = userBreakerModel;
	startPosition = userStartPosition;
	operationMode = userOperationMode;
	closeOperationDelay = userCloseOperationDelay;
	tripOperationDelay = userTripOperationDelay;

	// if (process.env.NODE_ENV === 'development') {
	winston.log('info', `we are called.\twith following new values\n\tuserBreakerModel: ${userBreakerModel}\tuserStartPosition: ${userStartPosition}\tuserOperationMode: ${userOperationMode}\tuserCloseOperationDelay: ${userCloseOperationDelay}\tuserTripOperationDelay: ${userTripOperationDelay}`);
	// }

	// initialize every gpio ports again.
	IOInit.call(this);
}

IOInit();
exports.IOUserInit = IOUserInit;
