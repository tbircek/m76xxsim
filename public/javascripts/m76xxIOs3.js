#! /usr/bin/env node

/*
 * m76xxIOs3.js
 *
 * Copyright (c) 2018 Turgay Bircek
 * Version: 1.0.0
 * Date: 4/27/2018
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

function IOs(name, gpio, direction) {
    this.name = name;
    this.gpio = gpio;
    this.direction = direction;
}

function SetupInputs(name, gpio, direction) {
    IOs.call(this, name, gpio, direction);

    this.edge = edge;
    this.debounceTimeout = debounce;
    this.name = name;

    // Setup input.
    new Gpio(this.gpio, this.direction, this.edge, {
        debounceTimeout: this.debounceTimeout,
        label: this.name
    });
}

SetupInputs.prototype = Object.create(IOs.prototype);
SetupInputs.prototype.constructor = SetupInputs;

SetupInputs.prototype.setupInput = function() {

};

SetupInputs.prototype.watch = function(phaseName, watchFunction) {

}

module.exports = {
    IOs: IOs,
    Inputs: SetupInputs
};
