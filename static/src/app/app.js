/**
 * APPLICATION
 */

(function () {

	/**
	 * App module
	 * @type {Angular.module}
	 */
	angular
		.module('app', [
			'ui.router',
			require('./directives').name/*,
			require('./controllers').name,
			require('./directives').name,
			require('./filters/').name,
			require('./services').name*/
		])
		.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'partials/index.html'
				});

			$urlRouterProvider
				.otherwise('/');

			$locationProvider
				.html5Mode(true);

		}])
		.constant('config', {
			NAME: 'ALLMONEY',
			DEBUG: true,
			SERVER_ADDRESS: '89.189.176.161',
			SERVER_PORT: '3000'
		});

})();