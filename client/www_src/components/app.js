class App {
	constructor($ionicPlatform) {
				
		$ionicPlatform.ready(() => {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if(window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	}
}

class AppController {
	
	constructor() {
		this.host = Rover.host;
	}
	
}

angular.module('arduino-rover', ['ionic', 'arduino-rover.remote', 'arduino-rover.settings'])
.controller('AppCtrl', AppController)
.run(App);
