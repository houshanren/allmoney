/**
 * ROUTES
 */

(function () {

	module.exports = angular
		.module('app')
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'partials/index.html'
				});

			$urlRouterProvider
				.otherwise('/');

		}]);

})();