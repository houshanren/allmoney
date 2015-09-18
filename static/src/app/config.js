/**
 * CONFIG
 */

(function () {

	/**
	 * Config module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.config', [])
		.constant('config', {
			NAME: 'ALLMONEY',
			DEBUG: true,
			ROLES: [
				'Анонимус',
				'Пользователь',
				'Модератор',
				'Администратор',
				'Частное лицо',
				'МФО',
				'Ломбард'
			],
			ACCESS: require('./access.json'),
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

})();