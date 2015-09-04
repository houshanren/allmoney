/**
 * USER LOGIN
 */

(function () {

	/**
	 * Login module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.login', [
			'ui.router',
			require('./controllers/user').name
		])
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.login', {
					url: '/login',
					templateUrl: 'partials/user/login.html',
					controller: 'LoginController',
					controllerAs: 'login'
				});

		}]);

	// requires

})();