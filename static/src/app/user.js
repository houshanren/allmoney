/**
 * USER
 */

(function () {

	/**
	 * Login module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user', [
			'ui.router',
			require('./login').name,
			require('./register').name
		])
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user', {
					url: '/user',
					abstract: true,
					template: '<ui-view>'
				})
				.state('user.view', {
					url: '/{id:int}',
					templateUrl: 'partials/user/view.html'
				});

		}]);

	// requires

})();