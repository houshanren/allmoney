/**
 * AD CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers.ad', [])
		// TODO: common controllers
		.controller('AdCtrl', ['$scope', '$stateParams', '$state', 'Ad', 'config', function ($scope, $stateParams, $state, Ad, config) {

			// define
			$scope.reports = config.REPORTS;
			$scope.termUnits = config.TERM_UNITS;
			$scope.rateUnits = config.RATE_UNITS;
			$scope.periodUnits = config.PERIOD_UNITS;
			$scope.securityTypes = config.SECURITY_TYPES;
			$scope.waygetTypes = config.WAYGET_TYPES;
			$scope.cities = config.CITIES;

			Ad.getById($stateParams.id)
				.then(function (res) {

					// success
					$scope.data = res.data;

				}, function (res) {

					// error

				});

		}]);

	// requires
	require('./createController');
	require('./editController');

})();