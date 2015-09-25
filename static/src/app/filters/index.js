/**
 * FILTERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.filters', [])
		// TODO: common filters
		.filter('rub', ['$filter', '$locale', function ($filter, $locale) {

			return function (num) {
				return $filter('number')(num, 2) + '<span class="currency"> руб.</span>';
			};

		}]);

	// requires

})();