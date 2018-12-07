#! /usr/bin/env node

/*
 * m76xxIOs.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.1
 * Date: 11/15/2018
 *
 * Provides IO functionality of a Recloser.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

// 'use strict';

// TODO: Add file reading system instead of hard coding pins.

// var debug = true;

if (process.env.NODE_ENV === 'development') {
	var assert = require('assert');
}

// Logic One;
const Logic1 = 1;

// Logic zero;
const Logic0 = 0;

// GPIO control library.
const Gpio = require('onoff').Gpio;

function m76xxIOs(opts) {
	
	this.bind({
		aOperationDelay: opts.aOperationDelay
	});


	// Phase A Setup
	const { Phs_A_Cls, Phs_A_Opn, PhA_52a, PhA_52b, Close_PhA, Trip_PhA } = Setup_Phase_A(opts);
	// Phase B
	const { Phs_B_Cls, Phs_B_Opn, PhB_52a, PhB_52b, Close_PhB, Trip_PhB } = Setup_Phase_B(opts);
	// Phase C Setup
	const { Phs_C_Cls, Phs_C_Opn, PhC_52a, PhC_52b, Close_PhC, Trip_PhC } = Setup_Phase_C(opts);
	// }

	// Fault interrupt for Ig or Ineu.
	const { Neu_Gnd_Cls, Neu_Gnd_Opn } = Setup_Neu_Gnd();

	if (process.env.NODE_ENV === 'development') {
		// reset counters.
		var phATripCounter = 0;
		var phACloseCounter = 0;
		var phBTripCounter = 0;
		var phBCloseCounter = 0;
		var phCTripCounter = 0;
		var phCCloseCounter = 0;
		var totalCloseCounter = 0;
		var totalTripCounter = 0;
		var totalCloseTime = 0;
		var totalTripTime = 0;
		console.log('m76xxIOs:\n\tPhase IOs activated...');
		console.log('\t52a Delay:\t%dms\t52b Delay:\t%dms', opts.aOperationDelay, opts.bOperationDelay);
	}

	/************************************************************
	 * 
	 * Set default options.
	 * cbPosition = close -> 52a is close
	 * cbPosition = trip  -> 52a is open
	 * 
	 **************************************************************/

	// Operate 52a and/or 52b immediately.
	if (opts.startPosition === 'close') {
		switch (opts.breakerModel) {
			case '52a only':
			case '52a only, 52b':
				Close_PhA_52a_Only();
				Close_PhB_52a_Only();
				Close_PhC_52a_Only();
				break;
			case '52b only':
			case '52a, 52b only':
				Close_PhA_52b_Only();
				Close_PhB_52b_Only();
				Close_PhC_52b_Only();
				break;
			case '52a, 52b':
			case '52a, 52b/69':
				Close_PhA_52a_52b();
				Close_PhB_52a_52b();
				Close_PhC_52a_52b();
				break;
			default:
				console.log('Sorry, we are out of ' + opts.breakerModel + '.');
				break;
		}
	}
	else if (opts.startPosition === 'trip') {
		switch (opts.breakerModel) {
			case '52a only':
			case '52a only, 52b':
				Trip_PhA_52a_Only();
				Trip_PhB_52a_Only();
				Trip_PhC_52a_Only();
				break;
			case '52b only':
			case '52a, 52b only':
				Trip_PhA_52b_Only();
				Trip_PhB_52b_Only();
				Trip_PhC_52b_Only();
				break;
			case '52a, 52b':
			case '52a, 52b/69':
				Trip_PhA_52a_52b();
				Trip_PhB_52a_52b();
				Trip_PhC_52a_52b();
				break;
			default:
				console.log('Sorry, we are out of ' + opts.breakerModel + '.');
				break;
		}
	}
	else {
		console.log('startPosition: ' + opts.startPosition);
		console.log('invalid startPosition.');
	}

	// Ph A operations.
	Close_PhA.watch(function(err, value) {
		if (err) {
			throw err;
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('Close A_breakerModel: ' + opts.breakerModel);
			console.log('value: ' + value);
		}

		if (opts.breakerModel.includes('a only')) {
			console.log('52a only... right?');
			Close_PhA_52a_Only();
		}
		else if (opts.breakerModel.includes('b only')) {
			console.log('52b only... right?');
			Close_PhA_52b_Only();
		}
		else if (opts.breakerModel.includes(', ')) {
			console.log('52a, 52b... right?');
			Close_PhA_52a_52b();
		}
		else {
			console.log('Sorry, we are out of ' + opts.breakerModel + '.');
		}
	});

	Trip_PhA.watch(function(err, value) {
		if (err) {
			throw err;
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('Trip A_breakerModel: ' + opts.breakerModel);
			console.log('value: ' + value);
		}

		if (opts.breakerModel.includes('a only')) {
			console.log('52a only... right?');
			Trip_PhA_52a_Only();
		}
		else if (opts.breakerModel.includes('b only')) {
			console.log('52b only... right?');
			Trip_PhA_52b_Only();
		}
		else if (opts.breakerModel.includes(', ')) {
			console.log('52a, 52b... right?');
			Trip_PhA_52a_52b();
		}
		else {
			console.log('Sorry, we are out of ' + opts.breakerModel + '.');
		}
	});

	// Ph B operations.
	Close_PhB.watch(function(err, value) {
		if (err) {
			throw err;
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('Close B_breakerModel: ' + opts.breakerModel);
		}

		if (opts.breakerModel.includes('a only')) {
			console.log('52a only... right?');
			Close_PhB_52a_Only();
		}
		else if (opts.breakerModel.includes('b only')) {
			console.log('52b only... right?');
			Close_PhB_52b_Only();
		}
		else if (opts.breakerModel.includes(', ')) {
			console.log('52a, 52b... right?');
			Close_PhB_52a_52b();
		}
		else {
			console.log('Sorry, we are out of ' + opts.breakerModel + '.');
		}
	});

	Trip_PhB.watch(function(err, value) {
		if (err) {
			throw err;
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('Trip B_breakerModel: ' + opts.breakerModel);
		}

		if (opts.breakerModel.includes('a only')) {
			console.log('52a only... right?');
			Trip_PhB_52a_Only();
		}
		else if (opts.breakerModel.includes('b only')) {
			console.log('52b only... right?');
			Trip_PhB_52b_Only();
		}
		else if (opts.breakerModel.includes(', ')) {
			console.log('52a, 52b... right?');
			Trip_PhB_52a_52b();
		}
		else {
			console.log('Sorry, we are out of ' + opts.breakerModel + '.');
		}
	});

	// Ph C operations.
	Close_PhC.watch(function(err, value) {
		if (err) {
			throw err;
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('Close C_breakerModel: ' + opts.breakerModel);
		}

		if (opts.breakerModel.includes('a only')) {
			console.log('52a only... right?');
			Close_PhC_52a_Only();
		}
		else if (opts.breakerModel.includes('b only')) {
			console.log('52b only... right?');
			Close_PhC_52b_Only();
		}
		else if (opts.breakerModel.includes(', ')) {
			console.log('52a, 52b... right?');
			Close_PhC_52a_52b();
		}
		else {
			console.log('Sorry, we are out of ' + opts.breakerModel + '.');
		}
	});

	Trip_PhC.watch(function(err, value) {
		if (err) {
			throw err;
		}

		if (process.env.NODE_ENV === 'development') {
			console.log('Trip C_breakerModel: ' + opts.breakerModel);
		}

		if (opts.breakerModel.includes('a only')) {
			console.log('52a only... right?');
			Trip_PhC_52a_Only();
		}
		else if (opts.breakerModel.includes('b only')) {
			console.log('52b only... right?');
			Trip_PhC_52b_Only();
		}
		else if (opts.breakerModel.includes(', ')) {
			console.log('52a, 52b... right?');
			Trip_PhC_52a_52b();
		}
		else {
			console.log('Sorry, we are out of ' + opts.breakerModel + '.');
		}
	});

	// Handles Trip operation of Phase A.
	// 52a only
	function Trip_PhA_52a_Only() {
		if (process.env.NODE_ENV === 'development') {
			console.log('52a only - TRIP PH A is running.');
		}
		// Wait out for 52a delay time.
		Phs_A_Cls.writeSync(Logic0);
		Phs_A_Opn.writeSync(Logic1);
		PhA_52a.writeSync(Logic0);
	}

	// Handles Trip operation of Phase B.
	// 52a only
	function Trip_PhB_52a_Only() {
		// Wait out for 52a delay time
		if (process.env.NODE_ENV === 'development') {
			console.log('52a only - TRIP PH B is running.');
		}
		Phs_B_Cls.writeSync(Logic0);
		Phs_B_Opn.writeSync(Logic1);
		PhB_52a.writeSync(Logic0);
	}

	// Handles Trip operation of Phase B.
	// 52a only
	function Trip_PhC_52a_Only() {
		// Wait out for 52a delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52a only - TRIP PH C is running.');
		}
		Phs_C_Cls.writeSync(Logic0);
		Phs_C_Opn.writeSync(Logic1);
		PhC_52a.writeSync(Logic0);
	}

	// Handles Trip operation of Phase A.
	// 52b only
	function Trip_PhA_52b_Only() {
		// Wait out for 52b delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52b only - TRIP PH A is running.');
		}
		Phs_A_Cls.writeSync(Logic0);
		Phs_A_Opn.writeSync(Logic1);
		PhA_52b.writeSync(Logic1);
	}

	// Handles Trip operation of Phase B.
	// 52b only
	function Trip_PhB_52b_Only() {
		// Wait out for 52b delay time. 
		if (process.env.NODE_ENV === 'development') {
			console.log('52b only - TRIP PH B is running.');
		}
		Phs_B_Cls.writeSync(Logic0);
		Phs_B_Opn.writeSync(Logic1);
		PhB_52b.writeSync(Logic1);
	}

	// Handles Trip operation of Phase C.
	// 52b only
	function Trip_PhC_52b_Only() {
		// Wait out for 52b delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52b only - TRIP PH C is running.');
		}
		Phs_C_Cls.writeSync(Logic0);
		Phs_C_Opn.writeSync(Logic1);
		PhC_52b.writeSync(Logic1);
	}

	// Handles Trip operation of Phase A.
	// 52a, 52b
	// 52a, 52b/69
	function Trip_PhA_52a_52b() {
		if (process.env.NODE_ENV === 'development') {
			phACloseCounter = 0;
			var phATripStart = process.hrtime();
			console.log('52a, 52b - TRIP PH A is running.');
		}

		// Wait out for 52b delay time than operates following code. 
		setTimeout(function() {
			// interrupt fault currents.
			Phs_A_Cls.writeSync(Logic0);
			Phs_A_Opn.writeSync(Logic1);
			Neu_Gnd_Cls.writeSync(Logic0);
			Neu_Gnd_Opn.writeSync(Logic1);
			// 52a = 0
			PhA_52a.writeSync(Logic0);
		}, opts.operationDelayTime52a);

		// Wait out for 52a delay time. 
		setTimeout(function() {
			// 52b = 1
			PhA_52b.writeSync(Logic1);
		}, opts.operationDelayTime52b);

		if (process.env.NODE_ENV === 'development') {
			phATripCounter++;
			totalTripCounter++;
			var phATripStop = process.hrtime(phATripStart);
			console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'A', 'Trip', (phATripStop[1] / 1e6).toPrecision(3), phATripCounter);
			totalTripTime += (((phATripStop[0] * 1e9) + phATripStop[1]) / 1e6);
			console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', totalTripTime.toPrecision(3), (totalTripTime / totalTripCounter).toPrecision(3), 'Trip', totalTripCounter);
		}
	}

	// Handles Trip operation of Phase B.
	// 52a, 52b
	// 52a, 52b/69
	function Trip_PhB_52a_52b() {
		if (process.env.NODE_ENV === 'development') {
			phBCloseCounter = 0;
			var phBTripStart = process.hrtime();
			console.log('52a, 52b - TRIP PH B is running.');
		}

		setTimeout(function() {
			// interrupt fault currents.
			Phs_B_Cls.writeSync(Logic0);
			Phs_B_Opn.writeSync(Logic1);
			Neu_Gnd_Cls.writeSync(Logic0);
			Neu_Gnd_Opn.writeSync(Logic1);

			// 52a = 0
			PhB_52a.writeSync(Logic0);
		}, opts.tripTime52aDelay);

		// Wait out for 52a delay time.
		setTimeout(function() {
			// 52b = 1
			PhB_52b.writeSync(Logic1);
		}, opts.tripTime52bDelay);

		if (process.env.NODE_ENV === 'development') {
			phBTripCounter++;
			totalTripCounter++;
			var phBTripStop = process.hrtime(phBTripStart);
			console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'B', 'Trip', (phBTripStop[1] / 1e6).toPrecision(3), phBTripCounter);
			totalTripTime += (((phBTripStop[0] * 1e9) + phBTripStop[1]) / 1e6);
			console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', totalTripTime.toPrecision(3), (totalTripTime / totalTripCounter).toPrecision(3), 'Trip', totalTripCounter);
		}
	}

	// Handles Trip operation of Phase C.
	// 52a, 52b
	// 52a, 52b/69
	function Trip_PhC_52a_52b() {
		if (process.env.NODE_ENV === 'development') {
			phCCloseCounter = 0;
			var phCTripStart = process.hrtime();
			console.log('52a, 52b - TRIP PH C is running.');
		}

		setTimeout(function() {
			// interrupt fault currents.
			Phs_C_Cls.writeSync(Logic0);
			Phs_C_Opn.writeSync(Logic1);
			Neu_Gnd_Cls.writeSync(Logic0);
			Neu_Gnd_Opn.writeSync(Logic1);

			// 52a = 0
			PhC_52a.writeSync(Logic0);
		}, opts.tripTime52aDelay);

		// Wait out for 52a delay time.
		setTimeout(function() {
			// 52b = 1
			PhC_52b.writeSync(Logic1);
		}, opts.tripTime52bDelay);

		if (process.env.NODE_ENV === 'development') {
			phCTripCounter++;
			totalTripCounter++;
			var phCTripStop = process.hrtime(phCTripStart);
			console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'C', 'Trip', (phCTripStop[1] / 1e6).toPrecision(3), phCTripCounter);
			totalTripTime += (((phCTripStop[0] * 1e9) + phCTripStop[1]) / 1e6);
			console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', totalTripTime.toPrecision(3), (totalTripTime / totalTripCounter).toPrecision(3), 'Trip', totalTripCounter);
		}
	}

	// Handles Close operation of Phase A.
	// 52a only
	function Close_PhA_52a_Only() {
		// Wait out for 52a delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52a only - CLOSE PH A is running.');
		}
		Phs_A_Cls.writeSync(Logic1);
		Phs_A_Opn.writeSync(Logic0);
		Neu_Gnd_Cls.writeSync(Logic1);
		Neu_Gnd_Opn.writeSync(Logic0);

		PhA_52a.writeSync(Logic1);
	}

	// Handles Close operation of Phase B.
	// 52a only
	function Close_PhB_52a_Only() {
		// Wait out for 52a delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52a only - CLOSE PH B is running.');
		}
		Phs_B_Cls.writeSync(Logic0);
		Phs_B_Opn.writeSync(Logic1);

		PhB_52a.writeSync(Logic1);
	}

	// Handles Close operation of Phase C.
	// 52a only
	function Close_PhC_52a_Only() {
		// Wait out for 52a delay time. 
		if (process.env.NODE_ENV === 'development') {
			console.log('52a only - CLOSE PH C is running.');
		}
		Phs_C_Cls.writeSync(Logic1);
		Phs_C_Opn.writeSync(Logic0);
		PhC_52a.writeSync(Logic1);
	}

	// Handles Close operation of Phase A.
	// 52b only
	function Close_PhA_52b_Only() {
		// Wait out for 52b delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52b only - CLOSE PH A is running.');
		}
		Phs_A_Cls.writeSync(Logic1);
		Phs_A_Opn.writeSync(Logic0);
		PhA_52b.writeSync(Logic0);
	}

	// Handles Close operation of Phase B.
	// 52b only
	function Close_PhB_52b_Only() {
		// Wait out for 52b delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52b only - CLOSE PH B is running.');
		}
		Phs_B_Cls.writeSync(Logic1);
		Phs_B_Opn.writeSync(Logic0);
		PhB_52b.writeSync(Logic0);
	}

	function Close_PhC_52b_Only() {
		// Wait out for 52b delay time.
		if (process.env.NODE_ENV === 'development') {
			console.log('52b only - CLOSE PH C is running.');
		}
		Phs_C_Cls.writeSync(Logic1);
		Phs_C_Opn.writeSync(Logic0);
		PhC_52b.writeSync(Logic0);
		// }, opts.closeTime52bDelay);
	}

	// Handles Close operation of Phase A.
	// 52a, 52b
	// 52a, 52b/69
	function Close_PhA_52a_52b() {
		if (process.env.NODE_ENV === 'development') {
			phATripCounter = 0;
			var phACloseStart = process.hrtime();
			console.log('52a, 52b - CLOSE PH A is running.');
		}

		// Wait out for 52a delay time. 
		setTimeout(function() {

			// interrupt fault currents.
			Phs_A_Cls.writeSync(Logic1);
			Phs_A_Opn.writeSync(Logic0);
			Neu_Gnd_Cls.writeSync(Logic1);
			Neu_Gnd_Opn.writeSync(Logic0);

			// 52b = 0
			PhA_52b.writeSync(Logic0);

		}, opts.operationDelayTime52b);


		// Wait out for 52b delay time. 
		setTimeout(function() {
			// 52a = 1
			PhA_52a.writeSync(Logic1);
		}, opts.operationDelayTime52a);

		if (process.env.NODE_ENV === 'development') {
			phACloseCounter++;
			totalCloseCounter++;
			var phACloseStop = process.hrtime(phACloseStart);
			console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'A', 'Close', (phACloseStop[1] / 1e6).toPrecision(3), phACloseCounter);
			totalCloseTime += (((phACloseStop[0] * 1e9) + phACloseStop[1]) / 1e6);
			console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', totalCloseTime.toPrecision(3), (totalCloseTime / totalCloseCounter).toPrecision(3), 'Close', totalCloseCounter);
		}
	}

	// Handles Close operation of Phase B.
	// 52a, 52b
	// 52a, 52b/69
	function Close_PhB_52a_52b() {

		if (process.env.NODE_ENV === 'development') {
			phBTripCounter = 0;
			var phBCloseStart = process.hrtime();
			console.log('52a, 52b - CLOSE PH B is running.');
		}
		setTimeout(function() {
			// interrupt fault currents.
			Phs_B_Cls.writeSync(Logic1);
			Phs_B_Opn.writeSync(Logic0);
			Neu_Gnd_Cls.writeSync(Logic1);
			Neu_Gnd_Opn.writeSync(Logic0);

			// 52b = 0
			PhB_52b.writeSync(Logic0);
		}, opts.closeTime52bDelay);

		// Wait out for 52a delay time.
		setTimeout(function() {
			// 52a = 1
			PhB_52a.writeSync(Logic1);
		}, opts.closeTime52aDelay);

		if (process.env.NODE_ENV === 'development') {
			phBCloseCounter++;
			totalCloseCounter++;
			var phBCloseStop = process.hrtime(phBCloseStart);
			console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'B', 'Close', (phBCloseStop[1] / 1e6).toPrecision(3), phBCloseCounter);
			totalCloseTime += (((phBCloseStop[0] * 1e9) + phBCloseStop[1]) / 1e6);
			console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', totalCloseTime.toPrecision(3), (totalCloseTime / totalCloseCounter).toPrecision(3), 'Close', totalCloseCounter);
		}
	}

	// Handles Close operation of Phase C.
	// 52a, 52b
	// 52a, 52b/69
	function Close_PhC_52a_52b() {

		if (process.env.NODE_ENV === 'development') {
			phCTripCounter = 0;
			var phCCloseStart = process.hrtime();
			console.log('52a, 52b - CLOSE PH C is running.');
		}

		setTimeout(function() {
			// interrupt fault currents.
			Phs_C_Cls.writeSync(Logic1);
			Phs_C_Opn.writeSync(Logic0);
			Neu_Gnd_Cls.writeSync(Logic1);
			Neu_Gnd_Opn.writeSync(Logic0);

			// 52b = 0
			PhC_52b.writeSync(Logic0);
		}, opts.closeTime52bDelay);

		// Wait out for 52a delay time. 
		setTimeout(function() {
			// 52a = 1
			PhC_52a.writeSync(Logic1);
		}, opts.closeTime52aDelay);

		if (process.env.NODE_ENV === 'development') {
			phCCloseCounter++;
			totalCloseCounter++;
			var phCCloseStop = process.hrtime(phCCloseStart);
			console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'C', 'Close', (phCCloseStop[1] / 1e6).toPrecision(3), phCCloseCounter);
			totalCloseTime += (((phCCloseStop[0] * 1e9) + phCCloseStop[1]) / 1e6);
			console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', totalCloseTime.toPrecision(3), (totalCloseTime / totalCloseCounter).toPrecision(3), 'Close', totalCloseCounter);
		}
	}
}

