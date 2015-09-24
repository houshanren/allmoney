/**
 * USER REGISTER CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('RegisterCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			// TODO: name roles
			$scope.roles = config.ROLES;
			$scope.codeRole = {};
			// define for guest
			$scope.availableRoles = [1, 4, 5, 6];

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				$auth.submitRegistration($scope.data)
					.then(function (res) {

						$state.go('index');

					});

				// reset form
				$scope.reset();

			};

			$scope.reset = function () {

				$scope.registerForm.$setPristine();
				$scope.registerForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

			

		}]);

})();