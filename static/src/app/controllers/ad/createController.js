/**
 * AD CREATE CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.ad')
		.controller('AdCreateCtrl', ['$scope', '$state', '$auth', 'Ad', 'config', function ($scope, $state, $auth, Ad, config) {

			$scope.user = $auth.user;

			// selects
			// term units
			$scope.termUnits = config.TERM_UNITS;
			$scope.availableTermUnits = [0];
			// rate units
			$scope.rateUnits = config.RATE_UNITS;
			$scope.availableRateUnits = [0, 1, 2];
			// period units
			$scope.periodUnits = config.PERIOD_UNITS;
			$scope.availablePeriodUnits = [0, 1, 2];
			// security
			$scope.securityTypes = config.SECURITY_TYPES;
			$scope.securityCodes = [0, 1];
			// wayget
			$scope.waygetTypes = config.WAYGET_TYPES;
			$scope.waygetCodes = [0, 1];
			// cities
			$scope.cities = config.CITIES;
			$scope.citiesCodes = [0, 1, 2, 3, 4, 5, 6, 7];

			$scope.initial = {
				term: {
					unit: 0
				},
				rate: {
					unit: 0
				},
				period: {
					unit: 0
				}
			};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: create submit
			$scope.submit = function () {

				// TODO: create
				Ad.create($scope.data)
					.then(function (res) {

						// reset form
						$scope.reset();
						$state.go('user.personal');

					});

			};

			$scope.reset = function () {

				$scope.createForm.$setPristine();
				$scope.createForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

		}]);

})();