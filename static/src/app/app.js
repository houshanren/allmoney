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

			$locationProvider
				.html5Mode(true);

		}])
		.constant('config', {
			NAME: 'ALLMONEY',
			DEBUG: true,
			ROLES: [
				'Обычный пользователь',
				'Модератор',
				'Администратор',
				'Частное лицо',
				'МФО',
				'Ломбард'
			],
			CITIES: [
				'Все города',
				'Москва',
				'Санкт-Петербург',
				'Новосибирск',
				'Нижний-Новгород',
				'Красноярск',
				'Казань',
				'Екатеринбург'
			]
		});

	// requires
	require('./routes');

})();