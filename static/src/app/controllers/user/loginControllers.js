/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', '$auth', function ($scope, $auth) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			/*console.log($scope.access);*/

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				$auth.submitLogin($scope.data)
					.then(function (res) {

						// TEMP
						console.log(res);

					});
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