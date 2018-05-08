#! /usr/bin/env node

/* m76xxsim.js
 * Author: Turgay Bircek
 * Version: 1.0.0
 * Date: 3/28/2018
 * 
 * Provides main entry for M76xx Simulator program
 *
 */

'use strict';
var useLibrary = 1;
var activeLibrary;

if (useLibrary === 1) {
  activeLibrary = library1();
} else if (useLibrary === 2) {
  var m76xxIOs = require('./m76xxIOs2').m76xxIOs.prototype;
  activeLibrary = library2();
} else {
  throw ('invalid library');
}



// interface to lcd.
var lcd = require('./lcd');

var uutIpAddress = '192.168.0.122'; // process.env.IP; // 
var modbusPort = '502'; //  process.env.PORT; // 
var inputRegister = 691;
var outputRegister = 1050;

var modbus = require('jsmodbus');
var client = modbus.client.tcp.complete({
  'host': uutIpAddress,
  'port': modbusPort,
  'autoReconnect': false,
  'reconnectTimeout': 5000,
  'timeout': 5000,
  'unitId': 1,
  'logEnabled': true,
  'logLevel': 'info'
});

/**********************************************************
 *
 * IOControl Options:
 * 
 * breakerModel: match with System Setup>Input>Functions.
 *               options:
 *                        52a only -> Inputs 1, 6 and 8 used only.
 *                        52b only -> Inputs 2, 7 and 9 used only.
 *                        52a, 52b -> Inputs 1, 2, 6, 7, 8, 9 used.
 *                        52a, 52b/69 -> For future use only.
 * 
 * cbPosition:  default start up position for the simulator.
 *              Depending on selected breakerModel, the simulator
 *              set 52a and/or 52b as Close or Trip.
 *              options: 
 *                      Close
 *                      Trip
 * 
 * recloserType: match with System Setup>System>Recloser Type.
 *               options:
 *                      3ph Ganged
 *                      Independent Phase Capable
 * 
 * operationMode: match F79 function>Operation Mode.
 *                3ph ganged options:
 *                                   
 */
// var IOControl = require('./m76xxIOs').m76xxIOs; //,


function init() {

  client.connect();
  client.on('connect', function() {

    // Reg 692 == Input.Func.1, Reg 693 == Input.Func.2, Reg 694 == Input.Func.3, Reg 695 == Input.Func.4, Reg 696 == Input.Func.5
    client.readHoldingRegisters(inputRegister, 2).then(function(resp) {

      // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ], payload: <Buffer> }
      console.log('Input registers:');
      console.log('\t(Input.Func.1)\tReg 692:\t' + resp.register[0] + '\t(Input.Func.2)\tReg 693:\t' + resp.register[1]);
    }, console.error);

    // Reg 1051 == OUTPUT.Func.1, Reg 1052 == OUTPUT.Func.2
    client.readHoldingRegisters(outputRegister, 2).then(function(resp) {

      // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ], payload: <Buffer> }
      console.log('Output registers:');
      console.log('\t(OUTPUT.Func.1)\tReg 1051:\t' + resp.register[0] + '\t(OUTPUT.Func.2)\tReg 1052:\t' + resp.register[1]);
    }, console.error);

  });

  client.on('error', function(err) {

    console.log(err);

  });
  client.close();

  activeLibrary;

  // initialization completed.
  console.log('m76xxsim init completed...');

  // load status of all ports from previously saved file 
  // if no file exists create a new one.
}

function library2() {
  // second library.
  m76xxIOs.init();
  m76xxIOs.setupNeuGnd();
  m76xxIOs.setupPhaseABC();
  m76xxIOs.setupPhaseB();
  m76xxIOs.setupPhaseC();
  m76xxIOs.setCBPositions();
}

function library1() { // first library.
  var IOControl = require('./m76xxIOs').m76xxIOs,
    ioControl = new IOControl({
      breakerModel: '52a, 52b', //'52a only', '52b only', '52a, 52b/69'
      cbPosition: 'Close', // 'Trip', // 
      closeDebounceTime: 13, // observed two different pulse width in scope.
      tripDebounceTime: 13, // observed two different pulse width in scope.
      edge: 'rising', // 'falling', // 'both', // 'none', //
      recloserType: '3ph Ganged', // 'Independent Phase Capable', // 
      operationMode: '3Trip 3Close', // '1Trip 3Close', '1Trip 1Close'
      // tripTimeDelay: 100,
      tripTime52aDelay: 0, //50,
      tripTime52bDelay: 0, //75,
      // closeTimeDelay: 200,
      closeTime52aDelay: 0, //100,
      closeTime52bDelay: 0 //25
    });
}

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', function() {
  console.log('exiting the program...');
  process.exit();
});

process.on('uncaughtException', function(err) {
  console.log(err);
});

// entry point.
init();
