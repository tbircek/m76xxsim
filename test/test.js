#! /usr/bin/env node

/* test.js
 * Author: Turgay Bircek
 * Version: 1.0.1
 * Date: 04/05/2019
 * 
 * Provides test.
 *
 */

var assert = require('assert');
const Gpio = require('onoff').Gpio; // Gpio class
const lcd = require('../public/javascripts/lcd'); // Lcd class
// the logger.
var winston = require('../winston');

before(done => {
    winston.log('info', 'test started ...');
    done();
});

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

            lcd.lcdPrint.call(this, 'testing line 1\ntesting line 2');
        });
    });
});

describe('lcd', function() {
    describe('#terminate', function() {
        it('should exit lcd.js gracefully.', function(done) {

            setTimeout((function() {
                process.once('SIGINT', () => {
                    lcd.lcdPrint.call(this, 'sim test\ncompleted.');
                });
                process.kill(process.pid, 'SIGINT');
                done();
            }), 1500);
        });
    });
});

after(function() {

    winston.log('info', 'test completed ...');
});
