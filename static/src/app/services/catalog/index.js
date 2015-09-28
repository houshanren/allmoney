/**
 * CATALOG SERVICES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.services.catalog', [])
		// TODO: common services
		.factory('Catalog', ['$http', '$state', 'config', function ($http, $state, config) {

			function publicGetAds(category) {

				return $http.get('/api/catalog/' + category);

			}

			// ...

			return {
				getAds: publicGetAds
			};

		}]);

	// requires

})();