// Setup Phase A IOs.
function Setup_Phase_A(opts) {
	if (process.env.NODE_ENV === 'development') {
		console.log('<=== Setup Phase A setup is RUNNING ===>');
	}
	const Close_PhA = new Gpio(26, 'in', opts.edge, {
		debounceTimeout: opts.debounceTime,
		label: 'Close_PhA'
	});
	const Trip_PhA = new Gpio(47, 'in', opts.edge, {
		debounceTimeout: opts.debounceTime,
		label: 'Trip_PhA'
	});

	const PhA_52a = new Gpio(30, 'out', {
		label: 'PhA_52a'
	}); // Ph A 52a
	const PhA_52b = new Gpio(115, 'out', {
		label: 'PhA_52b'
	}); // Ph A 52b
	const Phs_A_Cls = new Gpio(88, 'out', {
		label: 'Phs_A_Cls'
	}); // Phs_A_Cls
	const Phs_A_Opn = new Gpio(112, 'out', {
		label: 'Phs_A_Opn'
	}); // Phs_A_Opn

	if (process.env.NODE_ENV === 'development') {
		// verify actual vs set values.
		assesValues(Close_PhA, Trip_PhA, opts, 'Close_PhA', 'Trip_PhA');
	}

	return { Phs_A_Cls, Phs_A_Opn, PhA_52a, PhA_52b, Close_PhA, Trip_PhA };
}

