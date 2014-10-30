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
				
		this.rocketLauncher = new RocketLauncher();
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

		this.rocketLauncher.connection = this._connection;
		return this._connection;
	}

	forward(power) {
		this.connection.send('forward', power);
	}

	backward(power) {
		this.connection.send('backward', power);
	}

	left(power) {
		this.connection.send('left', power);
	}

	right(power) {
		this.connection.send('right', power);
	}

	stop() {		
		this.connection.send('stop');
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
	camera: 'http://192.168.1.95:8081'
};
