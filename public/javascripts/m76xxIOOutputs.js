#! /usr/bin/env node

/* m76xxIOOutputs.js
 * Author: Turgay Bircek
 * Version: 1.0.0
 * Date: 12/11/2018
 * 
 * Provides output operations for M76xx Simulator program
 *
 */
// m76xxIOSetup library.
let setup = require('./m76xxIOSetup');

// Logic One;
const Logic1 = 1;

// Logic zero;
const Logic0 = 0;


// GPIO control library.
// const Gpio = require('onoff').Gpio;

// output attributes
var SetupOutputs = function(name, gpio, direction) {

  // Grap General io stuff.
  new setup.IOs(this, name, gpio, direction);

  // Setup output.
  this.output = new setup.Gpio(this.gpio, this.direction, {
    label: this.name
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('SetupOutputs:\tNew GPIO:\t' + this.output._gpio);
  }
};

// Output IO operation set to HIGH
SetupOutputs.prototype.Read = function() {
  if (process.env.NODE_ENV === 'development') {
    console.log('SetupOutputs:\tNew GPIO: ' + this.output._gpio);
    console.log('SetupOutputs:\tReading GPIO value: ' + this.output.readSync());
  }
  return this.output.readSync();
};

// Output IO operation set to HIGH
SetupOutputs.prototype.Close = function() {
  if (process.env.NODE_ENV === 'development') {
    console.log('SetupOutputs:\tNew GPIO:\t' + this.output._gpio + '\tcommand: CLOSE');
  }
  setTimeout(() => {
    this.output.writeSync(Logic1);
  }, setup.aOperationDelay);
};

// Output IO operation set to LOW
SetupOutputs.prototype.Trip = function() {
  if (process.env.NODE_ENV === 'development') {
    console.log('SetupOutputs:\tNew GPIO: ' + this.output._gpio + '\tcommand: TRIP');
  }
  setTimeout(() => {
    this.output.writeSync(Logic0);
  }, setup.bOperationDelay);
};

exports.Outputs = SetupOutputs;