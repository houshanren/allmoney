(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=/**
 * ROLES:
 * 0 - anonymous
 * 1 - user
 * 2 - moderator
 * 3 - admin
 * 4 - private person
 * 5 - microfinance organization (MFI)
 * 6 - pawnshop
 */

{
	"public": [0, 1, 2, 3, 4, 5, 6],
	"anonymous": [0],
	"user": [1, 2, 3, 4, 5, 6],
	"admin": [3]
}
},{}],2:[function(require,module,exports){
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
},{"./config":3,"./controllers":4,"./directives":8,"./filters":9,"./routes":12,"./services":13,"./user":16}],3:[function(require,module,exports){
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
},{"./access.json":1}],4:[function(require,module,exports){
/**
 * CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers', [])
		// TODO: common controllers
		.controller('IndexCtrl', ['$scope', '$stateParams', '$state', 'config', function ($scope, $stateParams, $state, config) {

			$scope.cities = config.CITIES;
			$scope.codeCity = {};
			// define for guest
			$scope.availableCities = [0, 1, 2, 3, 4, 5, 6, 7];

			// TEMP: define location
			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

		}]);

	// requires

})();
},{}],5:[function(require,module,exports){
/**
 * USER CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers.user', [])
		// TODO: common controllers
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', 'User', function ($scope, $stateParams, $state, User) {

			User.getById($stateParams.id)
				.success(function (data) {

					$scope.data = data;
					console.log(data);

				})
				.error(function (data, status) {

					/*if (status == 404) $state.go('404');*/
					if (!!data.message) console.log(data.message);

				});

		}]);

	// requires
	require('./loginControllers');
	require('./registerControllers');

})();
},{"./loginControllers":6,"./registerControllers":7}],6:[function(require,module,exports){
/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', 'Authentication', function ($scope, Authentication) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			/*console.log($scope.access);*/

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				Authentication.login($scope.data);
				// ...

				// reset form
				$scope.reset();

			};

			$scope.reset = function () {

				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

			

		}]);

})();
},{}],7:[function(require,module,exports){
/**
 * USER REGISTER CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('RegisterCtrl', ['$scope', 'config', 'User', function ($scope, config, User) {

			// TODO: name roles
			$scope.roles = config.ROLES;
			$scope.codeRole = {};
			// define for guest
			$scope.availableRoles = [1, 4, 5, 6];

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				User.register($scope.data);
				// ...

				// reset form
				$scope.reset();

			};

			$scope.reset = function () {

				$scope.registerForm.$setPristine();
				$scope.registerForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

			

		}]);

})();
},{}],8:[function(require,module,exports){
/**
 * DIRECTIVES
 */

(function () {

	module.exports = angular
		.module('app.directives', []);
		// TODO: common directives


	// requires

})();
},{}],9:[function(require,module,exports){
/**
 * FILTERS
 */

(function () {

	module.exports = angular
		.module('app.filters', []);
		// TODO: common filters


	// requires

})();
},{}],10:[function(require,module,exports){
/**
 * USER LOGIN
 */

(function () {

	/**
	 * Login module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.login', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user.login', {
					url: '/login',
					templateUrl: 'partials/user/login.html',
					controller: 'LoginCtrl',
					controllerAs: 'login',
					data: {
						access: config.ACCESS.anonymous
					}
				});

		}]);

	// requires

})();
},{}],11:[function(require,module,exports){
/**
 * USER REGISTER
 */

(function () {

	/**
	 * Register module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.register', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user.register', {
					url: '/register',
					templateUrl: 'partials/user/register.html',
					controller: 'RegisterCtrl',
					controllerAs: 'register',
					data: {
						access: config.ACCESS.anonymous
					}
				});

		}]);

	// requires

})();
},{}],12:[function(require,module,exports){
/**
 * ROUTES
 */

(function () {

	module.exports = angular
		.module('app')
		.config(['$stateProvider', '$urlRouterProvider', 'config', function ($stateProvider, $urlRouterProvider, config) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'partials/index.html',
					controller: 'IndexCtrl',
					controllerAs: 'index',
					data: {
						access: config.ACCESS.public
					}
				})
				.state('404', {
					url: '/404',
					templateUrl: 'partials/404.html',
					data: {
						access: config.ACCESS.public
					}
				});

			$urlRouterProvider
				.otherwise('/404');

		}])
		.run(['$rootScope', '$state', function ($rootScope, $state) {

			$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

				

			});

		}]);

})();
},{}],13:[function(require,module,exports){
/**
 * SERVICES
 */

(function () {

	module.exports = angular
		.module('app.services', []);
		// TODO: common services


	// requires

})();
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{"./authenticationService":14}],16:[function(require,module,exports){
/**
 * USER
 */

(function () {

	/**
	 * Login module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user', [
			require('./controllers/user').name,
			require('./services/user').name,
			require('./login').name,
			require('./register').name
		])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user', {
					url: '/user',
					abstract: true,
					template: '<ui-view>',
					data: {
						access: config.ACCESS.public
					}
				})
				.state('user.view', {
					url: '/:id',
					templateUrl: 'partials/user/view.html',
					controller: 'UserCtrl',
					controllerAs: 'user',
					data: {
						access: config.ACCESS.public
					}
				});

		}]);

	// requires

})();
},{"./controllers/user":5,"./login":10,"./register":11,"./services/user":15}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVycy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9yZWdpc3RlckNvbnRyb2xsZXJzLmpzIiwic3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL2FwcC9maWx0ZXJzL2luZGV4LmpzIiwic3JjL2FwcC9sb2dpbi5qcyIsInNyYy9hcHAvcmVnaXN0ZXIuanMiLCJzcmMvYXBwL3JvdXRlcy5qcyIsInNyYy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL3VzZXIvYXV0aGVudGljYXRpb25TZXJ2aWNlLmpzIiwic3JjL2FwcC9zZXJ2aWNlcy91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPS8qKlxyXG4gKiBST0xFUzpcclxuICogMCAtIGFub255bW91c1xyXG4gKiAxIC0gdXNlclxyXG4gKiAyIC0gbW9kZXJhdG9yXHJcbiAqIDMgLSBhZG1pblxyXG4gKiA0IC0gcHJpdmF0ZSBwZXJzb25cclxuICogNSAtIG1pY3JvZmluYW5jZSBvcmdhbml6YXRpb24gKE1GSSlcclxuICogNiAtIHBhd25zaG9wXHJcbiAqL1xyXG5cclxue1xyXG5cdFwicHVibGljXCI6IFswLCAxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFub255bW91c1wiOiBbMF0sXHJcblx0XCJ1c2VyXCI6IFsxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFkbWluXCI6IFszXVxyXG59IiwiLyoqXHJcbiAqIEFQUExJQ0FUSU9OXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQXBwIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnLCBbXHJcblx0XHRcdCd1aS5yb3V0ZXInLFxyXG5cdFx0XHQnbmdTYW5pdGl6ZScsXHJcblx0XHRcdCd1aS5zZWxlY3QnLFxyXG5cdFx0XHQvLyB2YWx1ZXMgJiBjb25zdGFudHNcclxuXHRcdFx0cmVxdWlyZSgnLi9jb25maWcnKS5uYW1lLFxyXG5cdFx0XHQvLyBjb21wb25lbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzJykubmFtZSxcclxuXHRcdFx0Ly8gbW9kdWxlc1xyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRsb2NhdGlvblByb3ZpZGVyJywgZnVuY3Rpb24gKCRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQvKiRyb290U2NvcGUuYWNjZXNzID0gcmVxdWlyZSgnLi9hY2Nlc3MuanNvbicpOyovXHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vcm91dGVzJyk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDT05GSUdcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBDb25maWcgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKVxyXG5cdFx0LmNvbnN0YW50KCdjb25maWcnLCB7XHJcblx0XHRcdE5BTUU6ICdBTExNT05FWScsXHJcblx0XHRcdERFQlVHOiB0cnVlLFxyXG5cdFx0XHRST0xFUzogW1xyXG5cdFx0XHRcdCfQkNC90L7QvdC40LzRg9GBJyxcclxuXHRcdFx0XHQn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMJyxcclxuXHRcdFx0XHQn0JzQvtC00LXRgNCw0YLQvtGAJyxcclxuXHRcdFx0XHQn0JDQtNC80LjQvdC40YHRgtGA0LDRgtC+0YAnLFxyXG5cdFx0XHRcdCfQp9Cw0YHRgtC90L7QtSDQu9C40YbQvicsXHJcblx0XHRcdFx0J9Cc0KTQnicsXHJcblx0XHRcdFx0J9Cb0L7QvNCx0LDRgNC0J1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRBQ0NFU1M6IHJlcXVpcmUoJy4vYWNjZXNzLmpzb24nKSxcclxuXHRcdFx0Q0lUSUVTOiBbXHJcblx0XHRcdFx0J9CS0YHQtSDQs9C+0YDQvtC00LAnLFxyXG5cdFx0XHRcdCfQnNC+0YHQutCy0LAnLFxyXG5cdFx0XHRcdCfQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsycsXHJcblx0XHRcdFx0J9Cd0L7QstC+0YHQuNCx0LjRgNGB0LonLFxyXG5cdFx0XHRcdCfQndC40LbQvdC40Lkt0J3QvtCy0LPQvtGA0L7QtCcsXHJcblx0XHRcdFx0J9Ca0YDQsNGB0L3QvtGP0YDRgdC6JyxcclxuXHRcdFx0XHQn0JrQsNC30LDQvdGMJyxcclxuXHRcdFx0XHQn0JXQutCw0YLQtdGA0LjQvdCx0YPRgNCzJ1xyXG5cdFx0XHRdXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLmNpdGllcyA9IGNvbmZpZy5DSVRJRVM7XHJcblx0XHRcdCRzY29wZS5jb2RlQ2l0eSA9IHt9O1xyXG5cdFx0XHQvLyBkZWZpbmUgZm9yIGd1ZXN0XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVDaXRpZXMgPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgN107XHJcblxyXG5cdFx0XHQvLyBURU1QOiBkZWZpbmUgbG9jYXRpb25cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnVXNlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHN0YXRlLCBVc2VyKSB7XHJcblxyXG5cdFx0XHRVc2VyLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG5cdFx0XHRcdFx0JHNjb3BlLmRhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMpIHtcclxuXHJcblx0XHRcdFx0XHQvKmlmIChzdGF0dXMgPT0gNDA0KSAkc3RhdGUuZ28oJzQwNCcpOyovXHJcblx0XHRcdFx0XHRpZiAoISFkYXRhLm1lc3NhZ2UpIGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHRyZXF1aXJlKCcuL2xvZ2luQ29udHJvbGxlcnMnKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcnMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU4gQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignTG9naW5DdHJsJywgWyckc2NvcGUnLCAnQXV0aGVudGljYXRpb24nLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoZW50aWNhdGlvbikge1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Lypjb25zb2xlLmxvZygkc2NvcGUuYWNjZXNzKTsqL1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBsb2dpbiBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogc2VydmljZSBjaGVja1xyXG5cdFx0XHRcdEF1dGhlbnRpY2F0aW9uLmxvZ2luKCRzY29wZS5kYXRhKTtcclxuXHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUubG9naW5Gb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBSRUdJU1RFUiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdSZWdpc3RlckN0cmwnLCBbJyRzY29wZScsICdjb25maWcnLCAnVXNlcicsIGZ1bmN0aW9uICgkc2NvcGUsIGNvbmZpZywgVXNlcikge1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogbmFtZSByb2xlc1xyXG5cdFx0XHQkc2NvcGUucm9sZXMgPSBjb25maWcuUk9MRVM7XHJcblx0XHRcdCRzY29wZS5jb2RlUm9sZSA9IHt9O1xyXG5cdFx0XHQvLyBkZWZpbmUgZm9yIGd1ZXN0XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVSb2xlcyA9IFsxLCA0LCA1LCA2XTtcclxuXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogbG9naW4gc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHNlcnZpY2UgY2hlY2tcclxuXHRcdFx0XHRVc2VyLnJlZ2lzdGVyKCRzY29wZS5kYXRhKTtcclxuXHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUucmVnaXN0ZXJGb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRElSRUNUSVZFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gZGlyZWN0aXZlc1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEZJTFRFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pO1xyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGZpbHRlcnNcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIExPR0lOXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIubG9naW4nLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIubG9naW4nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvbG9naW4nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL2xvZ2luLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdsb2dpbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogUmVnaXN0ZXIgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIucmVnaXN0ZXInLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3JlZ2lzdGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdyZWdpc3RlcicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBST1VURVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdpbmRleCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy8nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9pbmRleC5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnaW5kZXgnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJzQwNCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy80MDQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy80MDQuaHRtbCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdCR1cmxSb3V0ZXJQcm92aWRlclxyXG5cdFx0XHRcdC5vdGhlcndpc2UoJy80MDQnKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUpIHtcclxuXHJcblx0XHRcdCRyb290U2NvcGUuJG9uKFwiJHN0YXRlQ2hhbmdlU3RhcnRcIiwgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcblxyXG5cdFx0XHRcdFxyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogU0VSVklDRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFtdKTtcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgQVVUSEVOVElDQVRJT04gU0VSVklDRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy51c2VyJylcclxuXHRcdC5mYWN0b3J5KCdBdXRoZW50aWNhdGlvbicsIFsnJGh0dHAnLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0xvZ2luKGRhdGEpIHtcclxuXHJcblx0XHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxvZ2luOiBwdWJsaWNMb2dpblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgU0VSVklDRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHRcdC5mYWN0b3J5KCdVc2VyJywgWyckaHR0cCcsIGZ1bmN0aW9uICgkaHR0cCkge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljR2V0QnlJZChpZCkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY1JlZ2lzdGVyKGRhdGEpIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlci9yZWdpc3RlcicsIGRhdGEpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRnZXRCeUlkOiBwdWJsaWNHZXRCeUlkLFxyXG5cdFx0XHRcdHJlZ2lzdGVyOiBwdWJsaWNSZWdpc3RlclxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9hdXRoZW50aWNhdGlvblNlcnZpY2UnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVJcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlcicsIFtcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycy91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcy91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9sb2dpbicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vcmVnaXN0ZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy91c2VyJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy86aWQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
