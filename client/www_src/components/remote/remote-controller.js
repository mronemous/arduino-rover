class RemoteController {
	
	constructor($scope) {
		
		var changed = () => {
			$scope.$apply();
		};
		
		this.rover = new Rover(changed);
		this.host = Rover.host;
		this.rover.connect(Rover.host.socketio);
		
		this.drag = new DragController(this.rover);
	}
}

class DragController {

	constructor(rover) {
		this.rover = rover;	
	}
	
	_startDebounce() {
		if(!this._debounce) { this._debounce = ionic.debounce(this.stop, 250, false); }
		this._debounce();
	}
	
	_stopDebounce() {
		this._debounce = null;
	}
	
	up() {

		this.rover.rocketLauncher.up();
	  this._startDebounce();
		
	}

	down() {
		
		this.rover.rocketLauncher.down();
		this._startDebounce();
		
	}

	left() {
		
		this.rover.rocketLauncher.left();
		this._startDebounce();
	}

	right() {
		
		this.rover.rocketLauncher.right();
		this._startDebounce();
		
	}

	release() {		
		
		this._stopDebounce();
	
	}

	stop() {
		
		this.rover.rocketLauncher.stop();
		
	}
}

angular.module('arduino-rover.remote').controller('RemoteCtrl', RemoteController);


