/**
 * CATALOG CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers.catalog', [])
		// TODO: common controllers
		.controller('CatalogCtrl', ['$scope', '$stateParams', 'Catalog', 'config', function ($scope, $stateParams, Catalog, config) {

			// define
			$scope.reports = config.REPORTS;
			$scope.cities = config.CITIES;
			$scope.citiesCodes = [0, 1, 2, 3, 4, 5, 6, 7];
			$scope.amounts = config.AMOUNTS;
			$scope.terms = config.TERMS;

			$scope.data = {};
			$scope.ads = [];

			Catalog.getAds($stateParams.category)
				.then(function (res) {

					// success
					$scope.ads = res.data;
					if (!$scope.ads.length)
						$scope.ads = false;

				}, function (res) {

					// error

				});

		}])
		.controller('CatalogAdCtrl', ['$scope', '$state', 'config', function ($scope, $state, config) {

			// define
			$scope.reports = config.REPORTS;
			$scope.termUnits = config.TERM_UNITS;
			$scope.rateUnits = config.RATE_UNITS;
			$scope.periodUnits = config.PERIOD_UNITS;
			$scope.securityTypes = config.SECURITY_TYPES;
			$scope.waygetTypes = config.WAYGET_TYPES;

		}]);

	// requires

})();