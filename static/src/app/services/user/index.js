/**
 * USER SERVICES
 */

(function () {

	module.exports = angular
		.module('app.services.user', [])
		// TODO: common services
		.factory('User', ['$http', function ($http) {

			function publicGetById(id) {

				return $http.get('/api/user/' + id);

			}

			return {
				getById: publicGetById
			};

		}]);


	// requires
	require('./authenticationService');

})();