// Setup Phase B IOs.
function Setup_Phase_B(opts) {
	if (process.env.NODE_ENV === 'development') {
		console.log('<=== Setup Phase B setup is RUNNING ===>');
	}
	const Close_PhB = new Gpio(46, 'in', opts.edge, {
		debounceTimeout: opts.debounceTime,
		label: 'Close_PhB'
	});
	const Trip_PhB = new Gpio(27, 'in', opts.edge, {
		debounceTimeout: opts.debounceTime,
		label: 'Trip_PhB'
	});
	const PhB_52a = new Gpio(60, 'out', {
		label: 'PhB_52a'
	}); // Ph B 52a
	const PhB_52b = new Gpio(113, 'out', {
		label: 'PhB_52b'
	}); // Ph B 52b
	const Phs_B_Cls = new Gpio(87, 'out', {
		label: 'Phs_B_Cls'
	}); // Phs_B_Cls
	const Phs_B_Opn = new Gpio(110, 'out', {
		label: 'Phs_B_Opn'
	}); // Phs_B_Opn

	if (process.env.NODE_ENV === 'development') {
		// verify actual vs set values.
		assesValues(Close_PhB, Trip_PhB, opts, 'Close_PhB', 'Trip_PhB');
	}
	return { Phs_B_Cls, Phs_B_Opn, PhB_52a, PhB_52b, Close_PhB, Trip_PhB };
}

