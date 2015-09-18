/**
 * CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers', [])
		// TODO: common controllers
		.controller('IndexCtrl', ['$scope', '$stateParams', '$state', 'config', function ($scope, $stateParams, $state, config) {

			$scope.cities = config.CITIES;
			$scope.codeCity = {};
			// define for guest
			$scope.availableCities = [0, 1, 2, 3, 4, 5, 6, 7];

			// TEMP: define location
			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

		}]);

	// requires

})();