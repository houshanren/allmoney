/**
 * USER REGISTER
 */

(function () {

	/**
	 * Register module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.register', [
			'ui.router'
		])
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.register', {
					url: '/register',
					templateUrl: 'partials/user/register.html'
				});

		}]);

	// requires

})();