/**
 * USER CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers.user', [])
		// TODO: common controllers
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', '$auth', 'User', 'config', function ($scope, $stateParams, $state, $auth, User, config) {

			$scope.reports = config.REPORTS;
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
		.controller('UserEmailConfirmationCtrl', ['$scope', '$stateParams', 'User', 'config', function ($scope, $stateParams, User, config) {

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
	require('./personalController');
	require('./editController');

})();