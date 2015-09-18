/**
 * USER REGISTER
 */

(function () {

	/**
	 * Register module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.register', [])
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.register', {
					url: '/register',
					templateUrl: 'partials/user/register.html',
					controller: 'RegisterCtrl',
					controllerAs: 'register'
				});

		}]);

	// requires

})();