// Setup Phase C IOs.
function Setup_Phase_C(opts) {
	if (process.env.NODE_ENV === 'development') {
		console.log('<=== Setup Phase C setup is RUNNING ===>');
	}
	const Close_PhC = new Gpio(65, 'in', opts.edge, {
		debounceTimeout: opts.debounceTime,
		label: 'Close_PhC'
	}); // Phase C Close.
	const Trip_PhC = new Gpio(22, 'in', opts.edge, {
		debounceTimeout: opts.debounceTime,
		label: 'Trip_PhC'
	}); // Phase C Trip
	const PhC_52a = new Gpio(31, 'out', {
		label: 'PhC_52a'
	}); // Ph C 52a
	const PhC_52b = new Gpio(111, 'out', {
		label: 'PhC_52b'
	}); // Ph C 52b
	const Phs_C_Cls = new Gpio(89, 'out', {
		label: 'Phs_C_Cls'
	}); // Phs_C_Cls
	const Phs_C_Opn = new Gpio(20, 'out', {
		label: 'Phs_C_Opn'
	}); // Phs_C_Opn

	if (process.env.NODE_ENV === 'development') {
		// verify actual vs set values.
		assesValues(Close_PhC, Trip_PhC, opts, 'Close_PhC', 'Trip_PhC');
	}
	return { Phs_C_Cls, Phs_C_Opn, PhC_52a, PhC_52b, Close_PhC, Trip_PhC };
}

