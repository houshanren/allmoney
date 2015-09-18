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

			function publicRegister(data) {

				return $http.post('/api/user/register', data);

			}

			return {
				getById: publicGetById,
				register: publicRegister
			};

		}]);


	// requires
	require('./authenticationService');

})();