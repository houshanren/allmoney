/**
 * AD CREATE
 */

'use strict';

(function () {

	/**
	 * Create module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.ad.create', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('ad.create', {
					url: '/create',
					templateUrl: 'partials/ad/create.html',
					controller: 'AdCreateCtrl',
					controllerAs: 'create',
					data: {
						access: config.ACCESS.lender
					}
				});

		}]);

	// requires

})();