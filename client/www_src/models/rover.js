class Sensor {
	
	constructor(options) {
			this.name = options.name;
			this.value = options.value;
	}
}

class Rover {
		
	constructor(changed) {
	
		this.changed = changed;
		this.sonarF = new Sensor({name: 'SonarF', value: '-'});
		this.sonarB = new Sensor({name: 'SonarB', value: '-'});
		this.compass = new Sensor({name: 'Compass', value: '-'});
		this.gps = new Sensor({name: 'GPS', value: '-'});
		
		this.lastPower = {};
		this.minPowerChange = 0.01;
	}
	
	get connection() {  
		if(!this._connection) {
			if(typeof(io) != "undefined") {
				this._connection = new SocketIoConnection();
			}
			else {
				this._connection = new Connection();
			}
		}
		return this._connection;
	}

	steer(power) {		
		this.send('steer', power);
	}

	throttle(power) {
		this.send('throttle', power);
	}

	cameraTilt(power) {
		this.send('camera.tilt', power);
	}

	cameraRotate(power) {
		this.send('camera.rotate', power);
	}

	stop() {		
		this.send('stop', 0.5);
	}

	send(command, power) {
		
		var lastPower = this.lastPower[command];
		var delta = Math.abs(power - lastPower);
		
		var log = {
			command: command,
			power: power, 
			lastPower: lastPower,
			delta: delta
		};
				
		if(lastPower == null 
			 || (delta > this.minPowerChange) 
			 //NOTE: When we stop we ignore the minPowerChange, but also ignore duplicate stops.
			 || (power == 0.5 && lastPower != 0.5)) {
			
			this.connection.send(command, power);
			console.log(JSON.stringify(log));
		}
		else {
			console.log('Not sent ' + JSON.stringify(log));
		}
		
		this.lastPower[command] = power;
	}

	connect(host) {
		
		var connected = (socket) => {
		
			if(socket == null) { return; }
			
			socket.on('sonarF.changed', (reading) => {
				console.log("sonarF.changed "  + reading.inches);
				this.sonarF.value = reading.inches;
				this.changed();
			});
			
			socket.on('sonarB.changed', (reading) => {
				console.log("sonarB.changed "  + reading.inches);
				this.sonarB.value = reading.inches;
				this.changed();
			});
			
			socket.on('compass.changed', (reading) => {
				console.log("compass.changed "  + reading.heading);
				this.compass.value = reading.heading + ' ' + reading.bearing.abbr;
				this.changed();
			});
		};
		
		var connectError = () => {
		
		};
		
		this.connection.connect(host, connected, connectError);
	}
}

Rover.host = {
	socketio: 'http://192.168.1.95:3009',
	camera: 'http://192.168.1.95:8080'
};
