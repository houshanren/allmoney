/**
 * CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers', [])
		// TODO: common controllers
		.controller('MainCtrl', ['$scope', '$location', 'config', function ($scope, $location, config) {

			$scope.isActive = function (location) {

				return location === $location.path();

			};

		}])
		.controller('IndexCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			$scope.cities = config.CITIES;
			$scope.codeCity = {};
			// define for guest
			$scope.availableCities = [0, 1, 2, 3, 4, 5, 6, 7];

			// TEMP: define location
			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

		}])
		.controller('UserPanelCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			$scope.handleSignOutBtnClick = function () {

				$auth.signOut()
					.then(function (res) {
						
						// ...

					});

			};

		}])
		.controller('AlertsSectionCtrl', ['$scope', '$timeout', 'config', function ($scope, $timeout, config) {

			$scope.alerts = [];

			// close alert
			$scope.closeAlert = function (index) {

				$scope.alerts.splice(index, 1);

			};

			// TODO: checking new allert
			$scope.$on('new-alert', function(event, data) {

				var alert = $scope.alerts.push({
					type: data.type,
					closeable: true,
					message: config.ERRORS[data.code]
				});

				$timeout(function () {

					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);

				}, 8000);

			});

		}]);

	// requires

})();