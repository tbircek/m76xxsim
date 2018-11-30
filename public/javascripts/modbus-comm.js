var uutIpAddress = '192.168.0.122'; // process.env.IP; // 
var modbusPort = '502'; //  process.env.PORT; // 
var inputRegister = 691;
var outputRegister = 1050;

let modbus = require('jsmodbus');
let net = require('net');
let socket = new net.Socket();
let options = {
    'host': uutIpAddress,
    'port': modbusPort,
    'autoReconnect': false,
    'reconnectTimeout': 5000,
    'timeout': 5000,
    'unitId': 1,
    'logEnabled': true,
    'logLevel': 'info'
};
let client = new modbus.client.TCP(socket);

function modbusConnect() {
    // client.connect();
    socket.on('connect', function() {

        // Reg 692 == Input.Func.1, Reg 693 == Input.Func.2, Reg 694 == Input.Func.3, Reg 695 == Input.Func.4, Reg 696 == Input.Func.5
        client.readHoldingRegisters(inputRegister, 2)
            .then(function(resp) {

                // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ], payload: <Buffer> }
                console.log('Input registers:');
                // console.log('\t(Input.Func.1)\tReg 692:\t' + resp.register[0] + '\t(Input.Func.2)\tReg 693:\t' + resp.register[1]);
                console.log(resp.response._body.valuesAsArray);
                // socket.end();
            }).catch(function() {
                console.error(require('util').inspect(arguments, {
                    depth: null
                }));
                socket.end();
            });

        // Reg 1051 == OUTPUT.Func.1, Reg 1052 == OUTPUT.Func.2
        client.readHoldingRegisters(outputRegister, 2).then(function(resp) {

            // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ], payload: <Buffer> }
            console.log('Output registers:');
            // console.log('\t(OUTPUT.Func.1)\tReg 1051:\t' + resp.register[0] + '\t(OUTPUT.Func.2)\tReg 1052:\t' + resp.register[1]);
            console.log(resp.response._body.valuesAsArray);
            socket.end();
        }).catch(function() {
            console.error(require('util').inspect(arguments, {
                depth: null
            }));
            socket.end();
        });
    });

    // socket.on('error', console.error);
    socket.connect(options);
}

module.exports = {
    connect: modbusConnect()
};
