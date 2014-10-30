require('traceur/bin/traceur-runtime');

var j5 = require("johnny-five");

export class Rover {
	
	constructor() {
		
		this.board = new j5.Board({port: "/dev/ttyS0"});	
		this.board.on("ready", () => {
			
			this.motorL = new j5.Motor({
				pins: {
					pwm: 11,
					dir: 13,
					brake: 8
				},
				current: {
					pin: 'A1',
					freq: 250,
					range: [0, 2000]
				}
			});

			this.motorR = new j5.Motor({
				pins: {
					pwm: 3,
					dir: 12,
					brake: 9
				},
				current: {
					pin: 'A0',
					freq: 250,
					range: [0, 2000]
				}
			});
		
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
		
		});
	}

	sonarF_changed(reading) {
	
	}
	
	sonarB_changed(reading) {
	
	}

	compass_changed(reading) {
	
	}

	right(pct) {
		var power = this.pctToPower(pct);
		this.motorR.rev(power);
		this.motorL.fwd(power);
		
		console.log('right ' + power);
	}

	left(pct) {
		var power = this.pctToPower(pct);
		this.motorR.fwd(power);
		this.motorL.rev(power);
		
		console.log('left ' + power);
	}

	forward(pct) {
		var power = this.pctToPower(pct);
		this.motorR.fwd(power);
		this.motorL.fwd(power);
		
		console.log('forward ' + power);
	}

	backward(pct) {
		var power = this.pctToPower(pct);
		this.motorR.rev(power);
		this.motorL.rev(power);
		
		console.log('backward ' + power);
	}

	stop() {
		this.motorR.stop();
		this.motorL.stop();
		
		console.log('stop ');
	}

	pctToPower(pct) {
		if(pct < 100) { pct = pct + 25;}
		else if(pct > 100) { pct = 100; }
		
		return ((pct / 100) * 255);
	}
}