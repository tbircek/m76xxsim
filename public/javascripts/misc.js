/* misc.js
 * Author: Turgay Bircek
 * Version: 1.0.1
 * Date: 01/17/2018
 * 
 * Provides miscellaneous function to the program.
 *
 */

// retrieve ip address of beaglebone black.
var devip = require('dev-ip');

// returns default message.
var defaultMessage = (function() {
    var ipAddress = devip()[0];
    return (`M76xx Simulator\n${ipAddress}`);
});

// export lcdPrint function.
module.exports = {
    defaultMessage: defaultMessage
};
