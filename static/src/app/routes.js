/**
 * ROUTES
 */

'use strict';

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

			// interceptors
			$httpProvider.interceptors.push('ResponseInterceptor');
			$httpProvider.interceptors.push('ProgressInterceptor');

		}])
		.run(['$rootScope', '$state', '$auth', 'User', 'config', function ($rootScope, $state, $auth, User, config) {

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

				// TODO: validate user
				$auth.validateUser()
					.then(function (res) {

						if (!('data' in toState) || !('access' in toState.data)) {
							event.preventDefault();
						} else {
							User.checkAccess(toState.data.access, fromState.url, $auth.user.role, function (access) {

								if (!access)
									event.preventDefault();

							});
						}

					}, function (res) {

						$auth.user.role = 0;
						// check access
						User.checkAccess(toState.data.access, fromState.url, $auth.user.role, function (access) {

							if (!access)
								event.preventDefault();

						});

					});

			});

			$rootScope.$on('auth:login-success', function (event, reason) {

				$state.go('index');

			});

			$rootScope.$on('auth:logout-success', function (event) {

				$auth.user.role = 0;
				// check access
				User.checkAccess($state.current.data.access, $state.current.url, $auth.user.role, function (access) {

					if (!access)
						event.preventDefault();

				});

			});

		}]);

})();