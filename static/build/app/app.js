(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports=/**
 * ROLES:
 * 0 - anonymous
 * 1 - user
 * 2 - moderator
 * 3 - admin
 * 4 - private person (pp)
 * 5 - microfinance organization (mfi)
 * 6 - pawnshop (ps)
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
				0: 'Неизвестная ошибка.',
				1: 'Ошибка аутентификации.',
				2: 'Неверный токен аутентификации.',
				3: 'Код подтверждения не найден, был активирован ранее или истек срок действия кода активации.',
				4: 'Введен неверный email или пароль.',
				5: 'Ошибка создания учетной записи. Пожалуйста проверьте введенные данные.',
				6: 'Пользователь не найден.'
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

		}])
		.controller('AlertsSectionCtrl', ['$scope', '$timeout', 'config', function ($scope, $timeout, config) {

			$scope.alerts = [];

			// close alert
			$scope.closeAlert = function (index) {

				$scope.alerts.splice(index, 1);

			};

			// TODO: checking new allert
			$scope.$on('new-alert', function(event, data) {

				var alert = $scope.alerts.push({
					type: data.type,
					closeable: true,
					message: config.ERRORS[data.code]
				});

				$timeout(function () {

					$scope.alerts.splice($scope.alerts.indexOf(alert), 1);

				}, 8000);

			});

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
					$scope.data = res.data;
					if ($scope.data.id === $auth.user.id) {
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
					$scope.error = config.ERRORS[res.data.code];

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
		.controller('RegisterCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

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

						$state.go('index');

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
		// TODO: common directives
		.directive('userPanel', ['$state', 'config', function ($state, config) {

			return {
				restrict: 'A',
				templateUrl: 'partials/user-panel.html',
				controller: 'UserPanelCtrl',
				controllerAs: 'userpanel'
			};

		}])
		.directive('alertsSection', ['$state', 'config', function ($state, config) {

			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'partials/alerts-section.html',
				controller: 'AlertsSectionCtrl',
				controllerAs: 'alertssection'
			};

		}])
		.directive('equals', function () {

			return {
				restrict: 'A',
				require: '?ngModel',
				link: function (scope, elem, attrs, ngModel) {

					if (!ngModel) return;

					scope.$watch(attrs.ngModel, function () {

						validate();

					});

					attrs.$observe('equals', function (val) {

						validate();

					});

					var validate = function () {

						// values
						var valueFirst = ngModel.$viewValue;
						var valueSecond = attrs.equals;

						// set validity
						ngModel.$setValidity('equals', !valueFirst || !valueSecond || valueFirst === valueSecond);

					};

				}
			}

		});

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
		.factory('ResponseInterceptor', ['$q', '$location', '$rootScope', 'config', function ($q, $location, $rootScope, config) {

			function publicResponseError(res) {

				// error alert
				$rootScope.$broadcast('new-alert', _.assign(res.data, {
					type: 'danger'
				}));

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVyLmpzIiwic3JjL2FwcC9jb250cm9sbGVycy91c2VyL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9hcHAvZmlsdGVycy9pbmRleC5qcyIsInNyYy9hcHAvbG9naW4uanMiLCJzcmMvYXBwL3JlZ2lzdGVyLmpzIiwic3JjL2FwcC9yb3V0ZXMuanMiLCJzcmMvYXBwL3NlcnZpY2VzL2luZGV4LmpzIiwic3JjL2FwcC9zZXJ2aWNlcy91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9LyoqXHJcbiAqIFJPTEVTOlxyXG4gKiAwIC0gYW5vbnltb3VzXHJcbiAqIDEgLSB1c2VyXHJcbiAqIDIgLSBtb2RlcmF0b3JcclxuICogMyAtIGFkbWluXHJcbiAqIDQgLSBwcml2YXRlIHBlcnNvbiAocHApXHJcbiAqIDUgLSBtaWNyb2ZpbmFuY2Ugb3JnYW5pemF0aW9uIChtZmkpXHJcbiAqIDYgLSBwYXduc2hvcCAocHMpXHJcbiAqL1xyXG5cclxue1xyXG5cdFwicHVibGljXCI6IFswLCAxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFub255bW91c1wiOiBbMF0sXHJcblx0XCJ1c2VyXCI6IFsxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFkbWluXCI6IFszXVxyXG59IiwiLyoqXHJcbiAqIEFQUExJQ0FUSU9OXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQXBwIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnLCBbXHJcblx0XHRcdCd1aS5yb3V0ZXInLFxyXG5cdFx0XHQvLyBpbnN0ZWFkIG5nQ29va2llcyBodHRwczovL2dpdGh1Yi5jb20vbHlubmR5bGFuaHVybGV5L25nLXRva2VuLWF1dGgjd2h5LWRvZXMtdGhpcy1tb2R1bGUtdXNlLWlwY29va2llcy1pbnN0ZWFkLW9mLW5nY29va2llc1xyXG5cdFx0XHQnbmctdG9rZW4tYXV0aCcsXHJcblx0XHRcdC8vIGRvbVxyXG5cdFx0XHQnbmdTYW5pdGl6ZScsXHJcblx0XHRcdCduZ1Byb2dyZXNzJyxcclxuXHRcdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHRcdCd1aS5zZWxlY3QnLFxyXG5cdFx0XHQvLyB2YWx1ZXMgJiBjb25zdGFudHNcclxuXHRcdFx0cmVxdWlyZSgnLi9jb25maWcnKS5uYW1lLFxyXG5cdFx0XHQvLyBjb21wb25lbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzJykubmFtZSxcclxuXHRcdFx0Ly8gbW9kdWxlc1xyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRhdXRoUHJvdmlkZXInLCAnJHByb3ZpZGUnLCBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIsICRwcm92aWRlKSB7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBhdXRoIGNvbmZpZ1xyXG5cdFx0XHQkYXV0aFByb3ZpZGVyLmNvbmZpZ3VyZSh7XHJcblx0XHRcdFx0Ly8gbG9jYWxob3N0XHJcblx0XHRcdFx0YXBpVXJsOiAnL2FwaScsXHJcblx0XHRcdFx0dG9rZW5WYWxpZGF0aW9uUGF0aDogJy91c2VyL3ZhbGlkYXRlJyxcclxuICBcdFx0XHRcdHNpZ25PdXRVcmw6ICcvdXNlci9zaWdub3V0JyxcclxuICBcdFx0XHRcdGVtYWlsUmVnaXN0cmF0aW9uUGF0aDogJy91c2VyL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRhY2NvdW50VXBkYXRlUGF0aDogJy91c2VyL3VwZGF0ZScsXHJcblx0XHRcdFx0YWNjb3VudERlbGV0ZVBhdGg6ICcvdXNlci9kZWxldGUnLFxyXG5cdFx0XHRcdHBhc3N3b3JkUmVzZXRQYXRoOiAnL3VzZXIvcGFzc3dvcmQnLFxyXG5cdFx0XHRcdHBhc3N3b3JkVXBkYXRlUGF0aDogJy91c2VyL3Bhc3N3b3JkJyxcclxuXHRcdFx0XHRlbWFpbFNpZ25JblBhdGg6ICcvdXNlci9zaWduaW4nLFxyXG5cclxuXHRcdFx0XHR0b2tlbkZvcm1hdDoge1xyXG5cdFx0XHRcdFx0XCJhY2Nlc3MtdG9rZW5cIjogXCJ7eyB0b2tlbiB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ0b2tlbi10eXBlXCI6IFwiQmVhcmVyXCIsXHJcblx0XHRcdFx0XHRcImV4cGlyeVwiOiBcInt7IGV4cGlyeSB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ7eyB1aWQgfX1cIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlTG9naW5SZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlVG9rZW5WYWxpZGF0aW9uUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIEhBQ0s6IHJlZGVmaW5lIHVpLWJvb3RzdHJhcCB0ZW1wbGF0ZXNcclxuXHRcdFx0JHByb3ZpZGUuZGVjb3JhdG9yKCdhbGVydERpcmVjdGl2ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcclxuXHJcblx0XHRcdFx0JGRlbGVnYXRlWzBdLnRlbXBsYXRlVXJsID0gJ3BhcnRpYWxzL2FsZXJ0Lmh0bWwnO1xyXG5cdFx0XHRcdHJldHVybiAkZGVsZWdhdGU7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9yb3V0ZXMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTkZJR1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbmZpZyBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0TkFNRTogJ0FMTE1PTkVZJyxcclxuXHRcdFx0REVCVUc6IHRydWUsXHJcblx0XHRcdFJPTEVTOiBbXHJcblx0XHRcdFx0J9CQ0L3QvtC90LjQvNGD0YEnLFxyXG5cdFx0XHRcdCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxyXG5cdFx0XHRcdCfQnNC+0LTQtdGA0LDRgtC+0YAnLFxyXG5cdFx0XHRcdCfQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9Cn0LDRgdGC0L3QvtC1INC70LjRhtC+JyxcclxuXHRcdFx0XHQn0JzQpNCeJyxcclxuXHRcdFx0XHQn0JvQvtC80LHQsNGA0LQnXHJcblx0XHRcdF0sXHJcblx0XHRcdERFRkFVTFRfUk9MRTogMCxcclxuXHRcdFx0QUNDRVNTOiByZXF1aXJlKCcuL2FjY2Vzcy5qc29uJyksXHJcblx0XHRcdENJVElFUzogW1xyXG5cdFx0XHRcdCfQktGB0LUg0LPQvtGA0L7QtNCwJyxcclxuXHRcdFx0XHQn0JzQvtGB0LrQstCwJyxcclxuXHRcdFx0XHQn0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMnLFxyXG5cdFx0XHRcdCfQndC+0LLQvtGB0LjQsdC40YDRgdC6JyxcclxuXHRcdFx0XHQn0J3QuNC20L3QuNC5LdCd0L7QstCz0L7RgNC+0LQnLFxyXG5cdFx0XHRcdCfQmtGA0LDRgdC90L7Rj9GA0YHQuicsXHJcblx0XHRcdFx0J9Ca0LDQt9Cw0L3RjCcsXHJcblx0XHRcdFx0J9CV0LrQsNGC0LXRgNC40L3QsdGD0YDQsydcclxuXHRcdFx0XSxcclxuXHRcdFx0RVJST1JTOiB7XHJcblx0XHRcdFx0MDogJ9Cd0LXQuNC30LLQtdGB0YLQvdCw0Y8g0L7RiNC40LHQutCwLicsXHJcblx0XHRcdFx0MTogJ9Ce0YjQuNCx0LrQsCDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LicsXHJcblx0XHRcdFx0MjogJ9Cd0LXQstC10YDQvdGL0Lkg0YLQvtC60LXQvSDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LicsXHJcblx0XHRcdFx0MzogJ9Ca0L7QtCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyDQvdC1INC90LDQudC00LXQvSwg0LHRi9C7INCw0LrRgtC40LLQuNGA0L7QstCw0L0g0YDQsNC90LXQtSDQuNC70Lgg0LjRgdGC0LXQuiDRgdGA0L7QuiDQtNC10LnRgdGC0LLQuNGPINC60L7QtNCwINCw0LrRgtC40LLQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDQ6ICfQktCy0LXQtNC10L0g0L3QtdCy0LXRgNC90YvQuSBlbWFpbCDQuNC70Lgg0L/QsNGA0L7Qu9GMLicsXHJcblx0XHRcdFx0NTogJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINGD0YfQtdGC0L3QvtC5INC30LDQv9C40YHQuC4g0J/QvtC20LDQu9GD0LnRgdGC0LAg0L/RgNC+0LLQtdGA0YzRgtC1INCy0LLQtdC00LXQvdC90YvQtSDQtNCw0L3QvdGL0LUuJyxcclxuXHRcdFx0XHQ2OiAn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC90LUg0L3QsNC50LTQtdC9LidcclxuXHRcdFx0fSxcclxuXHRcdFx0TE9BREVSX0hFSUdIVDogJzNweCcsXHJcblx0XHRcdExPQURFUl9DT0xPUjogJyMwMDU5YmEnXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5jaXRpZXMgPSBjb25maWcuQ0lUSUVTO1xyXG5cdFx0XHQkc2NvcGUuY29kZUNpdHkgPSB7fTtcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlQ2l0aWVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cclxuXHRcdFx0Ly8gVEVNUDogZGVmaW5lIGxvY2F0aW9uXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyUGFuZWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLmhhbmRsZVNpZ25PdXRCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JGF1dGguc2lnbk91dCgpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignQWxlcnRzU2VjdGlvbkN0cmwnLCBbJyRzY29wZScsICckdGltZW91dCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuYWxlcnRzID0gW107XHJcblxyXG5cdFx0XHQvLyBjbG9zZSBhbGVydFxyXG5cdFx0XHQkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogY2hlY2tpbmcgbmV3IGFsbGVydFxyXG5cdFx0XHQkc2NvcGUuJG9uKCduZXctYWxlcnQnLCBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG5cclxuXHRcdFx0XHR2YXIgYWxlcnQgPSAkc2NvcGUuYWxlcnRzLnB1c2goe1xyXG5cdFx0XHRcdFx0dHlwZTogZGF0YS50eXBlLFxyXG5cdFx0XHRcdFx0Y2xvc2VhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdFx0bWVzc2FnZTogY29uZmlnLkVSUk9SU1tkYXRhLmNvZGVdXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZSgkc2NvcGUuYWxlcnRzLmluZGV4T2YoYWxlcnQpLCAxKTtcclxuXHJcblx0XHRcdFx0fSwgODAwMCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignVXNlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJywgJyRhdXRoJywgJ1VzZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgJGF1dGgsIFVzZXIpIHtcclxuXHJcblx0XHRcdCRzY29wZS5pc015UHJvZmlsZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0VXNlci5nZXRCeUlkKCRzdGF0ZVBhcmFtcy5pZClcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRhdGEgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUuZGF0YS5pZCA9PT0gJGF1dGgudXNlci5pZCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNNeVByb2ZpbGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZXJyb3JcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignRW1haWxDb25maXJtYXRpb25DdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdFVzZXIuY29uZmlybWF0aW9uRW1haWwoJHN0YXRlUGFyYW1zLnRva2VuKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIGVycm9yXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuZXJyb3IgPSBjb25maWcuRVJST1JTW3Jlcy5kYXRhLmNvZGVdO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9sb2dpbkNvbnRyb2xsZXInKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBMT0dJTiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbJyRzY29wZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc2NvcGUsICRhdXRoKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGxvZ2luIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBzZXJ2aWNlIGNoZWNrXHJcblx0XHRcdFx0JGF1dGguc3VibWl0TG9naW4oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gZXJycm9yXHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5sb2dpbkZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdFxyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogbmFtZSByb2xlc1xyXG5cdFx0XHQkc2NvcGUucm9sZXMgPSBjb25maWcuUk9MRVM7XHJcblx0XHRcdCRzY29wZS5jb2RlUm9sZSA9IHt9O1xyXG5cdFx0XHQvLyBkZWZpbmUgZm9yIGd1ZXN0XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVSb2xlcyA9IFsxLCA0LCA1LCA2XTtcclxuXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogbG9naW4gc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHNlcnZpY2UgY2hlY2tcclxuXHRcdFx0XHQkYXV0aC5zdWJtaXRSZWdpc3RyYXRpb24oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2luZGV4Jyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5yZWdpc3RlckZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdFxyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIERJUkVDVElWRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZGlyZWN0aXZlc1xyXG5cdFx0LmRpcmVjdGl2ZSgndXNlclBhbmVsJywgWyckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyLXBhbmVsLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyUGFuZWxDdHJsJyxcclxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICd1c2VycGFuZWwnXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZGlyZWN0aXZlKCdhbGVydHNTZWN0aW9uJywgWyckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2FsZXJ0cy1zZWN0aW9uLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdBbGVydHNTZWN0aW9uQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnYWxlcnRzc2VjdGlvbidcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5kaXJlY3RpdmUoJ2VxdWFscycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxyXG5cdFx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoIW5nTW9kZWwpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdFx0dmFsaWRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRhdHRycy4kb2JzZXJ2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKHZhbCkge1xyXG5cclxuXHRcdFx0XHRcdFx0dmFsaWRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyB2YWx1ZXNcclxuXHRcdFx0XHRcdFx0dmFyIHZhbHVlRmlyc3QgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZVNlY29uZCA9IGF0dHJzLmVxdWFscztcclxuXHJcblx0XHRcdFx0XHRcdC8vIHNldCB2YWxpZGl0eVxyXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWYWxpZGl0eSgnZXF1YWxzJywgIXZhbHVlRmlyc3QgfHwgIXZhbHVlU2Vjb25kIHx8IHZhbHVlRmlyc3QgPT09IHZhbHVlU2Vjb25kKTtcclxuXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEZJTFRFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZmlsdGVyc1xyXG5cdFx0LmZpbHRlcigncnViJywgWyckZmlsdGVyJywgJyRsb2NhbGUnLCBmdW5jdGlvbiAoJGZpbHRlciwgJGxvY2FsZSkge1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChudW0pIHtcclxuXHRcdFx0XHRyZXR1cm4gJGZpbHRlcignbnVtYmVyJykobnVtLCAyKSArICc8c3BhbiBjbGFzcz1cImN1cnJlbmN5XCI+INGA0YPQsS48L3NwYW4+JztcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIExPR0lOXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIubG9naW4nLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIubG9naW4nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvbG9naW4nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL2xvZ2luLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdsb2dpbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogUmVnaXN0ZXIgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIucmVnaXN0ZXInLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3JlZ2lzdGVyLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1JlZ2lzdGVyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdyZWdpc3RlcicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5jb25maXJtJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3JlZ2lzdGVyLzp0b2tlbicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvY29uZmlybS5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdFbWFpbENvbmZpcm1hdGlvbkN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnY29uZmlybScsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdHRva2VuOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBST1VURVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJywgJyRodHRwUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2luZGV4Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLycsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2luZGV4Lmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdpbmRleCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgnNDA0Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzQwNCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzLzQwNC5odG1sJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHVybFJvdXRlclByb3ZpZGVyXHJcblx0XHRcdFx0Lm90aGVyd2lzZSgnLzQwNCcpO1xyXG5cclxuXHRcdFx0Ly8gaW50ZXJjZXB0b3JzXHJcblx0XHRcdCRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ1Jlc3BvbnNlSW50ZXJjZXB0b3InKTtcclxuXHRcdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnUHJvZ3Jlc3NJbnRlcmNlcHRvcicpO1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LnJ1bihbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgJGF1dGgsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogdmFsaWRhdGUgdXNlclxyXG5cdFx0XHQkYXV0aC52YWxpZGF0ZVVzZXIoKTtcclxuXHJcblx0XHRcdCRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiB2YWxpZGF0ZSB1c2VyXHJcblx0XHRcdFx0JGF1dGgudmFsaWRhdGVVc2VyKClcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmICghKCdkYXRhJyBpbiB0b1N0YXRlKSB8fCAhKCdhY2Nlc3MnIGluIHRvU3RhdGUuZGF0YSkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyB1bmRlZmluZWQgZGF0YSBhY2Nlc3NcclxuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFVc2VyLmNoZWNrQWNjZXNzKHRvU3RhdGUuZGF0YS5hY2Nlc3MsICRhdXRoLnVzZXIucm9sZSkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBmYWlsZWQgYWNjZXNzXHJcblx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRpZiAoZnJvbVN0YXRlLnVybCA9PT0gJ14nKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoJGF1dGgudXNlci5zaWduZWRJbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2luZGV4Jyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3VzZXIubG9naW4nKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR9KTs7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCRyb290U2NvcGUuJG9uKCdhdXRoOmxvZ2luLXN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQsIHJlYXNvbikge1xyXG5cclxuXHRcdFx0XHQkc3RhdGUuZ28oJ2luZGV4Jyk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBTRVJWSUNFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHRcdC8vIC4uLlxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGludGVyY2VwdG9yc1xyXG5cdFx0LmZhY3RvcnkoJ1Jlc3BvbnNlSW50ZXJjZXB0b3InLCBbJyRxJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBjb25maWcpIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY1Jlc3BvbnNlRXJyb3IocmVzKSB7XHJcblxyXG5cdFx0XHRcdC8vIGVycm9yIGFsZXJ0XHJcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCduZXctYWxlcnQnLCBfLmFzc2lnbihyZXMuZGF0YSwge1xyXG5cdFx0XHRcdFx0dHlwZTogJ2RhbmdlcidcclxuXHRcdFx0XHR9KSk7XHJcblxyXG5cdFx0XHRcdGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyL2xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy80MDQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzcG9uc2VFcnJvcjogcHVibGljUmVzcG9uc2VFcnJvclxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmZhY3RvcnkoJ1Byb2dyZXNzSW50ZXJjZXB0b3InLCBbJyRxJywgJyRpbmplY3RvcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHEsICRpbmplY3RvciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHR2YXIgbmdQcm9ncmVzcyA9IG51bGw7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwcml2YXRlR2V0TmdQcm9ncmVzcygpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogaW5pdCBwcmVsb2FkZXJcclxuXHRcdFx0XHRuZ1Byb2dyZXNzID0gbmdQcm9ncmVzcyB8fCAkaW5qZWN0b3IuZ2V0KCduZ1Byb2dyZXNzRmFjdG9yeScpLmNyZWF0ZUluc3RhbmNlKCk7XHJcblx0XHRcdFx0bmdQcm9ncmVzcy5zZXRIZWlnaHQoY29uZmlnLkxPQURFUl9IRUlHSFQpO1xyXG5cdFx0XHRcdG5nUHJvZ3Jlc3Muc2V0Q29sb3IoY29uZmlnLkxPQURFUl9DT0xPUik7XHJcblx0XHRcdFx0cmV0dXJuIG5nUHJvZ3Jlc3M7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKSB7XHJcblxyXG5cdFx0XHRcdHZhciBuZ1Byb2dyZXNzID0gcHJpdmF0ZUdldE5nUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHQvLyBUT0RPOiBwcmVsb2FkZXIgY29tcGxldGVcclxuXHRcdFx0XHRuZ1Byb2dyZXNzLmNvbXBsZXRlKCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXF1ZXN0OiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG5nUHJvZ3Jlc3MgPSBwcml2YXRlR2V0TmdQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogcHJlbG9hZGVyIHN0YXJ0XHJcblx0XHRcdFx0XHRuZ1Byb2dyZXNzLnJlc2V0KCk7XHJcblx0XHRcdFx0XHRuZ1Byb2dyZXNzLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlcXVlc3RFcnJvcjogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gJHEucmVqZWN0KHJlcyk7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRyZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IFxyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgU0VSVklDRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHRcdC5mYWN0b3J5KCdVc2VyJywgWyckaHR0cCcsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljR2V0QnlJZChpZCkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NoZWNrQWNjZXNzKGFjY2Vzcywgcm9sZSkge1xyXG5cclxuXHRcdFx0XHRpZiAocm9sZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRyb2xlID0gY29uZmlnLkRFRkFVTFRfUk9MRTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBfLmluZGV4T2YoYWNjZXNzLCByb2xlKSA9PT0gLTEgPyBmYWxzZSA6IHRydWU7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNDb25maXJtYXRpb25FbWFpbCh0b2tlbikge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvcmVnaXN0ZXIvJyArIHRva2VuKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Z2V0QnlJZDogcHVibGljR2V0QnlJZCxcclxuXHRcdFx0XHRjaGVja0FjY2VzczogcHVibGljQ2hlY2tBY2Nlc3MsXHJcblx0XHRcdFx0Y29uZmlybWF0aW9uRW1haWw6IHB1YmxpY0NvbmZpcm1hdGlvbkVtYWlsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVJcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlcicsIFtcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycy91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcy91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9sb2dpbicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vcmVnaXN0ZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy91c2VyJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy86aWQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcicsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdGlkOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
