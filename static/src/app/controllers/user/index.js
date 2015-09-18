/**
 * USER CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers.user', [])
		// TODO: common controllers
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', 'User', function ($scope, $stateParams, $state, User) {

			User.getById($stateParams.id)
				.success(function (data) {

					$scope.data = data;
					console.log(data);

				})
				.error(function (data, status) {

					/*if (status == 404) $state.go('404');*/
					console.log(data.message);

				});

		}]);

	// requires
	require('./loginControllers');
	require('./registerControllers');

})();