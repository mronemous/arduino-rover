class RemoteConfig {
	
  constructor($stateProvider) {
		
		$stateProvider
		.state('tab.remote', {
			url: '/remote',
			views: {
				'tab-remote': {
					templateUrl: 'components/remote/remote.html',
					controller: 'RemoteCtrl as remote'
				}
			}
		});
		
  }
}

angular.module('arduino-rover.remote', []).config(['$stateProvider', RemoteConfig]);
