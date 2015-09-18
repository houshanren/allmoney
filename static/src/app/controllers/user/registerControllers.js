/**
 * USER REGISTER CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('RegisterCtrl', ['$scope', 'config', function ($scope, config) {

			// TODO: name roles
			$scope.roles = config.ROLES;
			$scope.codeRole = {};
			// define for guest
			$scope.availableRoles = [0, 3, 4, 5];

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				console.log($scope.data);
				// ...

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