// Fault interrupt setup for Ig or Ineu.
function Setup_Neu_Gnd() {
	if (process.env.NODE_ENV === 'development') {
		console.log('<=== Setup Neu_Gnd setup is RUNNING ===>');
	}
	const Neu_Gnd_Cls = new Gpio(50, 'out', {
		label: 'Neu_Gnd_Cls'
	}); // Neu_Gnd_Cls
	const Neu_Gnd_Opn = new Gpio(117, 'out', {
		label: 'Neu_Gnd_Opn'
	}); // Neu_Gnd_Opn
	return { Neu_Gnd_Cls, Neu_Gnd_Opn };
}

// verify settings matches desired values
function assesValues(close, trip, params, closeLabel, tripLabel) {
	// check settings.
	assert(close._debounceTimeout === params.debounceTime);
	assert(close.edge() === params.edge);
	assert(trip._debounceTimeout === params.debounceTime);
	assert(trip.edge() === params.edge);
	console.log('m76xxIOs:\n\tAssert inputs...');
	console.log('\t%s:\tDebounceTimeout: %dms\tEdge: %s', closeLabel, close._debounceTimeout, close.edge());
	console.log('\t%s:\tDebounceTimeout: %dms\tEdge: %s', tripLabel, trip._debounceTimeout, trip.edge());
}

// m76xxIOs.prototype.init = function(opts) {
// 	console.log('m-76xx.prototype.init');
// };

(function() {
	this.prop = "";
}).call(m76xxIOs.prototype);

exports.m76xxIOs = m76xxIOs;
exports.m76xxIOs.aOperationDelay = function() {
	return this.aOperationDelay;
};
// exports.m76xxIOs.Setup_Phase_A = m76xxIOs.Setup_Phase_A;
// exports.m76xxIOs.Close_PhA_52a_52b = m76xxIOs.Close_PhA_52a_52b;
