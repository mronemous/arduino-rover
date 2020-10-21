require('traceur/bin/traceur-runtime');

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

import {Rover} from './models/rover';
var rover = new Rover();

server.listen(3009);

//app.use(express.static('www'));

io.configure('development', () => {
    io.enable('browser client etag');
    io.set('log level', 1);
    io.set('origins', '*:*');	
    io.set('transports', [
          'websocket'
        , 'flashsocket'
        , 'htmlfile'
        , 'xhr-polling'
        , 'jsonp-polling'
    ]);
});

var connectedCount = 0;

//Not sure of this is needed but I want to make sure the rover stops if something bad happens.
//TODO: Is there a better way to do this.
try {

io.sockets.on('connection', (socket) => {
   	
    connectedCount++;

    var clientId = socket.id;

    socket.emit('connected', {
        message: 'You are connected.',
        id: clientId
    });

    //Power is a value -1.00 - 1.00

    //Movement
    socket.on('throttle', (power) => {
        rover.throttle(power);
    });

    socket.on('steer', (power) => {
        rover.steer(power);
    });

    socket.on('stop', () => {
        rover.stop();
    });

    //Camera
    socket.on('camera.tilt', (power) => {
        rover.cameraTilt(power);
    });

    socket.on('camera.rotate', (power) => {
        rover.cameraRotate(power);
    });

    //Sensor
    rover.sonarF_changed = (reading) => {
        socket.emit('sonarF.changed', reading);
    }

    rover.sonarB_changed = (reading) => {
        socket.emit('sonarB.changed', reading);
    }

    rover.compass_changed = (reading) => {
        socket.emit('compass.changed', reading);
    }

    socket.on("disconnect", function(){
        connectedCount--;
        if(connectedCount <= 0) {
            rover.stop(); 
        }
    });
});

}
catch(e) {
	rover.stop();
	throw e;
}
