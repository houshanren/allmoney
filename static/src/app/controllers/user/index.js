/**
 * USER CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers.user', [])
		// TODO: common controllers
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', '$auth', 'User', function ($scope, $stateParams, $state, $auth, User) {

			$scope.isMyProfile = false;

			User.getById($stateParams.id)
				.then(function (res) {

					// success
					$scope.data = res.data;
					if ($scope.data.id === $auth.user.id) {
						$scope.isMyProfile = true;
					}

				}, function (res) {

					// error

				});

		}])
		.controller('EmailConfirmationCtrl', ['$scope', '$stateParams', 'User', 'config', function ($scope, $stateParams, User, config) {

			User.confirmationEmail($stateParams.token)
				.then(function (res) {

					// success
					$scope.confirmed = true;

				}, function (res) {

					// error
					$scope.confirmed = false;
					$scope.error = config.ERRORS[res.data.code];

				});

		}]);

	// requires
	require('./loginController');
	require('./registerController');

})();