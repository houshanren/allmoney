/**
 * USER LOGIN
 */

'use strict';

(function () {

	/**
	 * Login module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.login', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user.login', {
					url: '/login',
					templateUrl: 'partials/user/login.html',
					controller: 'UserLoginCtrl',
					controllerAs: 'login',
					data: {
						access: config.ACCESS.anonymous
					}
				});

		}]);

	// requires

})();