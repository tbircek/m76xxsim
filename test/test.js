#! /usr/bin/env node

/* test.js
 * Author: Turgay Bircek
 * Version: 1.0.0
 * Date: 03/25/2019
 * 
 * Provides test.
 *
 */

var assert = require('assert');
const Gpio = require('onoff').Gpio; // Gpio class
const lcd = require('../public/javascripts/lcd'); // Lcd class

describe('OnOff', function() {
    describe('#accessible', function() {
        it('should return true when installed correctly.', function() {
          assert.equal(Gpio.accessible, true);
        });
    });
    
    describe('#testIndividualPorts', function() {
        // pending test
        it('should turn high/low test gpio.');
    });
    
});

describe('lcd', function() {
    describe('#accessible', function() {
        it('should print test message when installed correctly.', function() {
          lcd.clear;
          lcd.call(this,'testing line 1\nline 2', 0, 0);
        });
    });
});
