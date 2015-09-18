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
					templateUrl: 'partials/index.html',
					controller: 'IndexCtrl',
					controllerAs: 'index'
				})
				.state('404', {
					url: '/404',
					templateUrl: 'partials/404.html'
				});

			$urlRouterProvider
				.otherwise('/404');

		}]);

})();