/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	/**
	 * Login controllers
	 * @type {Angular.module}
	 */
	angular
		.module('app.controllers.user')
		.controller('LoginController', ['$scope', function ($scope) {

			$scope.initial = {};
			$scope.user = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				console.log($scope.user);
				// ...

				// reset form
				$scope.reset();

			};

			$scope.reset = function () {

				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
				$scope.user = angular.copy($scope.initial);

			};

			

		}]);

})();