/**
 * USER LOGIN CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', '$auth', function ($scope, $auth) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: login
				$auth.submitLogin($scope.data)
					.then(function (res) {

						// success

					}, function (res) {

						// errror

					});

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