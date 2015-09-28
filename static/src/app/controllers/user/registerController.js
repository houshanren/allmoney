/**
 * USER REGISTER CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('UserRegisterCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			// TODO: name roles
			$scope.roles = config.ROLES;
			// define for guest
			$scope.availableRoles = [1, 4, 5, 6];

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: register submit
			$scope.submit = function () {

				// TODO: register
				$auth.submitRegistration($scope.data)
					.then(function (res) {

						$scope.reset();
						$state.go('user.personal');

					});

				// reset form
				/*$scope.reset();*/

			};

			$scope.reset = function () {

				$scope.registerForm.$setPristine();
				$scope.registerForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

		}]);

})();