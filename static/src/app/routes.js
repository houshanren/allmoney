/**
 * ROUTES
 */

(function () {

	module.exports = angular
		.module('app')
		.config(['$stateProvider', '$urlRouterProvider', 'config', function ($stateProvider, $urlRouterProvider, config) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'partials/index.html',
					controller: 'IndexCtrl',
					controllerAs: 'index',
					data: {
						access: config.ACCESS.public
					}
				})
				.state('404', {
					url: '/404',
					templateUrl: 'partials/404.html',
					data: {
						access: config.ACCESS.public
					}
				});

			$urlRouterProvider
				.otherwise('/404');

		}])
		.run(['$rootScope', '$state', function ($rootScope, $state) {

			$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

				

			});

		}]);

})();