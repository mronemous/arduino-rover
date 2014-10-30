require('traceur/bin/traceur-runtime');

var usb = require('usb');

usb.setDebugLevel(3);

export class RocketLauncher {

	constructor() {
		this.commands = {
			'down'        :   0x01,
			'up'          :   0x02,
			'left'        :   0x04,
			'right'       :   0x08,
			'shoot'       :   0x10,
			'stop'        :   0x20,
			'boom'        :   0x40
  	};

		this.connect();
	}

	connect() {
		console.log('usb connect ');

		this.device = usb.findByIds(8483, 4112);
    this.device.open();
    this.interface = this.device.interfaces[0];
    if (this.interface.isKernelDriverActive()) {
      this.interface.detachKernelDriver();
    }
	}

	send(command)
  {
    console.log('Send "'+ command +'"');

		var signal = (this.commands[command]) ? this.commands[command] : eval(command);

    this.device.controlTransfer(
      0x21,
      0x09,
      0x0,
      0x0,
      new Buffer([0x02, signal, 0x00,0x00,0x00,0x00,0x00,0x00]),
      () => {
        //console.log(command)
      }
    );
  }

	up() {
		console.log('up ');
		this.send('up');
	}

  down() {
		console.log('down ');
		this.send('down');
	}

	left() {
		console.log('left ');
		this.send('left');
	}

	right() {
		console.log('right ');
		this.send('right');
	}

	stop() {
		console.log('stop ');
		this.send('stop');
	}

	shoot() {
		console.log('shoot ');
		this.send('shoot');
	}

	disconnect() {
		console.log('usb disconnect ');

		this.interface.release(
    function(data) {
      console.log('usb disconnected')
      process.exit();
    });

	}
}
