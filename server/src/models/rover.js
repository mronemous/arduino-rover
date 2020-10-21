require('traceur/bin/traceur-runtime');

var j5 = require("johnny-five");

export class Rover {
	
	constructor() {
		
		this.board = new j5.Board({port: "/dev/ttyACM0"});	
		this.board.on("ready", () => {
			
			this.throttleMotor = new j5.Servo({
				pin: 11,
			  type: "continuous"
			});

			this.steerServo = new j5.Servo({
				pin: 10,
			  type: "continuous"
			});
		
			this.tiltServo = new j5.Servo({
				pin: 6,
			  type: "continuous"
			});

			this.rotateServo = new j5.Servo({
				pin: 5,
			  type: "continuous"
			});
		
		
		  /*
			
			Back - 11
			Front - 10
			Steering - 9
			Pan Up/Down - 6
			Pan Left/Right - 5
			Sonar - 7, 4
			Compass - SDA/SDL
			GPS - ?
			
		  */
			/*		
			var me = this; //Because j5 uses explicit scope in the callback we need to make rover this available.
		
			this.sonarF = new j5.Ping({pin: 7, 
																 freq: 350});		
			this.sonarF.on("change", function(error, value) {
			  console.log("SonarF reading " + this.inches + " inches away");
				me.sonarF_changed({
					value: value,
					error: error,
					inches: this.inches
    		});
			});
				
			this.sonarB = new j5.Ping({pin: 4, 
																 freq: 350});		
			this.sonarB.on("change", function(error, value) {
			  console.log("SonarB reading " + this.inches + " inches away");
				me.sonarB_changed({
					value: value,
					error: error,
					inches: this.inches
    		});
			});
		
		  this.compass = new j5.Magnetometer();
			this.compass.on("headingchange", function() {

				console.log("heading", Math.floor(this.heading));
				console.log("bearing", this.bearing);
				
				me.compass_changed({
						heading: Math.floor(this.heading),
						bearing: this.bearing
    		});

			});
		 */
		});
	}

	sonarF_changed(reading) {
	
	}
	
	sonarB_changed(reading) {
	
	}

	compass_changed(reading) {
	
	}

	throttle(power) {
		var signal = this.signalPower(power);
		this.throttleMotor.to(signal);
		
		console.log('throttle ' + signal);
	}

	steer(power) {
		var signal = this.signalPower(power);
		this.steerServo.to(signal);
		
		console.log('steer ' + signal);
	}

	cameraTilt(power) {
		var signal = this.signalPower(power);
		this.tiltServo.to(signal);
	
		console.log('camera.tilt ' + signal);
	}

	cameraRotate(power) {
		var signal = this.signalPower(power);
		this.rotateServo.to(signal);
		
		console.log('camera.rotate ' + signal);
	}

	stop() {
		var signal = this.signalPower(0);
		this.throttleMotor.to(signal);
		this.steerServo.to(signal);
		
		console.log('stop ' + signal);
	}

    //Power is value -1.0 - 1.0 convert to 0 - 180
	signalPower(power) {
		var signal = (power * 90) + 90;
		
		return signal
	}
}