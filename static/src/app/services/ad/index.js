/**
 * AD SERVICES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.services.ad', [])
		// TODO: common services
		.factory('Ad', ['$http', '$state', 'config', function ($http, $state, config) {

			function publicGetById(id) {

				return $http.get('/api/ad/' + id);

			}

			function publicCreate(data) {

				return $http.post('/api/ad/create', data);

			}

			// ...

			return {
				getById: publicGetById,
				create: publicCreate
			};

		}]);


	// requires

})();