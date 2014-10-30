class SettingsConfig {
	
  constructor($stateProvider) {
		
		$stateProvider
		.state('tab.settings', {
			url: '/settings',
			views: {
				'tab-settings': {
					templateUrl: 'components/settings/settings.html',
					controller: 'SettingsCtrl as settings'
				}
			}
		});
		
  }
}

angular.module('arduino-rover.settings', []).config(['$stateProvider', SettingsConfig]);
