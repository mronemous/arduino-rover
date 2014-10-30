class RocketLauncher {

	constructor() {

	}
	
	up(power) {
	  this.connection.send('rocketLauncher.up');
	}

	down(power) {
		this.connection.send('rocketLauncher.down');
	}

	left(power) {
		this.connection.send('rocketLauncher.left');
	}

	right(power) {
		this.connection.send('rocketLauncher.right');
	}

	shoot() {
		this.connection.send('rocketLauncher.shoot');
	}

	stop() {
		this.connection.send('rocketLauncher.stop');
	}
}