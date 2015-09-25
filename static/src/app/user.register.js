/**
 * USER REGISTER
 */

'use strict';

(function () {

	/**
	 * Register module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.register', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user.register', {
					url: '/register',
					templateUrl: 'partials/user/register.html',
					controller: 'UserRegisterCtrl',
					controllerAs: 'register',
					data: {
						access: config.ACCESS.anonymous
					}
				})
				.state('user.confirm', {
					url: '/register/:token',
					templateUrl: 'partials/user/confirm.html',
					controller: 'UserEmailConfirmationCtrl',
					controllerAs: 'confirm',
					params:  {
						token: {
							value: null,
							squash: true
						}
					},
					data: {
						access: config.ACCESS.public
					}
				});

		}]);

	// requires

})();