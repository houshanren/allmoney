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
			'ngSanitize',
			'ui.select',
			// values & constants
			require('./config').name,
			// components
			require('./directives').name,
			require('./controllers').name,
			require('./directives').name,
			require('./filters').name,
			require('./services').name,
			// modules
			require('./user').name
		])
		.config(['$locationProvider', function ($locationProvider) {

			/*$rootScope.access = require('./access.json');*/

			$locationProvider
				.html5Mode(true);

		}]);

	// requires
	require('./routes');

})();