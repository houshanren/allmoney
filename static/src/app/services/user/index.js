/**
 * USER SERVICES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.services.user', [])
		// TODO: common services
		.factory('User', ['$http', '$state', '$auth', 'config', function ($http, $state, $auth, config) {

			function publicGetById(id) {

				return $http.get('/api/user/' + id);

			}

			function publicCheckAccess(access, fromUrl, role, callback) {

				if (role === undefined) {
					role = config.DEFAULT_ROLE;
				}

				if (_.indexOf(access, role) === -1) {
					callback(false);

					if ($auth.user.signedIn) {
						$state.go('index');
					} else {
						$state.go('user.login');
					}
				} else {
					callback(true);
				}

			}

			function publicConfirmationEmail(token) {

				return $http.get('/api/user/register/' + token);

			}

			return {
				getById: publicGetById,
				checkAccess: publicCheckAccess,
				confirmationEmail: publicConfirmationEmail
			};

		}]);

	// requires

})();