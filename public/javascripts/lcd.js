#! /usr/bin/env node

/* lcd.js
 * Author: Turgay Bircek
 * Version: 1.0.4
 * Date: 04/30/2019
 * 
 * Provides interaction to LCD.
 *
 */

// the logger.
var winston = require('../../winston');

// provides miscellaneous function to the program.
var misc = require('./misc');

// provides access to LCD.
var LCD = require('lcd');

// specify connection and lcd configuration.
const lcd = new LCD({
  rs: 66, // rs: 67, // register select ... P8_8
  e: 67, // e: 68, // enable signal ... P8_10
  data: [
    69, //   65, // db4 ... P8_18
    68, //   46, // db5 ... P8_16
    45, //   26, // db6 ... P8_14
    44 //   44 // db7 ... P8_12
  ],
  cols: 20, // 20 characters.
  rows: 2 // 2 rows.
});

// lcd position constants.
const firstRow = 0;
const secondRow = 1;
const columnStartPosition = 0;

// prints specified message on the lcd.
var lcdPrint = function(message) {

  // split message to two rows by new line.
  var lines = message.split(/\n/);

  // clear lcd.
  lcd.clear();

  lcd.once('clear', () => {
    lcd.home();
    lcd.once('home', () => {

      // print first row on the lcd.
      lcd.print(lines[firstRow]);

      lcd.once('printed', () => {
        // set cursor location to second row on the lcd.
        lcd.setCursor(columnStartPosition, secondRow);

        // print second row on the lcd.
        lcd.print(lines[secondRow]);
      });
    });
  });
};

// waits until lcd initialized and provides initial message.
lcd.on('ready', function() {

  // clear lcd.
  lcd.clear();
  lcd.once('clear', () => {
    lcd.home();
    lcd.once('home', () => {
      lcdPrint(misc.defaultMessage());
    });
  });
  winston.log('info', 'lcd initialized...');
});

// export lcd function.
module.exports = {
  lcdPrint,
  lcd
};
