class AppConfig {
	
  constructor($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
		
		$sceDelegateProvider.resourceUrlWhitelist([
    	'self',
    	Rover.host.socketio + '**',
			Rover.host.camera + '**',
  	]);
					
		$stateProvider
		.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'components/app.html'
		});
	
		$urlRouterProvider
		.otherwise('/tab/remote');
  }
	
}

angular.module('arduino-rover').config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider', AppConfig]);