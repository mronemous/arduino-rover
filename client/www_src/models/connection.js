class Connection {

	constructor() {
		this._socket = null;
	}
	
	send(command) {
		console.log(command + ' ' + JSON.stringify(Array.prototype.slice.call(arguments, 1)));
	}

	connect(uri, success, error) {
		console.log('connect ' + uri);
		success();
	}
}

class SocketIoConnection extends Connection {
	
	constructor() {
	}
	
	send(command) {
		if(!this._socket) { return; }		
		
		console.log(command + ' ' + JSON.stringify(Array.prototype.slice.call(arguments, 1)));
		this._socket.emit(command, Array.prototype.slice.call(arguments, 1));
	}

	connect(uri, success, error) {
		if(!this._socket) {
			var socket = io.connect(uri);
			socket.on('connected', (data) => {
				console.log(data);
				this._socket = socket;
				success(socket);
			});
		}	
	}
}
