/**
 * APPLICATION
 */

'use strict';

(function () {

	/**
	 * App module
	 * @type {Angular.module}
	 */
	angular
		.module('app', [
			'ui.router',
			// instead ngCookies https://github.com/lynndylanhurley/ng-token-auth#why-does-this-module-use-ipcookies-instead-of-ngcookies
			'ng-token-auth',
			// dom
			'ngSanitize',
			'ngProgress',
			'ui.bootstrap',
			'ui.select',
			'checklist-model',
			// values & constants
			require('./config').name,
			// components
			require('./directives').name,
			require('./controllers').name,
			require('./directives').name,
			require('./filters').name,
			require('./services').name,
			// modules
			require('./user').name,
			require('./ad').name,
			require('./catalog').name
		])
		.config(['$locationProvider', '$authProvider', '$provide', function ($locationProvider, $authProvider, $provide) {

			$locationProvider
				.html5Mode(true);

			// TODO: auth config
			$authProvider.configure({
				// localhost
				apiUrl: '/api',
				tokenValidationPath: '/user/validate',
  				signOutUrl: '/user/signout',
  				emailRegistrationPath: '/user/register',
				accountUpdatePath: '/user/update',
				accountDeletePath: '/user/delete',
				passwordResetPath: '/user/password',
				passwordUpdatePath: '/user/password',
				emailSignInPath: '/user/signin',

				tokenFormat: {
					"access-token": "{{ token }}",
					"token-type": "Bearer",
					"expiry": "{{ expiry }}",
					"uid": "{{ uid }}"
				},
				handleLoginResponse: function (res) {

					return res;

				},
				handleAccountUpdateResponse: function (res) {

					return res;
					
				},
				handleTokenValidationResponse: function (res) {

					return res;
					
				}
			});

			// HACK: redefine ui-bootstrap templates
			$provide.decorator('alertDirective', function ($delegate) {

				$delegate[0].templateUrl = 'partials/alert.html';
				return $delegate;

			});

		}]);

	// requires
	require('./routes');

})();