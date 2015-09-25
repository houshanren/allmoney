/**
 * CATALOG DIRECTIVES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.directives.catalog', [])
		// TODO: common directives
		.directive('ad', ['$state', 'config', function ($state, config) {

			return {
				restrict: 'E',
				replace: true,
				scope: {
					ad: '='
				},
				templateUrl: 'partials/catalog/ad.html',
				controller: 'CatalogAdCtrl',
				controllerAs: 'ad'
			};

		}]);

	// requires

})();