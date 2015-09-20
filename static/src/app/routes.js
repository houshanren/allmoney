/**
 * ROUTES
 */

(function () {

	module.exports = angular
		.module('app')
		.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'config', function ($stateProvider, $urlRouterProvider, $httpProvider, config) {

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


			// redirect to login
			/*$httpProvider.interceptors.push(function ($q, $location) {

		        return {
		            'responseError': function (response) {

		                if (response.status === 401 || response.status === 403) {
		                    $location.path('/user/login');
		                }
		                return $q.reject(response);

		            }
		        };

		    });*/

		}])
		.run(['$rootScope', '$state', '$auth', function ($rootScope, $state, $auth) {

			$auth.validateUser();

		}]);

})();