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
			require('./controllers/user').name,
			require('./services/user').name,
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
					templateUrl: 'partials/user/view.html',
					controller: 'UserCtrl',
					controllerAs: 'user'
				});

		}]);

	// requires

})();