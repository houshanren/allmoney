/**
 * USER PERSONAL
 */

'use strict';

(function () {

	/**
	 * Personal module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.personal', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user.personal', {
					url: '/personal',
					templateUrl: 'partials/user/personal.html',
					controller: 'UserPersonalCtrl',
					controllerAs: 'personal',
					data: {
						access: config.ACCESS.user
					}
				})
				.state('user.edit', {
					url: '/edit',
					templateUrl: 'partials/user/edit.html',
					controller: 'UserEditCtrl',
					controllerAs: 'edit',
					data: {
						access: config.ACCESS.user
					}
				});

		}]);

	// requires

})();