/**
 * CATALOG
 */

'use strict';

(function () {

	/**
	 * Catalog module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.catalog', [
			require('./controllers/catalog').name,
			require('./services/catalog').name,
			require('./directives/catalog').name,
			require('./filters/catalog').name
		])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('catalog', {
					url: '/catalog',
					abstract: true,
					template: '<ui-view>',
					data: {
						access: config.ACCESS.public
					}
				})
				.state('catalog.view', {
					url: '/:category',
					templateUrl: 'partials/catalog/view.html',
					controller: 'CatalogCtrl',
					controllerAs: 'catalog',
					params:  {
						category: {
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