/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', 'Authentication', function ($scope, Authentication) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			/*console.log($scope.access);*/

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				Authentication.login($scope.data);
				// ...

				// reset form
				$scope.reset();

			};

			$scope.reset = function () {

				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

			

		}]);

})();