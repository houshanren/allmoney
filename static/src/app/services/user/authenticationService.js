/**
 * USER AUTHENTICATION SERVICES
 */

(function () {

	module.exports = angular
		.module('app.services.user')
		.factory('Authentication', ['$http', function ($http) {

			function publicLogin(data) {

				// ...

			}

			return {
				login: publicLogin
			};

		}]);

})();