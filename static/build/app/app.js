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
			// dom
			'ngSanitize',
			'ngProgress',
			'ui.bootstrap',
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
			DEFAULT_ROLE: 0,
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
			],
			ERRORS: {
				3: 'Код подтверждения не найден, был активирован ранее или истек срок действия кода активации.'
			},
			LOADER_HEIGHT: '3px',
			LOADER_COLOR: '#0059ba'
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
		.controller('IndexCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			$scope.cities = config.CITIES;
			$scope.codeCity = {};
			// define for guest
			$scope.availableCities = [0, 1, 2, 3, 4, 5, 6, 7];

			// TEMP: define location
			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

		}])
		.controller('UserPanelCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			$scope.handleSignOutBtnClick = function () {

				$auth.signOut()
					.then(function (res) {
						
						// ...

					});

			};

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
				.then(function (res) {

					// success
					$scope.data = res;
					if ($scope.data._id === $auth.user._id) {
						$scope.isMyProfile = true;
					}

				}, function (res) {

					// error

				});

		}])
		.controller('EmailConfirmationCtrl', ['$scope', '$stateParams', 'User', 'config', function ($scope, $stateParams, User, config) {

			User.confirmationEmail($stateParams.token)
				.then(function (res) {

					// success
					$scope.confirmed = true;

				}, function (res) {

					// error
					$scope.confirmed = false;
					$scope.error = config.ERRORS[res.code];

				});

		}]);

	// requires
	require('./loginController');
	require('./registerController');

})();
},{"./loginController":6,"./registerController":7}],6:[function(require,module,exports){
/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', '$auth', function ($scope, $auth) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				$auth.submitLogin($scope.data)
					.then(function (res) {

						// success

					}, function (res) {

						// errror

					});

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

						// ...

					});

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
		.module('app.directives', [])
		.directive('userPanel', ['$state', 'config', function ($state, config) {

			return {
				restrict: 'A',
				templateUrl: 'partials/user-panel.html',
				controller: 'UserPanelCtrl',
				controllerAs: 'userpanel'
			};

		}]);
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
				})
				.state('user.confirm', {
					url: '/register/:token',
					templateUrl: 'partials/user/confirm.html',
					controller: 'EmailConfirmationCtrl',
					controllerAs: 'confirm',
					params:  {
						token: {
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

			// interceptors
			$httpProvider.interceptors.push('ResponseInterceptor');
			$httpProvider.interceptors.push('ProgressInterceptor');

		}])
		.run(['$rootScope', '$state', '$auth', 'User', 'config', function ($rootScope, $state, $auth, User, config) {

			// TODO: validate user
			$auth.validateUser();

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

				// TODO: validate user
				$auth.validateUser()
					.then(function (res) {

						if (!('data' in toState) || !('access' in toState.data)) {
							// undefined data access
							event.preventDefault();
						} else if (!User.checkAccess(toState.data.access, $auth.user.role)) {
							// failed access
							event.preventDefault();
							
							if (fromState.url === '^') {
								if ($auth.user.signedIn) {
									$state.go('index');
								} else {
									$state.go('user.login');
								}
							}
						}

					});;

			});

			$rootScope.$on('auth:login-success', function (event, reason) {

				$state.go('index');

			});

		}]);

})();
},{}],13:[function(require,module,exports){
/**
 * SERVICES
 */

(function () {

	module.exports = angular
		.module('app.services', [])
		// TODO: common services
		// ...
		// TODO: common interceptors
		.factory('ResponseInterceptor', ['$q', '$location', 'config', function ($q, $location, config) {

			function publicResponseError(res) {

				if (res.status === 401 || res.status === 403) {
                    $location.path('/user/login');
                }
                if (res.status === 404) {
                    $location.path('/404');
                }
                return $q.reject(res);

			}

			return {
				responseError: publicResponseError
			};

		}])
		.factory('ProgressInterceptor', ['$q', '$injector', 'config', function ($q, $injector, config) {

			var ngProgress = null;

			function privateGetNgProgress() {

				// TODO: init preloader
				ngProgress = ngProgress || $injector.get('ngProgressFactory').createInstance();
				ngProgress.setHeight(config.LOADER_HEIGHT);
				ngProgress.setColor(config.LOADER_COLOR);
				return ngProgress;

			};

			function privateCompleteProgress() {

				var ngProgress = privateGetNgProgress();
				// TODO: preloader complete
				ngProgress.complete();

			};

			return {
				request: function (res) {

					var ngProgress = privateGetNgProgress();
					// TODO: preloader start
					ngProgress.reset();
					ngProgress.start();
					return res;

				},
				requestError: function (res) {

					privateCompleteProgress();
					return $q.reject(res);

				},
				response: function (res) {

					privateCompleteProgress();
					return res;

				},
				responseError: function (res) {

					privateCompleteProgress();
					return $q.reject(res);

				}
			} 

		}]);

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
		.factory('User', ['$http', 'config', function ($http, config) {

			function publicGetById(id) {

				return $http.get('/api/user/' + id);

			}

			function publicCheckAccess(access, role) {

				if (role === undefined) {
					role = config.DEFAULT_ROLE;
				}

				return _.indexOf(access, role) === -1 ? false : true;

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVyLmpzIiwic3JjL2FwcC9jb250cm9sbGVycy91c2VyL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9hcHAvZmlsdGVycy9pbmRleC5qcyIsInNyYy9hcHAvbG9naW4uanMiLCJzcmMvYXBwL3JlZ2lzdGVyLmpzIiwic3JjL2FwcC9yb3V0ZXMuanMiLCJzcmMvYXBwL3NlcnZpY2VzL2luZGV4LmpzIiwic3JjL2FwcC9zZXJ2aWNlcy91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz0vKipcclxuICogUk9MRVM6XHJcbiAqIDAgLSBhbm9ueW1vdXNcclxuICogMSAtIHVzZXJcclxuICogMiAtIG1vZGVyYXRvclxyXG4gKiAzIC0gYWRtaW5cclxuICogNCAtIHByaXZhdGUgcGVyc29uXHJcbiAqIDUgLSBtaWNyb2ZpbmFuY2Ugb3JnYW5pemF0aW9uIChNRkkpXHJcbiAqIDYgLSBwYXduc2hvcFxyXG4gKi9cclxuXHJcbntcclxuXHRcInB1YmxpY1wiOiBbMCwgMSwgMiwgMywgNCwgNSwgNl0sXHJcblx0XCJhbm9ueW1vdXNcIjogWzBdLFxyXG5cdFwidXNlclwiOiBbMSwgMiwgMywgNCwgNSwgNl0sXHJcblx0XCJhZG1pblwiOiBbM11cclxufSIsIi8qKlxyXG4gKiBBUFBMSUNBVElPTlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFwcCBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJywgW1xyXG5cdFx0XHQndWkucm91dGVyJyxcclxuXHRcdFx0Ly8gaW5zdGVhZCBuZ0Nvb2tpZXMgaHR0cHM6Ly9naXRodWIuY29tL2x5bm5keWxhbmh1cmxleS9uZy10b2tlbi1hdXRoI3doeS1kb2VzLXRoaXMtbW9kdWxlLXVzZS1pcGNvb2tpZXMtaW5zdGVhZC1vZi1uZ2Nvb2tpZXNcclxuXHRcdFx0J25nLXRva2VuLWF1dGgnLFxyXG5cdFx0XHQvLyBkb21cclxuXHRcdFx0J25nU2FuaXRpemUnLFxyXG5cdFx0XHQnbmdQcm9ncmVzcycsXHJcblx0XHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0XHQndWkuc2VsZWN0JyxcclxuXHRcdFx0Ly8gdmFsdWVzICYgY29uc3RhbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSxcclxuXHRcdFx0Ly8gY29tcG9uZW50c1xyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9maWx0ZXJzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcycpLm5hbWUsXHJcblx0XHRcdC8vIG1vZHVsZXNcclxuXHRcdFx0cmVxdWlyZSgnLi91c2VyJykubmFtZVxyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckbG9jYXRpb25Qcm92aWRlcicsICckYXV0aFByb3ZpZGVyJywgZnVuY3Rpb24gKCRsb2NhdGlvblByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0XHQkYXV0aFByb3ZpZGVyLmNvbmZpZ3VyZSh7XHJcblx0XHRcdFx0Ly8gbG9jYWxob3N0XHJcblx0XHRcdFx0YXBpVXJsOiAnL2FwaScsXHJcblx0XHRcdFx0dG9rZW5WYWxpZGF0aW9uUGF0aDogJy91c2VyL3ZhbGlkYXRlJyxcclxuICBcdFx0XHRcdHNpZ25PdXRVcmw6ICcvdXNlci9zaWdub3V0JyxcclxuICBcdFx0XHRcdGVtYWlsUmVnaXN0cmF0aW9uUGF0aDogJy91c2VyL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRhY2NvdW50VXBkYXRlUGF0aDogJy91c2VyL3VwZGF0ZScsXHJcblx0XHRcdFx0YWNjb3VudERlbGV0ZVBhdGg6ICcvdXNlci9kZWxldGUnLFxyXG5cdFx0XHRcdHBhc3N3b3JkUmVzZXRQYXRoOiAnL3VzZXIvcGFzc3dvcmQnLFxyXG5cdFx0XHRcdHBhc3N3b3JkVXBkYXRlUGF0aDogJy91c2VyL3Bhc3N3b3JkJyxcclxuXHRcdFx0XHRlbWFpbFNpZ25JblBhdGg6ICcvdXNlci9zaWduaW4nLFxyXG5cclxuXHRcdFx0XHR0b2tlbkZvcm1hdDoge1xyXG5cdFx0XHRcdFx0XCJhY2Nlc3MtdG9rZW5cIjogXCJ7eyB0b2tlbiB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ0b2tlbi10eXBlXCI6IFwiQmVhcmVyXCIsXHJcblx0XHRcdFx0XHRcImV4cGlyeVwiOiBcInt7IGV4cGlyeSB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ7eyB1aWQgfX1cIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlTG9naW5SZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlVG9rZW5WYWxpZGF0aW9uUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9yb3V0ZXMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTkZJR1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbmZpZyBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0TkFNRTogJ0FMTE1PTkVZJyxcclxuXHRcdFx0REVCVUc6IHRydWUsXHJcblx0XHRcdFJPTEVTOiBbXHJcblx0XHRcdFx0J9CQ0L3QvtC90LjQvNGD0YEnLFxyXG5cdFx0XHRcdCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxyXG5cdFx0XHRcdCfQnNC+0LTQtdGA0LDRgtC+0YAnLFxyXG5cdFx0XHRcdCfQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9Cn0LDRgdGC0L3QvtC1INC70LjRhtC+JyxcclxuXHRcdFx0XHQn0JzQpNCeJyxcclxuXHRcdFx0XHQn0JvQvtC80LHQsNGA0LQnXHJcblx0XHRcdF0sXHJcblx0XHRcdERFRkFVTFRfUk9MRTogMCxcclxuXHRcdFx0QUNDRVNTOiByZXF1aXJlKCcuL2FjY2Vzcy5qc29uJyksXHJcblx0XHRcdENJVElFUzogW1xyXG5cdFx0XHRcdCfQktGB0LUg0LPQvtGA0L7QtNCwJyxcclxuXHRcdFx0XHQn0JzQvtGB0LrQstCwJyxcclxuXHRcdFx0XHQn0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMnLFxyXG5cdFx0XHRcdCfQndC+0LLQvtGB0LjQsdC40YDRgdC6JyxcclxuXHRcdFx0XHQn0J3QuNC20L3QuNC5LdCd0L7QstCz0L7RgNC+0LQnLFxyXG5cdFx0XHRcdCfQmtGA0LDRgdC90L7Rj9GA0YHQuicsXHJcblx0XHRcdFx0J9Ca0LDQt9Cw0L3RjCcsXHJcblx0XHRcdFx0J9CV0LrQsNGC0LXRgNC40L3QsdGD0YDQsydcclxuXHRcdFx0XSxcclxuXHRcdFx0RVJST1JTOiB7XHJcblx0XHRcdFx0MzogJ9Ca0L7QtCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyDQvdC1INC90LDQudC00LXQvSwg0LHRi9C7INCw0LrRgtC40LLQuNGA0L7QstCw0L0g0YDQsNC90LXQtSDQuNC70Lgg0LjRgdGC0LXQuiDRgdGA0L7QuiDQtNC10LnRgdGC0LLQuNGPINC60L7QtNCwINCw0LrRgtC40LLQsNGG0LjQuC4nXHJcblx0XHRcdH0sXHJcblx0XHRcdExPQURFUl9IRUlHSFQ6ICczcHgnLFxyXG5cdFx0XHRMT0FERVJfQ09MT1I6ICcjMDA1OWJhJ1xyXG5cdFx0fSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkYXV0aCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNvZGVDaXR5ID0ge307XHJcblx0XHRcdC8vIGRlZmluZSBmb3IgZ3Vlc3RcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZUNpdGllcyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcclxuXHJcblx0XHRcdC8vIFRFTVA6IGRlZmluZSBsb2NhdGlvblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignVXNlclBhbmVsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5oYW5kbGVTaWduT3V0QnRuQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRhdXRoLnNpZ25PdXQoKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHN0YXRlLCAkYXV0aCwgVXNlcikge1xyXG5cclxuXHRcdFx0JHNjb3BlLmlzTXlQcm9maWxlID0gZmFsc2U7XHJcblxyXG5cdFx0XHRVc2VyLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IHJlcztcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUuZGF0YS5faWQgPT09ICRhdXRoLnVzZXIuX2lkKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc015UHJvZmlsZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdFbWFpbENvbmZpcm1hdGlvbkN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0VXNlci5jb25maXJtYXRpb25FbWFpbCgkc3RhdGVQYXJhbXMudG9rZW4pXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuXHRcdFx0XHRcdCRzY29wZS5jb25maXJtZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZXJyb3JcclxuXHRcdFx0XHRcdCRzY29wZS5jb25maXJtZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdCRzY29wZS5lcnJvciA9IGNvbmZpZy5FUlJPUlNbcmVzLmNvZGVdO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9sb2dpbkNvbnRyb2xsZXInKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBMT0dJTiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbJyRzY29wZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc2NvcGUsICRhdXRoKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGxvZ2luIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBzZXJ2aWNlIGNoZWNrXHJcblx0XHRcdFx0JGF1dGguc3VibWl0TG9naW4oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gZXJycm9yXHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5sb2dpbkZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdFxyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgWyckc2NvcGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogbmFtZSByb2xlc1xyXG5cdFx0XHQkc2NvcGUucm9sZXMgPSBjb25maWcuUk9MRVM7XHJcblx0XHRcdCRzY29wZS5jb2RlUm9sZSA9IHt9O1xyXG5cdFx0XHQvLyBkZWZpbmUgZm9yIGd1ZXN0XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVSb2xlcyA9IFsxLCA0LCA1LCA2XTtcclxuXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogbG9naW4gc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHNlcnZpY2UgY2hlY2tcclxuXHRcdFx0XHQkYXV0aC5zdWJtaXRSZWdpc3RyYXRpb24oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUucmVnaXN0ZXJGb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRElSRUNUSVZFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSlcclxuXHRcdC5kaXJlY3RpdmUoJ3VzZXJQYW5lbCcsIFsnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci1wYW5lbC5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnVXNlclBhbmVsQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcnBhbmVsJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBkaXJlY3RpdmVzXHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRklMVEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBmaWx0ZXJzXHJcblx0XHQuZmlsdGVyKCdydWInLCBbJyRmaWx0ZXInLCAnJGxvY2FsZScsIGZ1bmN0aW9uICgkZmlsdGVyLCAkbG9jYWxlKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKG51bSkge1xyXG5cdFx0XHRcdHJldHVybiAkZmlsdGVyKCdudW1iZXInKShudW0sIDIpICsgJzxzcGFuIGNsYXNzPVwiY3VycmVuY3lcIj4g0YDRg9CxLjwvc3Bhbj4nO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU5cclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5sb2dpbicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5sb2dpbicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9sb2dpbicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvbG9naW4uaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2xvZ2luJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLmFub255bW91c1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVJcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBSZWdpc3RlciBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5yZWdpc3RlcicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5yZWdpc3RlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9yZWdpc3RlcicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvcmVnaXN0ZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLmFub255bW91c1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmNvbmZpcm0nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXIvOnRva2VuJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9jb25maXJtLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0VtYWlsQ29uZmlybWF0aW9uQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdjb25maXJtJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0dG9rZW46IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFJPVVRFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGh0dHBQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgnaW5kZXgnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaW5kZXguaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2luZGV4JyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCc0MDQnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvNDA0JyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvNDA0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkdXJsUm91dGVyUHJvdmlkZXJcclxuXHRcdFx0XHQub3RoZXJ3aXNlKCcvNDA0Jyk7XHJcblxyXG5cdFx0XHQvLyBpbnRlcmNlcHRvcnNcclxuXHRcdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xyXG5cdFx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdQcm9ncmVzc0ludGVyY2VwdG9yJyk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgVXNlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiB2YWxpZGF0ZSB1c2VyXHJcblx0XHRcdCRhdXRoLnZhbGlkYXRlVXNlcigpO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHZhbGlkYXRlIHVzZXJcclxuXHRcdFx0XHQkYXV0aC52YWxpZGF0ZVVzZXIoKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCEoJ2RhdGEnIGluIHRvU3RhdGUpIHx8ICEoJ2FjY2VzcycgaW4gdG9TdGF0ZS5kYXRhKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHVuZGVmaW5lZCBkYXRhIGFjY2Vzc1xyXG5cdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIVVzZXIuY2hlY2tBY2Nlc3ModG9TdGF0ZS5kYXRhLmFjY2VzcywgJGF1dGgudXNlci5yb2xlKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIGZhaWxlZCBhY2Nlc3NcclxuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGlmIChmcm9tU3RhdGUudXJsID09PSAnXicpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICgkYXV0aC51c2VyLnNpZ25lZEluKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnaW5kZXgnKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygndXNlci5sb2dpbicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH0pOztcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS4kb24oJ2F1dGg6bG9naW4tc3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgcmVhc29uKSB7XHJcblxyXG5cdFx0XHRcdCRzdGF0ZS5nbygnaW5kZXgnKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0Ly8gLi4uXHJcblx0XHQvLyBUT0RPOiBjb21tb24gaW50ZXJjZXB0b3JzXHJcblx0XHQuZmFjdG9yeSgnUmVzcG9uc2VJbnRlcmNlcHRvcicsIFsnJHEnLCAnJGxvY2F0aW9uJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcSwgJGxvY2F0aW9uLCBjb25maWcpIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY1Jlc3BvbnNlRXJyb3IocmVzKSB7XHJcblxyXG5cdFx0XHRcdGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyL2xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy80MDQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzcG9uc2VFcnJvcjogcHVibGljUmVzcG9uc2VFcnJvclxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmZhY3RvcnkoJ1Byb2dyZXNzSW50ZXJjZXB0b3InLCBbJyRxJywgJyRpbmplY3RvcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHEsICRpbmplY3RvciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHR2YXIgbmdQcm9ncmVzcyA9IG51bGw7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwcml2YXRlR2V0TmdQcm9ncmVzcygpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogaW5pdCBwcmVsb2FkZXJcclxuXHRcdFx0XHRuZ1Byb2dyZXNzID0gbmdQcm9ncmVzcyB8fCAkaW5qZWN0b3IuZ2V0KCduZ1Byb2dyZXNzRmFjdG9yeScpLmNyZWF0ZUluc3RhbmNlKCk7XHJcblx0XHRcdFx0bmdQcm9ncmVzcy5zZXRIZWlnaHQoY29uZmlnLkxPQURFUl9IRUlHSFQpO1xyXG5cdFx0XHRcdG5nUHJvZ3Jlc3Muc2V0Q29sb3IoY29uZmlnLkxPQURFUl9DT0xPUik7XHJcblx0XHRcdFx0cmV0dXJuIG5nUHJvZ3Jlc3M7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKSB7XHJcblxyXG5cdFx0XHRcdHZhciBuZ1Byb2dyZXNzID0gcHJpdmF0ZUdldE5nUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHQvLyBUT0RPOiBwcmVsb2FkZXIgY29tcGxldGVcclxuXHRcdFx0XHRuZ1Byb2dyZXNzLmNvbXBsZXRlKCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXF1ZXN0OiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG5nUHJvZ3Jlc3MgPSBwcml2YXRlR2V0TmdQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogcHJlbG9hZGVyIHN0YXJ0XHJcblx0XHRcdFx0XHRuZ1Byb2dyZXNzLnJlc2V0KCk7XHJcblx0XHRcdFx0XHRuZ1Byb2dyZXNzLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlcXVlc3RFcnJvcjogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gJHEucmVqZWN0KHJlcyk7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRyZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IFxyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgU0VSVklDRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHRcdC5mYWN0b3J5KCdVc2VyJywgWyckaHR0cCcsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljR2V0QnlJZChpZCkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NoZWNrQWNjZXNzKGFjY2Vzcywgcm9sZSkge1xyXG5cclxuXHRcdFx0XHRpZiAocm9sZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRyb2xlID0gY29uZmlnLkRFRkFVTFRfUk9MRTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBfLmluZGV4T2YoYWNjZXNzLCByb2xlKSA9PT0gLTEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNDb25maXJtYXRpb25FbWFpbCh0b2tlbikge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvcmVnaXN0ZXIvJyArIHRva2VuKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Z2V0QnlJZDogcHVibGljR2V0QnlJZCxcclxuXHRcdFx0XHRjaGVja0FjY2VzczogcHVibGljQ2hlY2tBY2Nlc3MsXHJcblx0XHRcdFx0Y29uZmlybWF0aW9uRW1haWw6IHB1YmxpY0NvbmZpcm1hdGlvbkVtYWlsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVJcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlcicsIFtcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycy91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcy91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9sb2dpbicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vcmVnaXN0ZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy91c2VyJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy86aWQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcicsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdGlkOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
