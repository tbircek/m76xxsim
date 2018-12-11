#! /usr/bin/env node

/* m76xx-io-operate.js
 * Author: Turgay Bircek
 * Version: 1.0.1
 * Date: 11/19/2018
 * 
 * Provides output operations for M76xx Simulator program
 *
 */

// Logic One;
const Logic1 = 1;

// Logic zero;
const Logic0 = 0;

// GPIO control library.
const Gpio = require('onoff').Gpio;

function operate(Gpio){
    // this.Gpio = Gpio.values;
    
    console.log('gpio operating: ' + Gpio);
}

module.exports = {
    operate: operate
};