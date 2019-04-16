#! /usr/bin/env node

/* test.js
 * Author: Turgay Bircek
 * Version: 1.0.0
 * Date: 03/25/2019
 * 
 * Provides lcd test.
 *
 */

const lcd = require('../public/javascripts/lcd'); // Lcd class
// the logger.
var winston = require('../winston');

before(done => {
    winston.log('info', 'test started ...');
    done();
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
