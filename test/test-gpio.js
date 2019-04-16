#! /usr/bin/env node

/* test.js
 * Author: Turgay Bircek
 * Version: 1.0.0
 * Date: 04/09/2019
 * 
 * Provides gpio test.
 *
 */

const assert = require('assert');
const Gpio = require('onoff').Gpio; // Gpio class

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
