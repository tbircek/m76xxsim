#! /usr/bin/env node

/*
 * m76xxIOs2.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.0
 * Date: 4/25/2018
 *
 * Provides IO functionality of a Recloser.
 *
 * Please see pinout.json file for more information about GPIO numbers.
 *
 */

'use strict';

// TODO: Add file reading system instead of hard coding pins.

const debug = true;

// if (debug) {
// const assert = require('./assess');
// }

// Timer library.
const delay = require('delay');

// Logic One;
const Logic1 = 1;

// Logic zero;
const Logic0 = 0;

// debounce timeout.
const debounce = 10;

// detection edge.
const edge = 'rising';

// GPIO control library.
const Gpio = require('onoff').Gpio;

var m76xxIOs = function() {
  // this.phABC52a = phABC52a;
};

// instatiate IOs class.
m76xxIOs.prototype.init = function(phABC52a = true, phABC52b = true, tripABC = true, closeABC = true, cbStartPosition = 'Close',
    tripDelay52a = 0, tripDelay52b = 0, closeDelay52a = 0, closeDelay52b = 0) {

    this.phABC52a = phABC52a;
    this.phABC52b = phABC52b;
    this.tripABC = tripABC;
    this.closeABC = closeABC;
    this.cbStartPosition = cbStartPosition;
    this.tripDelay52a = tripDelay52a;
    this.tripDelay52b = tripDelay52b;
    this.closeDelay52a = closeDelay52a;
    this.closeDelay52b = closeDelay52b;

    if (debug) {
      // reset counters.
      // this.phATripCounter = 0;
      // this.phACloseCounter = 0;
      this.phBTripCounter = 0;
      this.phBCloseCounter = 0;
      this.phCTripCounter = 0;
      this.phCCloseCounter = 0;
      this.totalCloseCounter = 0;
      this.totalTripCounter = 0;
      this.totalCloseTime = 0;
      this.totalTripTime = 0;
      console.log('Breaker Model:\t%s', this.breakerModel());
      console.log('Simulator initialized with following default values:');
      console.log('\tphABC52a:\t%s\tphABC52b:\t%s\ttripABC:\t%s', this.phABC52a, this.phABC52b, this.tripABC);
      console.log('\tcloseABC:\t%s\tcbStartPosition:\t%s\ttripDelay52a:\t%dms', this.closeABC, this.cbStartPosition, this.tripDelay52a);
      console.log('\ttripDelay52b:\t%dms\tcloseDelay52a:\t%dms\tcloseDelay52b:\t%dms', this.tripDelay52b, this.closeDelay52a, this.closeDelay52b);
    }
  },

  m76xxIOs.prototype.breakerModel = function() {
    var result = '';
    if (this.phABC52a && this.phABC52b && this.tripABC && this.closeABC) {
      result = '52a, 52b';
    }
    return result;
  },

  m76xxIOs.prototype.setupNeuGnd = function() {
    if (debug) {
      console.log('Setup_Neu_Gnd');
    }
    this.Neu_Gnd_Cls = new Gpio(50, 'out', {
      label: 'Neu_Gnd_Cls'
    }); // Neu_Gnd_Cls
    this.Neu_Gnd_Opn = new Gpio(117, 'out', {
      label: 'Neu_Gnd_Opn'
    }); // Neu_Gnd_Opn
  },

  m76xxIOs.prototype.setupPhaseABC = function() {
    if (debug) {
      console.log('Setup_PhaseABC');
      // m76xxIOs.prototype.phATripCounter = 0;
      // m76xxIOs.prototype.phACloseCounter = 0;
    }
    this.Close_PhA = new Gpio(26, 'in', edge, {
      debounceTimeout: debounce,
      label: 'Close_PhA'
    });
    this.Trip_PhA = new Gpio(47, 'in', edge, {
      debounceTimeout: debounce,
      label: 'Trip_PhA'
    });
    this.PhA_52a = new Gpio(30, 'out', {
      label: 'PhA_52a'
    }); // Ph A 52a
    this.PhA_52b = new Gpio(115, 'out', {
      label: 'PhA_52b'
    }); // Ph A 52b
    this.Phs_A_Cls = new Gpio(88, 'out', {
      label: 'Phs_A_Cls'
    }); // Phs_A_Cls
    this.Phs_A_Opn = new Gpio(112, 'out', {
      label: 'Phs_A_Opn'
    }); // Phs_A_Opn

    // Ph A operations.
    Close_PhA.watch(function(err) { //, value) {
      if (err) {
        throw err;
      }

      if (debug) {
        m76xxIOs.prototype.phATripCounter = 0;
        var phACloseStart = process.hrtime();
      }

      // TODO: pha52a operation here.
      switch (m76xxIOs.prototype.breakerModel()) {
        case '52a only':
          m76xxIOs.prototype.Close_PhA_52a_Only();
          break;
        case '52b only':
          m76xxIOs.prototype.Close_PhA_52b_Only();
          break;
        case '52a, 52b':
        case '52a, 52b/69':
          m76xxIOs.prototype.Close_PhA_52a_52b();
          break;
        default:
          console.log('Sorry, we are out of ' + m76xxIOs.prototype.breakerModel() + '.');
          break;
      }

      if (debug) {
        m76xxIOs.prototype.phACloseCounter++;
        m76xxIOs.prototype.totalCloseCounter++;
        var phACloseStop = process.hrtime(phACloseStart);
        console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'A', 'Close', (phACloseStop[1] / 1e6).toPrecision(3), this.phACloseCounter);
        this.totalCloseTime += (((phACloseStop[0] * 1e9) + phACloseStop[1]) / 1e6);
        console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d',
          this.totalCloseTime.toPrecision(3), (this.totalCloseTime / this.totalCloseCounter).toPrecision(3),
          'Close', this.totalCloseCounter);
      }
    });

    Trip_PhA.watch(function(err) { //, value) {
      if (err) {
        throw err;
      }

      if (debug) {
        m76xxIOs.prototype.phACloseCounter = 0;
        var phATripStart = process.hrtime();
      }

      switch (m76xxIOs.prototype.breakerModel()) {
        case '52a only':
          m76xxIOs.prototype.Trip_PhA_52a_Only();
          break;
        case '52b only':
          m76xxIOs.prototype.Trip_PhA_52b_Only();
          break;
        case '52a, 52b':
        case '52a, 52b/69':
          m76xxIOs.prototype.Trip_PhA_52a_52b();
          break;
        default:
          throw 'Trip_PhA breakerModel error.';
          break;
      }
      if (debug) {
        this.phATripCounter++;
        this.totalTripCounter++;
        var phATripStop = process.hrtime(phATripStart);
        console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'A', 'Trip', (phATripStop[1] / 1e6).toPrecision(3), this.phATripCounter);
        this.totalTripTime += (((phATripStop[0] * 1e9) + phATripStop[1]) / 1e6);
        console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d',
          this.totalTripTime.toPrecision(3), (this.totalTripTime / this.totalTripCounter).toPrecision(3),
          'Trip', this.totalTripCounter);
      }
    });
  },

  m76xxIOs.prototype.setupPhaseB = function() {
    if (debug) {
      console.log('Setup_PhaseB');
    }
    this.Close_PhB = new Gpio(46, 'in', edge, {
      debounceTimeout: debounce,
      label: 'Close_PhB'
    });
    this.Trip_PhB = new Gpio(27, 'in', edge, {
      debounceTimeout: debounce,
      label: 'Trip_PhB'
    });
    this.PhB_52a = new Gpio(60, 'out', {
      label: 'PhB_52a'
    }); // Ph B 52a
    this.PhB_52b = new Gpio(113, 'out', {
      label: 'PhB_52b'
    }); // Ph B 52b
    this.Phs_B_Cls = new Gpio(87, 'out', {
      label: 'Phs_B_Cls'
    }); // Phs_B_Cls
    this.Phs_B_Opn = new Gpio(110, 'out', {
      label: 'Phs_B_Opn'
    }); // Phs_B_Opn

    // return { Phs_B_Cls, Phs_B_Opn, PhB_52a, PhB_52b, Close_PhB, Trip_PhB };

    // Ph B operations.
    this.Close_PhB.watch(function(err) { //, value) {
        if (err) {
          throw err;
        }

        if (debug) {
          this.phBTripCounter = 0;
          var phBCloseStart = process.hrtime();
        }

        // TODO: pha52a operation here.
        switch (this.breakerModel()) {
          case '52a only':
            this.Close_PhB_52a_Only();
            break;
          case '52b only':
            this.Close_PhB_52b_Only();
            break;
          case '52a, 52b':
          case '52a, 52b/69':
            this.Close_PhB_52a_52b();
            break;
          default:
            console.log('Sorry, we are out of ' + this.breakerModel() + '.');
            break;
        }
        if (debug) {
          this.phBCloseCounter++;
          this.totalCloseCounter++;
          var phBCloseStop = process.hrtime(phBCloseStart);
          console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'B', 'Close', (phBCloseStop[1] / 1e6).toPrecision(3), this.phBCloseCounter);
          this.totalCloseTime += (((phBCloseStop[0] * 1e9) + phBCloseStop[1]) / 1e6);
          console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', this.totalCloseTime.toPrecision(3), (this.totalCloseTime / this.totalCloseCounter).toPrecision(3), 'Close', this.totalCloseCounter);
        }
      }),

      this.Trip_PhB.watch(function(err) { //, value) {
        if (err) {
          throw err;
        }
        if (debug) {
          this.phBCloseCounter = 0;
          var phBTripStart = process.hrtime();
        }

        // TODO: pha52a operation here.
        switch (this.breakerModel()) {
          case '52a only':
            this.Trip_PhB_52a();
            break;
          case '52b only':
            this.Trip_PhB_52b();
            break;
          case '52a, 52b':
          case '52a, 52b/69':
            this.Trip_PhB_52a_52b();
            break;
          default:
            console.log('Sorry, we are out of ' + this.breakerModel() + '.');
            break;
        }
        if (debug) {
          this.phBTripCounter++;
          this.totalTripCounter++;
          var phBTripStop = process.hrtime(phBTripStart);
          console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'B', 'Trip', (phBTripStop[1] / 1e6).toPrecision(3), this.phBTripCounter);
          this.totalTripTime += (((phBTripStop[0] * 1e9) + phBTripStop[1]) / 1e6);
          console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', this.totalTripTime.toPrecision(3), (this.totalTripTime / this.totalTripCounter).toPrecision(3), 'Trip', this.totalTripCounter);
        }
      });
  },

  m76xxIOs.prototype.setupPhaseC = function() {
    if (debug) {
      console.log('Setup_PhaseC');
    }
    this.Close_PhC = new Gpio(65, 'in', edge, {
      debounceTimeout: debounce,
      label: 'Close_PhC'
    }); // Phase C Close.
    this.Trip_PhC = new Gpio(22, 'in', edge, {
      debounceTimeout: debounce,
      label: 'Trip_PhC'
    }); // Phase C Trip
    this.PhC_52a = new Gpio(31, 'out', {
      label: 'PhC_52a'
    }); // Ph C 52a
    this.PhC_52b = new Gpio(111, 'out', {
      label: 'PhC_52b'
    }); // Ph C 52b
    this.Phs_C_Cls = new Gpio(89, 'out', {
      label: 'Phs_C_Cls'
    }); // Phs_C_Cls
    this.Phs_C_Opn = new Gpio(20, 'out', {
      label: 'Phs_C_Opn'
    }); // Phs_C_Opn

    // Ph C operations.
    this.Close_PhC.watch(function(err) { //, value) {
      if (err) {
        throw err;
      }

      if (debug) {
        this.phCTripCounter = 0;
        var phCCloseStart = process.hrtime();
      }

      // TODO: pha52a operation here.
      switch (this.breakerModel()) {
        case '52a only':
          this.Close_PhC_52a_Only();
          break;
        case '52b only':
          this.Close_PhC_52b_Only();
          break;
        case '52a, 52b':
        case '52a, 52b/69':
          this.Close_PhC_52a_52b();
          break;
        default:
          console.log('Sorry, we are out of ' + this.breakerModel() + '.');
          break;
      }
      if (debug) {
        this.phCCloseCounter++;
        this.totalCloseCounter++;
        var phCCloseStop = process.hrtime(phCCloseStart);
        console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'C', 'Close', (phCCloseStop[1] / 1e6).toPrecision(3), this.phCCloseCounter);
        this.totalCloseTime += (((phCCloseStop[0] * 1e9) + phCCloseStop[1]) / 1e6);
        console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', this.totalCloseTime.toPrecision(3), (this.totalCloseTime / this.totalCloseCounter).toPrecision(3), 'Close', this.totalCloseCounter);
      }
    });

    this.Trip_PhC.watch(function(err) { //, value) {
      if (err) {
        throw err;
      }

      if (debug) {
        this.phCCloseCounter = 0;
        var phCTripStart = process.hrtime();
      }

      switch (this.breakerModel()) {
        case '52a only':
          this.Trip_PhC_52a();
          break;
        case '52b only':
          this.Trip_PhC_52b();
          break;
        case '52a, 52b':
        case '52a, 52b/69':
          this.Trip_PhC_52a_52b();
          break;
        default:
          console.log('Sorry, we are out of ' + this.breakerModel() + '.');
          break;
      }
      if (debug) {
        this.phCTripCounter++;
        this.totalTripCounter++;
        var phCTripStop = process.hrtime(phCTripStart);
        console.log('Ph %s %s:\n\tOp Time: %dms\tCounter: %d', 'C', 'Trip', (phCTripStop[1] / 1e6).toPrecision(3), this.phCTripCounter);
        this.totalTripTime += (((phCTripStop[0] * 1e9) + phCTripStop[1]) / 1e6);
        console.log('\tTotal: %dms\tAve: %dms\tTotal %s operation: %d', this.totalTripTime.toPrecision(3), (this.totalTripTime / this.totalTripCounter).toPrecision(3), 'Trip', this.totalTripCounter);
      }
    });
  },

  m76xxIOs.prototype.setCBPositions = function(cbPosition = this.cbStartPosition) {

    /************************************************************
     * 
     * Set default options.
     * cbPosition = Close -> 52a is close
     * cbPosition = Trip  -> 52a is open
     * 
     **************************************************************/

    if (cbPosition === 'Close') {
      switch (this.breakerModel()) {
        case '52a only':
          this.Close_PhA_52a_Only();
          this.Close_PhB_52a_Only();
          this.Close_PhC_52a_Only();
          break;
        case '52b only':
          this.Close_PhA_52b_Only();
          this.Close_PhB_52b_Only();
          this.Close_PhC_52b_Only();
          break;
        case '52a, 52b':
        case '52a, 52b/69':
          this.Close_PhA_52a_52b();
          this.Close_PhB_52a_52b();
          this.Close_PhC_52a_52b();
          break;
        default:
          throw 'invalid breakerModel';
          break;
      }
    } else if (cbPosition === 'Trip') {
      switch (this.breakerModel()) {
        case '52a only':
          this.Trip_PhA_52a_Only();
          this.Trip_PhB_52a_Only();
          this.Trip_PhC_52a_Only();
          break;
        case '52b only':
          this.Trip_PhA_52b_Only();
          this.Trip_PhB_52b_Only();
          this.Trip_PhC_52b_Only();
          break;
        case '52a, 52b':
        case '52a, 52b/69':
          this.Trip_PhA_52a_52b();
          this.Trip_PhB_52a_52b();
          this.Trip_PhC_52a_52b();
          break;
        default:
          throw 'invalid breakerModel';
          break;
      }
    } else {
      throw 'invalid cbStartPosition';
    }
  },


  // Handles Trip operation of Phase B.
  // 52a only
  m76xxIOs.prototype.Trip_PhA_52a_Only = function() {
    setupPhaseABC.Phs_A_Cls.writeSync(Logic0);
    this.Phs_A_Opn.writeSync(Logic1);
    // Wait out for 52a delay time.        
    delay(this.tripTime52aDelay);
    this.PhA_52a.writeSync(Logic0);
  },

  // Handles Trip operation of Phase B.
  // 52a only
  m76xxIOs.prototype.Trip_PhB_52a = function() {
    this.Phs_B_Cls.writeSync(Logic0);
    this.Phs_B_Opn.writeSync(Logic1);
    // Wait out for 52a delay time.
    delay(this.tripTime52aDelay);
    this.PhB_52a.writeSync(Logic0);
  },

  // Handles Trip operation of Phase B.
  // 52a only
  m76xxIOs.prototype.Trip_PhC_52a = function() {
    this.Phs_C_Cls.writeSync(Logic0);
    this.Phs_C_Opn.writeSync(Logic1);
    // Wait out for 52a delay time.
    delay(this.tripTime52aDelay);
    this.PhC_52a.writeSync(Logic0);
  },

  // Handles Trip operation of Phase A.
  // 52b only
  m76xxIOs.prototype.Trip_PhA_52b_Only = function() {
    this.Phs_A_Cls.writeSync(Logic0);
    this.Phs_A_Opn.writeSync(Logic1);
    // Wait out for 52b delay time.        
    delay(this.tripTime52bDelay);
    this.PhA_52b.writeSync(Logic1);
  },

  // Handles Trip operation of Phase B.
  // 52b only
  m76xxIOs.prototype.Trip_PhB_52b = function() {
    this.Phs_B_Cls.writeSync(Logic0);
    this.Phs_B_Opn.writeSync(Logic1);
    // Wait out for 52b delay time. 
    delay(this.tripTime52bDelay);
    this.PhB_52b.writeSync(Logic1);
  },

  // Handles Trip operation of Phase C.
  // 52b only
  m76xxIOs.prototype.Trip_PhC_52b = function() {
    this.Phs_C_Cls.writeSync(Logic0);
    this.Phs_C_Opn.writeSync(Logic1);
    // Wait out for 52b delay time.
    delay(this.tripTime52bDelay);
    this.PhC_52b.writeSync(Logic1);
  },

  // Handles Trip operation of Phase A.
  // 52a, 52b
  // 52a, 52b/69
  m76xxIOs.prototype.Trip_PhA_52a_52b = function() {
    // interrupt fault currents.
    this.Phs_A_Cls.writeSync(Logic0);
    this.Phs_A_Opn.writeSync(Logic1);
    this.Neu_Gnd_Cls.writeSync(Logic0);
    this.Neu_Gnd_Opn.writeSync(Logic1);

    // Wait out for 52a delay time.        
    delay(this.tripTime52aDelay);
    this.PhA_52a.writeSync(Logic0);

    // Wait out for 52b delay time.        
    delay(this.tripTime52bDelay);
    this.PhA_52b.writeSync(Logic1);
  },

  // Handles Trip operation of Phase B.
  // 52a, 52b
  // 52a, 52b/69
  m76xxIOs.prototype.Trip_PhB_52a_52b = function() {
    // interrupt fault currents.
    this.Phs_B_Cls.writeSync(Logic0);
    this.Phs_B_Opn.writeSync(Logic1);
    this.Neu_Gnd_Cls.writeSync(Logic0);
    this.Neu_Gnd_Opn.writeSync(Logic1);

    // Wait out for 52a delay time. 
    delay(this.tripTime52aDelay);
    this.PhB_52a.writeSync(Logic0);

    // Wait out for 52b delay time.
    delay(this.tripTime52bDelay);
    this.PhB_52b.writeSync(Logic1);
  },

  // Handles Trip operation of Phase C.
  // 52a, 52b
  // 52a, 52b/69
  m76xxIOs.prototype.Trip_PhC_52a_52b = function() {
    // interrupt fault currents.
    this.Phs_C_Cls.writeSync(Logic0);
    this.Phs_C_Opn.writeSync(Logic1);
    this.Neu_Gnd_Cls.writeSync(Logic0);
    this.Neu_Gnd_Opn.writeSync(Logic1);

    // Wait out for 52a delay time.
    delay(this.tripTime52aDelay);
    this.PhC_52a.writeSync(Logic0);
    // Wait out for 52b delay time.
    delay(this.tripTime52bDelay);
    this.PhC_52b.writeSync(Logic1);
  },

  // Handles Close operation of Phase A.
  // 52a only
  m76xxIOs.prototype.Close_PhA_52a_Only = function() {
    this.Phs_A_Cls.writeSync(Logic1);
    this.Phs_A_Opn.writeSync(Logic0);
    // Wait out for 52a delay time.
    delay(this.closeTime52aDelay);
    this.PhA_52a.writeSync(Logic1);
  },

  // Handles Close operation of Phase B.
  // 52a only
  m76xxIOs.prototype.Close_PhB_52a_Only = function() {
    this.Phs_B_Cls.writeSync(Logic0);
    this.Phs_B_Opn.writeSync(Logic1);
    // Wait out for 52a delay time.
    delay(this.closeTime52aDelay);
    this.PhB_52a.writeSync(Logic1);
  },

  // Handles Close operation of Phase C.
  // 52a only
  m76xxIOs.prototype.Close_PhC_52a_Only = function() {
    this.Phs_C_Cls.writeSync(Logic1);
    this.Phs_C_Opn.writeSync(Logic0);
    // Wait out for 52a delay time.        
    delay(this.closeTime52aDelay);
    this.PhC_52a.writeSync(Logic1);
  },

  // Handles Close operation of Phase A.
  // 52b only
  m76xxIOs.prototype.Close_PhA_52b_Only = function() {
    this.Phs_A_Cls.writeSync(Logic1);
    this.Phs_A_Opn.writeSync(Logic0);
    // Wait out for 52b delay time.
    delay(this.closeTime52bDelay);
    this.PhA_52b.writeSync(Logic0);
  },

  // Handles Close operation of Phase B.
  // 52b only
  m76xxIOs.prototype.Close_PhB_52b_Only = function() {
    this.Phs_B_Cls.writeSync(Logic1);
    this.Phs_B_Opn.writeSync(Logic0);
    // Wait out for 52b delay time.
    delay(this.closeTime52bDelay);
    this.PhB_52b.writeSync(Logic0);
  },

  m76xxIOs.prototype.Close_PhC_52b_Only = function() {
    this.Phs_C_Cls.writeSync(Logic1);
    this.Phs_C_Opn.writeSync(Logic0);
    // Wait out for 52b delay time.
    delay(this.closeTime52bDelay);
    this.PhC_52b.writeSync(Logic0);
  },

  // Handles Close operation of Phase B.
  // 52a, 52b
  // 52a, 52b/69
  m76xxIOs.prototype.Close_PhA_52a_52b = function() {
    // interrupt fault currents.
    this.Phs_A_Cls.writeSync(Logic1);
    this.Phs_A_Opn.writeSync(Logic0);
    this.Neu_Gnd_Cls.writeSync(Logic1);
    this.Neu_Gnd_Opn.writeSync(Logic0);

    // Wait out for 52b delay time.
    delay(this.closeTime52bDelay);
    this.PhA_52b.writeSync(Logic0);

    // Wait out for 52a delay time.
    delay(this.closeTime52aDelay);
    this.PhA_52a.writeSync(Logic1);
  },

  // Handles Close operation of Phase B.
  // 52a, 52b
  // 52a, 52b/69
  m76xxIOs.prototype.Close_PhB_52a_52b = function() {
    // interrupt fault currents.
    this.Phs_B_Cls.writeSync(Logic1);
    this.Phs_B_Opn.writeSync(Logic0);
    this.Neu_Gnd_Cls.writeSync(Logic1);
    this.Neu_Gnd_Opn.writeSync(Logic0);

    // Wait out for 52a delay time.    
    delay(this.closeTime52bDelay);
    this.PhB_52b.writeSync(Logic0);

    // Wait out for 52a delay time.    
    delay(this.closeTime52aDelay);
    this.PhB_52a.writeSync(Logic1);
  },

  // Handles Close operation of Phase C.
  // 52a, 52b
  // 52a, 52b/69
  m76xxIOs.prototype.Close_PhC_52a_52b = function() {
    // interrupt fault currents.
    this.Phs_C_Cls.writeSync(Logic1);
    this.Phs_C_Opn.writeSync(Logic0);
    this.Neu_Gnd_Cls.writeSync(Logic1);
    this.Neu_Gnd_Opn.writeSync(Logic0);

    // Wait out for 52b delay time.
    delay(this.closeTime52bDelay);
    this.PhC_52b.writeSync(Logic0);

    // Wait out for 52a delay time.
    delay(this.closeTime52aDelay);
    this.PhC_52a.writeSync(Logic1);
  };

module.exports = {
  m76xxIOs
};

process.on('uncaughtException', function(err) {
  console.log(err);
});
