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
			// instead ngCookies https://github.com/lynndylanhurley/ng-token-auth#why-does-this-module-use-ipcookies-instead-of-ngcookies
			'ng-token-auth',
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
		.config(['$locationProvider', '$authProvider', function ($locationProvider, $authProvider) {

			$locationProvider
				.html5Mode(true);

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
				handleTokenValidationResponse: function (res) {

					return res;
					
				}
			});

		}]);

	// requires
	require('./routes');

})();
},{"./config":3,"./controllers":4,"./directives":8,"./filters":9,"./routes":12,"./services":13,"./user":15}],3:[function(require,module,exports){
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
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', '$auth', 'User', function ($scope, $stateParams, $state, $auth, User) {

			$scope.isMyProfile = false;

			User.getById($stateParams.id)
				.success(function (res) {

					$scope.data = res;
					if ($scope.data._id === $auth.user._id) {
						$scope.isMyProfile = true;
					}

				})
				.error(function (res, status) {

					/*if (status == 404) $state.go('404');*/
					if (!!res.message) console.log(res.message);

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
		.controller('LoginCtrl', ['$scope', '$auth', function ($scope, $auth) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			/*console.log($scope.access);*/

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				$auth.submitLogin($scope.data)
					.then(function (res) {

						// TEMP
						console.log(res);

					});
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
		.controller('RegisterCtrl', ['$scope', '$auth', 'config', function ($scope, $auth, config) {

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
				$auth.submitRegistration($scope.data)
					.then(function (res) {

						// TEMP
						console.log(res);

					});
				/*Authentication.register($scope.data);*/
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
		.module('app.filters', [])
		// TODO: common filters
		.filter('rub', ['$filter', '$locale', function ($filter, $locale) {

			return function (num) {
				return $filter('number')(num, 2) + '<span class="currency"> руб.</span>';
			};

		}]);

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
		.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'config', function ($stateProvider, $urlRouterProvider, $httpProvider, config) {

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


			// redirect to login
			/*$httpProvider.interceptors.push(function ($q, $location) {

		        return {
		            'responseError': function (response) {

		                if (response.status === 401 || response.status === 403) {
		                    $location.path('/user/login');
		                }
		                return $q.reject(response);

		            }
		        };

		    });*/

		}])
		.run(['$rootScope', '$state', '$auth', function ($rootScope, $state, $auth) {

			$auth.validateUser();

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

			return {
				getById: publicGetById
			};

		}]);


	// requires

})();
},{}],15:[function(require,module,exports){
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
},{"./controllers/user":5,"./login":10,"./register":11,"./services/user":14}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVycy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9yZWdpc3RlckNvbnRyb2xsZXJzLmpzIiwic3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL2FwcC9maWx0ZXJzL2luZGV4LmpzIiwic3JjL2FwcC9sb2dpbi5qcyIsInNyYy9hcHAvcmVnaXN0ZXIuanMiLCJzcmMvYXBwL3JvdXRlcy5qcyIsInNyYy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL3VzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9LyoqXHJcbiAqIFJPTEVTOlxyXG4gKiAwIC0gYW5vbnltb3VzXHJcbiAqIDEgLSB1c2VyXHJcbiAqIDIgLSBtb2RlcmF0b3JcclxuICogMyAtIGFkbWluXHJcbiAqIDQgLSBwcml2YXRlIHBlcnNvblxyXG4gKiA1IC0gbWljcm9maW5hbmNlIG9yZ2FuaXphdGlvbiAoTUZJKVxyXG4gKiA2IC0gcGF3bnNob3BcclxuICovXHJcblxyXG57XHJcblx0XCJwdWJsaWNcIjogWzAsIDEsIDIsIDMsIDQsIDUsIDZdLFxyXG5cdFwiYW5vbnltb3VzXCI6IFswXSxcclxuXHRcInVzZXJcIjogWzEsIDIsIDMsIDQsIDUsIDZdLFxyXG5cdFwiYWRtaW5cIjogWzNdXHJcbn0iLCIvKipcclxuICogQVBQTElDQVRJT05cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBBcHAgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFtcclxuXHRcdFx0J3VpLnJvdXRlcicsXHJcblx0XHRcdC8vIGluc3RlYWQgbmdDb29raWVzIGh0dHBzOi8vZ2l0aHViLmNvbS9seW5uZHlsYW5odXJsZXkvbmctdG9rZW4tYXV0aCN3aHktZG9lcy10aGlzLW1vZHVsZS11c2UtaXBjb29raWVzLWluc3RlYWQtb2Ytbmdjb29raWVzXHJcblx0XHRcdCduZy10b2tlbi1hdXRoJyxcclxuXHRcdFx0J25nU2FuaXRpemUnLFxyXG5cdFx0XHQndWkuc2VsZWN0JyxcclxuXHRcdFx0Ly8gdmFsdWVzICYgY29uc3RhbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSxcclxuXHRcdFx0Ly8gY29tcG9uZW50c1xyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9maWx0ZXJzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcycpLm5hbWUsXHJcblx0XHRcdC8vIG1vZHVsZXNcclxuXHRcdFx0cmVxdWlyZSgnLi91c2VyJykubmFtZVxyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckbG9jYXRpb25Qcm92aWRlcicsICckYXV0aFByb3ZpZGVyJywgZnVuY3Rpb24gKCRsb2NhdGlvblByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0XHQkYXV0aFByb3ZpZGVyLmNvbmZpZ3VyZSh7XHJcblx0XHRcdFx0Ly8gbG9jYWxob3N0XHJcblx0XHRcdFx0YXBpVXJsOiAnL2FwaScsXHJcblx0XHRcdFx0dG9rZW5WYWxpZGF0aW9uUGF0aDogJy91c2VyL3ZhbGlkYXRlJyxcclxuICBcdFx0XHRcdHNpZ25PdXRVcmw6ICcvdXNlci9zaWdub3V0JyxcclxuICBcdFx0XHRcdGVtYWlsUmVnaXN0cmF0aW9uUGF0aDogJy91c2VyL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRhY2NvdW50VXBkYXRlUGF0aDogJy91c2VyL3VwZGF0ZScsXHJcblx0XHRcdFx0YWNjb3VudERlbGV0ZVBhdGg6ICcvdXNlci9kZWxldGUnLFxyXG5cdFx0XHRcdHBhc3N3b3JkUmVzZXRQYXRoOiAnL3VzZXIvcGFzc3dvcmQnLFxyXG5cdFx0XHRcdHBhc3N3b3JkVXBkYXRlUGF0aDogJy91c2VyL3Bhc3N3b3JkJyxcclxuXHRcdFx0XHRlbWFpbFNpZ25JblBhdGg6ICcvdXNlci9zaWduaW4nLFxyXG5cclxuXHRcdFx0XHR0b2tlbkZvcm1hdDoge1xyXG5cdFx0XHRcdFx0XCJhY2Nlc3MtdG9rZW5cIjogXCJ7eyB0b2tlbiB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ0b2tlbi10eXBlXCI6IFwiQmVhcmVyXCIsXHJcblx0XHRcdFx0XHRcImV4cGlyeVwiOiBcInt7IGV4cGlyeSB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ7eyB1aWQgfX1cIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlTG9naW5SZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlVG9rZW5WYWxpZGF0aW9uUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9yb3V0ZXMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTkZJR1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbmZpZyBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0TkFNRTogJ0FMTE1PTkVZJyxcclxuXHRcdFx0REVCVUc6IHRydWUsXHJcblx0XHRcdFJPTEVTOiBbXHJcblx0XHRcdFx0J9CQ0L3QvtC90LjQvNGD0YEnLFxyXG5cdFx0XHRcdCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxyXG5cdFx0XHRcdCfQnNC+0LTQtdGA0LDRgtC+0YAnLFxyXG5cdFx0XHRcdCfQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9Cn0LDRgdGC0L3QvtC1INC70LjRhtC+JyxcclxuXHRcdFx0XHQn0JzQpNCeJyxcclxuXHRcdFx0XHQn0JvQvtC80LHQsNGA0LQnXHJcblx0XHRcdF0sXHJcblx0XHRcdEFDQ0VTUzogcmVxdWlyZSgnLi9hY2Nlc3MuanNvbicpLFxyXG5cdFx0XHRDSVRJRVM6IFtcclxuXHRcdFx0XHQn0JLRgdC1INCz0L7RgNC+0LTQsCcsXHJcblx0XHRcdFx0J9Cc0L7RgdC60LLQsCcsXHJcblx0XHRcdFx0J9Ch0LDQvdC60YIt0J/QtdGC0LXRgNCx0YPRgNCzJyxcclxuXHRcdFx0XHQn0J3QvtCy0L7RgdC40LHQuNGA0YHQuicsXHJcblx0XHRcdFx0J9Cd0LjQttC90LjQuS3QndC+0LLQs9C+0YDQvtC0JyxcclxuXHRcdFx0XHQn0JrRgNCw0YHQvdC+0Y/RgNGB0LonLFxyXG5cdFx0XHRcdCfQmtCw0LfQsNC90YwnLFxyXG5cdFx0XHRcdCfQldC60LDRgtC10YDQuNC90LHRg9GA0LMnXHJcblx0XHRcdF1cclxuXHRcdH0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignSW5kZXhDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNvZGVDaXR5ID0ge307XHJcblx0XHRcdC8vIGRlZmluZSBmb3IgZ3Vlc3RcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZUNpdGllcyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcclxuXHJcblx0XHRcdC8vIFRFTVA6IGRlZmluZSBsb2NhdGlvblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRzdGF0ZScsICckYXV0aCcsICdVc2VyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsICRhdXRoLCBVc2VyKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaXNNeVByb2ZpbGUgPSBmYWxzZTtcclxuXHJcblx0XHRcdFVzZXIuZ2V0QnlJZCgkc3RhdGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdCRzY29wZS5kYXRhID0gcmVzO1xyXG5cdFx0XHRcdFx0aWYgKCRzY29wZS5kYXRhLl9pZCA9PT0gJGF1dGgudXNlci5faWQpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLmlzTXlQcm9maWxlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IoZnVuY3Rpb24gKHJlcywgc3RhdHVzKSB7XHJcblxyXG5cdFx0XHRcdFx0LyppZiAoc3RhdHVzID09IDQwNCkgJHN0YXRlLmdvKCc0MDQnKTsqL1xyXG5cdFx0XHRcdFx0aWYgKCEhcmVzLm1lc3NhZ2UpIGNvbnNvbGUubG9nKHJlcy5tZXNzYWdlKTtcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vbG9naW5Db250cm9sbGVycycpO1xyXG5cdHJlcXVpcmUoJy4vcmVnaXN0ZXJDb250cm9sbGVycycpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBMT0dJTiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbJyRzY29wZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc2NvcGUsICRhdXRoKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvKmNvbnNvbGUubG9nKCRzY29wZS5hY2Nlc3MpOyovXHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGxvZ2luIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBzZXJ2aWNlIGNoZWNrXHJcblx0XHRcdFx0JGF1dGguc3VibWl0TG9naW4oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBURU1QXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlcyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5sb2dpbkZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdFxyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogbmFtZSByb2xlc1xyXG5cdFx0XHQkc2NvcGUucm9sZXMgPSBjb25maWcuUk9MRVM7XHJcblx0XHRcdCRzY29wZS5jb2RlUm9sZSA9IHt9O1xyXG5cdFx0XHQvLyBkZWZpbmUgZm9yIGd1ZXN0XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVSb2xlcyA9IFsxLCA0LCA1LCA2XTtcclxuXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogbG9naW4gc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHNlcnZpY2UgY2hlY2tcclxuXHRcdFx0XHQkYXV0aC5zdWJtaXRSZWdpc3RyYXRpb24oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBURU1QXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlcyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0LypBdXRoZW50aWNhdGlvbi5yZWdpc3Rlcigkc2NvcGUuZGF0YSk7Ki9cclxuXHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUucmVnaXN0ZXJGb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRElSRUNUSVZFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gZGlyZWN0aXZlc1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEZJTFRFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZmlsdGVyc1xyXG5cdFx0LmZpbHRlcigncnViJywgWyckZmlsdGVyJywgJyRsb2NhbGUnLCBmdW5jdGlvbiAoJGZpbHRlciwgJGxvY2FsZSkge1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChudW0pIHtcclxuXHRcdFx0XHRyZXR1cm4gJGZpbHRlcignbnVtYmVyJykobnVtLCAyKSArICc8c3BhbiBjbGFzcz1cImN1cnJlbmN5XCI+INGA0YPQsS48L3NwYW4+JztcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIExPR0lOXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIubG9naW4nLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIubG9naW4nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvbG9naW4nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL2xvZ2luLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdsb2dpbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogUmVnaXN0ZXIgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIucmVnaXN0ZXInLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3JlZ2lzdGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdyZWdpc3RlcicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBST1VURVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRodHRwUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2luZGV4Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLycsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2luZGV4Lmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdpbmRleCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgnNDA0Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzQwNCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzLzQwNC5odG1sJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHVybFJvdXRlclByb3ZpZGVyXHJcblx0XHRcdFx0Lm90aGVyd2lzZSgnLzQwNCcpO1xyXG5cclxuXHJcblx0XHRcdC8vIHJlZGlyZWN0IHRvIGxvZ2luXHJcblx0XHRcdC8qJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChmdW5jdGlvbiAoJHEsICRsb2NhdGlvbikge1xyXG5cclxuXHRcdCAgICAgICAgcmV0dXJuIHtcclxuXHRcdCAgICAgICAgICAgICdyZXNwb25zZUVycm9yJzogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblxyXG5cdFx0ICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSB8fCByZXNwb25zZS5zdGF0dXMgPT09IDQwMykge1xyXG5cdFx0ICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXIvbG9naW4nKTtcclxuXHRcdCAgICAgICAgICAgICAgICB9XHJcblx0XHQgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XHJcblxyXG5cdFx0ICAgICAgICAgICAgfVxyXG5cdFx0ICAgICAgICB9O1xyXG5cclxuXHRcdCAgICB9KTsqL1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LnJ1bihbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgJGF1dGgpIHtcclxuXHJcblx0XHRcdCRhdXRoLnZhbGlkYXRlVXNlcigpO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMudXNlcicsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQuZmFjdG9yeSgnVXNlcicsIFsnJGh0dHAnLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0dldEJ5SWQoaWQpIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VyLycgKyBpZCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGdldEJ5SWQ6IHB1YmxpY0dldEJ5SWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ2luIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyJywgW1xyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2xvZ2luJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9yZWdpc3RlcicpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3VzZXInLFxyXG5cdFx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzx1aS12aWV3PicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci52aWV3Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzppZCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvdmlldy5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd1c2VyJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0aWQ6IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7Il19
