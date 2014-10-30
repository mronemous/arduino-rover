require('traceur/bin/traceur-runtime');

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

import {Rover} from './models/rover';
var rover = new Rover();

import {RocketLauncher} from './models/rocketLauncher';
var rocketLauncher = new RocketLauncher();

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

io.sockets.on('connection', (socket) => {
    var clientId = socket.id;

    socket.emit('connected', {
        message: 'You are connected.',
        id: clientId
    });

	  //Movement
    socket.on('forward', (power) => {
				rover.forward(power);
    });

    socket.on('backward', (power) => {
        rover.backward(power);
    });
	
	  socket.on('left', (power) => {
        rover.left(power);
    });
	
	 socket.on('right', (power) => {
        rover.right(power);
    });

    socket.on('stop', (power) => {
        rover.stop();
    });
	
		//Rocket Launcher
		socket.on('rocketLauncher.up', () => {
				rocketLauncher.up();
		});

		socket.on('rocketLauncher.down', () => {
				rocketLauncher.down();
		});

		socket.on('rocketLauncher.left', () => {
				rocketLauncher.left();
		});

	  socket.on('rocketLauncher.right', () => {
				rocketLauncher.right();
		});

	  socket.on('rocketLauncher.stop', () => {
				rocketLauncher.stop();
		});

	  socket.on('rocketLauncher.shoot', () => {
				rocketLauncher.shoot();
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
});
