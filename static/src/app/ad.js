/**
 * AD
 */

'use strict';

(function () {

	/**
	 * Ad module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.ad', [
			require('./controllers/ad').name,
			require('./services/ad').name,
			require('./ad.create').name
		])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('ad', {
					url: '/ad',
					abstract: true,
					template: '<ui-view>',
					data: {
						access: config.ACCESS.public
					}
				})
				.state('ad.view', {
					url: '/:id',
					templateUrl: 'partials/ad/view.html',
					controller: 'AdCtrl',
					controllerAs: 'ad',
					params:  {
						id: {
							value: null,
							squash: true
						}
					},
					data: {
						access: config.ACCESS.public
					}
				});

		}]);

	// requires

})();