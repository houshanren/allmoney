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
				handleAccountUpdateResponse: function (res) {

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
},{"./config":3,"./controllers":4,"./directives":10,"./filters":11,"./routes":15,"./services":16,"./user":18}],3:[function(require,module,exports){
/**
 * CONFIG
 */

'use strict';

(function () {

	/**
	 * Config module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.config', [])
		.constant('config', {
			// main
			NAME: 'ALLMONEY',
			DEBUG: true,
			// for users
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
			STATUSES: [
				'Не подтвержден',
				'Не проверен',
				'На модерации',
				'Активен',
				'Заморожен'
			],
			// for ads
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
			// handler
			ERRORS: {
				0: 'Неизвестная ошибка.',
				1: 'Ошибка аутентификации.',
				2: 'Неверный токен аутентификации.',
				3: 'Код подтверждения не найден, был активирован ранее или истек срок действия кода активации.',
				4: 'Введен неверный email или пароль.',
				5: 'Ошибка создания учетной записи. Пожалуйста проверьте введенные данные.',
				6: 'Пользователь не найден.',
				7: 'Ошибка обновления учетной записи. Пожалуйста проверьте введенные данные.'
			},
			REPORTS: {
				'notspecified': 'Не указано'
			},
			// loader
			LOADER_HEIGHT: '3px',
			LOADER_COLOR: '#0059ba'
		});

	// requires

})();
},{"./access.json":1}],4:[function(require,module,exports){
/**
 * CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers', [])
		// TODO: common controllers
		.controller('MainCtrl', ['$scope', '$location', 'config', function ($scope, $location, config) {

			$scope.isActive = function (location) {

				return location === $location.path();

			};

		}])
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
 * USER REGISTER CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('EditCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			// BUG: if copy $auth.user, we receive is not accurate data
			// HACK: not copy (sync)
			$scope.data = $auth.user;

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: update data
				$auth.updateAccount($scope.data)
					.then(function (res) {
						
						$state.go('user.personal');

					});

			};

		}]);

})();
},{}],6:[function(require,module,exports){
/**
 * USER CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers.user', [])
		// TODO: common controllers
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', '$auth', 'User', 'config', function ($scope, $stateParams, $state, $auth, User, config) {

			$scope.reports = config.REPORTS;
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
	require('./personalController');
	require('./editController');

})();
},{"./editController":5,"./loginController":7,"./personalController":8,"./registerController":9}],7:[function(require,module,exports){
/**
 * USER LOGIN CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', '$auth', function ($scope, $auth) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: login
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
},{}],8:[function(require,module,exports){
/**
 * USER PERSONAL CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('PersonalCtrl', ['$scope', '$state', '$auth', 'User', 'config', function ($scope, $state, $auth, User, config) {

			$scope.reports = config.REPORTS;
			$scope.statuses = config.STATUSES;
			$scope.data = $auth.user;

			// ...

		}]);

})();
},{}],9:[function(require,module,exports){
/**
 * USER REGISTER CONTROLLERS
 */

'use strict';

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

				// TODO: register
				$auth.submitRegistration($scope.data)
					.then(function (res) {

						$state.go('index');

					});

				// reset form
				/*$scope.reset();*/

			};

			$scope.reset = function () {

				$scope.registerForm.$setPristine();
				$scope.registerForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

			

		}]);

})();
},{}],10:[function(require,module,exports){
/**
 * DIRECTIVES
 */

'use strict';

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
},{}],11:[function(require,module,exports){
/**
 * FILTERS
 */

'use strict';

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
},{}],12:[function(require,module,exports){
/**
 * USER LOGIN
 */

'use strict';

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
},{}],13:[function(require,module,exports){
/**
 * USER PERSONAL
 */

'use strict';

(function () {

	/**
	 * Personal module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.personal', [])
		.config(['$stateProvider', 'config', function ($stateProvider, config) {

			$stateProvider
				.state('user.personal', {
					url: '/personal',
					templateUrl: 'partials/user/personal.html',
					controller: 'PersonalCtrl',
					controllerAs: 'personal',
					data: {
						access: config.ACCESS.user
					}
				})
				.state('user.edit', {
					url: '/edit',
					templateUrl: 'partials/user/edit.html',
					controller: 'EditCtrl',
					controllerAs: 'edit',
					data: {
						access: config.ACCESS.user
					}
				});

		}]);

	// requires

})();
},{}],14:[function(require,module,exports){
/**
 * USER REGISTER
 */

'use strict';

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
},{}],15:[function(require,module,exports){
/**
 * ROUTES
 */

'use strict';

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

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

				// TODO: validate user
				$auth.validateUser()
					.then(function (res) {

						if (!('data' in toState) || !('access' in toState.data)) {
							event.preventDefault();
						} else {
							User.checkAccess(toState.data.access, fromState.url, $auth.user.role, function (access) {

								if (!access)
									event.preventDefault();

							});
						}

					}, function (res) {

						$auth.user.role = 0;
						// check access
						User.checkAccess(toState.data.access, fromState.url, $auth.user.role, function (access) {

							if (!access)
								event.preventDefault();

						});

					});

			});

			$rootScope.$on('auth:login-success', function (event, reason) {

				$state.go('index');

			});

			$rootScope.$on('auth:logout-success', function (event) {

				$auth.user.role = 0;
				// check access
				User.checkAccess($state.current.data.access, $state.current.url, $auth.user.role, function (access) {

					if (!access)
						event.preventDefault();

				});

			});

		}]);

})();
},{}],16:[function(require,module,exports){
/**
 * SERVICES
 */

'use strict';

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
},{}],17:[function(require,module,exports){
/**
 * USER SERVICES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.services.user', [])
		// TODO: common services
		.factory('User', ['$http', '$state', '$auth', 'config', function ($http, $state, $auth, config) {

			function publicGetById(id) {

				return $http.get('/api/user/' + id);

			}

			function publicCheckAccess(access, fromUrl, role, callback) {

				if (role === undefined) {
					role = config.DEFAULT_ROLE;
				}

				if (_.indexOf(access, role) === -1) {
					callback(false);

					if ($auth.user.signedIn) {
						$state.go('index');
					} else {
						$state.go('user.login');
					}
				} else {
					callback(true);
				}

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
},{}],18:[function(require,module,exports){
/**
 * USER
 */

'use strict';

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
			require('./register').name,
			require('./personal').name
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
},{"./controllers/user":6,"./login":12,"./personal":13,"./register":14,"./services/user":17}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvZWRpdENvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVyLmpzIiwic3JjL2FwcC9jb250cm9sbGVycy91c2VyL3BlcnNvbmFsQ29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9yZWdpc3RlckNvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJzcmMvYXBwL2ZpbHRlcnMvaW5kZXguanMiLCJzcmMvYXBwL2xvZ2luLmpzIiwic3JjL2FwcC9wZXJzb25hbC5qcyIsInNyYy9hcHAvcmVnaXN0ZXIuanMiLCJzcmMvYXBwL3JvdXRlcy5qcyIsInNyYy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL3VzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9LyoqXHJcbiAqIFJPTEVTOlxyXG4gKiAwIC0gYW5vbnltb3VzXHJcbiAqIDEgLSB1c2VyXHJcbiAqIDIgLSBtb2RlcmF0b3JcclxuICogMyAtIGFkbWluXHJcbiAqIDQgLSBwcml2YXRlIHBlcnNvbiAocHApXHJcbiAqIDUgLSBtaWNyb2ZpbmFuY2Ugb3JnYW5pemF0aW9uIChtZmkpXHJcbiAqIDYgLSBwYXduc2hvcCAocHMpXHJcbiAqL1xyXG5cclxue1xyXG5cdFwicHVibGljXCI6IFswLCAxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFub255bW91c1wiOiBbMF0sXHJcblx0XCJ1c2VyXCI6IFsxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFkbWluXCI6IFszXVxyXG59IiwiLyoqXHJcbiAqIEFQUExJQ0FUSU9OXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQXBwIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnLCBbXHJcblx0XHRcdCd1aS5yb3V0ZXInLFxyXG5cdFx0XHQvLyBpbnN0ZWFkIG5nQ29va2llcyBodHRwczovL2dpdGh1Yi5jb20vbHlubmR5bGFuaHVybGV5L25nLXRva2VuLWF1dGgjd2h5LWRvZXMtdGhpcy1tb2R1bGUtdXNlLWlwY29va2llcy1pbnN0ZWFkLW9mLW5nY29va2llc1xyXG5cdFx0XHQnbmctdG9rZW4tYXV0aCcsXHJcblx0XHRcdC8vIGRvbVxyXG5cdFx0XHQnbmdTYW5pdGl6ZScsXHJcblx0XHRcdCduZ1Byb2dyZXNzJyxcclxuXHRcdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHRcdCd1aS5zZWxlY3QnLFxyXG5cdFx0XHQvLyB2YWx1ZXMgJiBjb25zdGFudHNcclxuXHRcdFx0cmVxdWlyZSgnLi9jb25maWcnKS5uYW1lLFxyXG5cdFx0XHQvLyBjb21wb25lbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzJykubmFtZSxcclxuXHRcdFx0Ly8gbW9kdWxlc1xyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRhdXRoUHJvdmlkZXInLCAnJHByb3ZpZGUnLCBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIsICRwcm92aWRlKSB7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBhdXRoIGNvbmZpZ1xyXG5cdFx0XHQkYXV0aFByb3ZpZGVyLmNvbmZpZ3VyZSh7XHJcblx0XHRcdFx0Ly8gbG9jYWxob3N0XHJcblx0XHRcdFx0YXBpVXJsOiAnL2FwaScsXHJcblx0XHRcdFx0dG9rZW5WYWxpZGF0aW9uUGF0aDogJy91c2VyL3ZhbGlkYXRlJyxcclxuICBcdFx0XHRcdHNpZ25PdXRVcmw6ICcvdXNlci9zaWdub3V0JyxcclxuICBcdFx0XHRcdGVtYWlsUmVnaXN0cmF0aW9uUGF0aDogJy91c2VyL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRhY2NvdW50VXBkYXRlUGF0aDogJy91c2VyL3VwZGF0ZScsXHJcblx0XHRcdFx0YWNjb3VudERlbGV0ZVBhdGg6ICcvdXNlci9kZWxldGUnLFxyXG5cdFx0XHRcdHBhc3N3b3JkUmVzZXRQYXRoOiAnL3VzZXIvcGFzc3dvcmQnLFxyXG5cdFx0XHRcdHBhc3N3b3JkVXBkYXRlUGF0aDogJy91c2VyL3Bhc3N3b3JkJyxcclxuXHRcdFx0XHRlbWFpbFNpZ25JblBhdGg6ICcvdXNlci9zaWduaW4nLFxyXG5cclxuXHRcdFx0XHR0b2tlbkZvcm1hdDoge1xyXG5cdFx0XHRcdFx0XCJhY2Nlc3MtdG9rZW5cIjogXCJ7eyB0b2tlbiB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ0b2tlbi10eXBlXCI6IFwiQmVhcmVyXCIsXHJcblx0XHRcdFx0XHRcImV4cGlyeVwiOiBcInt7IGV4cGlyeSB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ7eyB1aWQgfX1cIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlTG9naW5SZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlQWNjb3VudFVwZGF0ZVJlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlVG9rZW5WYWxpZGF0aW9uUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIEhBQ0s6IHJlZGVmaW5lIHVpLWJvb3RzdHJhcCB0ZW1wbGF0ZXNcclxuXHRcdFx0JHByb3ZpZGUuZGVjb3JhdG9yKCdhbGVydERpcmVjdGl2ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcclxuXHJcblx0XHRcdFx0JGRlbGVnYXRlWzBdLnRlbXBsYXRlVXJsID0gJ3BhcnRpYWxzL2FsZXJ0Lmh0bWwnO1xyXG5cdFx0XHRcdHJldHVybiAkZGVsZWdhdGU7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9yb3V0ZXMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTkZJR1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbmZpZyBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0Ly8gbWFpblxyXG5cdFx0XHROQU1FOiAnQUxMTU9ORVknLFxyXG5cdFx0XHRERUJVRzogdHJ1ZSxcclxuXHRcdFx0Ly8gZm9yIHVzZXJzXHJcblx0XHRcdFJPTEVTOiBbXHJcblx0XHRcdFx0J9CQ0L3QvtC90LjQvNGD0YEnLFxyXG5cdFx0XHRcdCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxyXG5cdFx0XHRcdCfQnNC+0LTQtdGA0LDRgtC+0YAnLFxyXG5cdFx0XHRcdCfQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9Cn0LDRgdGC0L3QvtC1INC70LjRhtC+JyxcclxuXHRcdFx0XHQn0JzQpNCeJyxcclxuXHRcdFx0XHQn0JvQvtC80LHQsNGA0LQnXHJcblx0XHRcdF0sXHJcblx0XHRcdERFRkFVTFRfUk9MRTogMCxcclxuXHRcdFx0QUNDRVNTOiByZXF1aXJlKCcuL2FjY2Vzcy5qc29uJyksXHJcblx0XHRcdFNUQVRVU0VTOiBbXHJcblx0XHRcdFx0J9Cd0LUg0L/QvtC00YLQstC10YDQttC00LXQvScsXHJcblx0XHRcdFx0J9Cd0LUg0L/RgNC+0LLQtdGA0LXQvScsXHJcblx0XHRcdFx0J9Cd0LAg0LzQvtC00LXRgNCw0YbQuNC4JyxcclxuXHRcdFx0XHQn0JDQutGC0LjQstC10L0nLFxyXG5cdFx0XHRcdCfQl9Cw0LzQvtGA0L7QttC10L0nXHJcblx0XHRcdF0sXHJcblx0XHRcdC8vIGZvciBhZHNcclxuXHRcdFx0Q0lUSUVTOiBbXHJcblx0XHRcdFx0J9CS0YHQtSDQs9C+0YDQvtC00LAnLFxyXG5cdFx0XHRcdCfQnNC+0YHQutCy0LAnLFxyXG5cdFx0XHRcdCfQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsycsXHJcblx0XHRcdFx0J9Cd0L7QstC+0YHQuNCx0LjRgNGB0LonLFxyXG5cdFx0XHRcdCfQndC40LbQvdC40Lkt0J3QvtCy0LPQvtGA0L7QtCcsXHJcblx0XHRcdFx0J9Ca0YDQsNGB0L3QvtGP0YDRgdC6JyxcclxuXHRcdFx0XHQn0JrQsNC30LDQvdGMJyxcclxuXHRcdFx0XHQn0JXQutCw0YLQtdGA0LjQvdCx0YPRgNCzJ1xyXG5cdFx0XHRdLFxyXG5cdFx0XHQvLyBoYW5kbGVyXHJcblx0XHRcdEVSUk9SUzoge1xyXG5cdFx0XHRcdDA6ICfQndC10LjQt9Cy0LXRgdGC0L3QsNGPINC+0YjQuNCx0LrQsC4nLFxyXG5cdFx0XHRcdDE6ICfQntGI0LjQsdC60LAg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDI6ICfQndC10LLQtdGA0L3Ri9C5INGC0L7QutC10L0g0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDM6ICfQmtC+0LQg0L/QvtC00YLQstC10YDQttC00LXQvdC40Y8g0L3QtSDQvdCw0LnQtNC10L0sINCx0YvQuyDQsNC60YLQuNCy0LjRgNC+0LLQsNC9INGA0LDQvdC10LUg0LjQu9C4INC40YHRgtC10Log0YHRgNC+0Log0LTQtdC50YHRgtCy0LjRjyDQutC+0LTQsCDQsNC60YLQuNCy0LDRhtC40LguJyxcclxuXHRcdFx0XHQ0OiAn0JLQstC10LTQtdC9INC90LXQstC10YDQvdGL0LkgZW1haWwg0LjQu9C4INC/0LDRgNC+0LvRjC4nLFxyXG5cdFx0XHRcdDU6ICfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDRg9GH0LXRgtC90L7QuSDQt9Cw0L/QuNGB0LguINCf0L7QttCw0LvRg9C50YHRgtCwINC/0YDQvtCy0LXRgNGM0YLQtSDQstCy0LXQtNC10L3QvdGL0LUg0LTQsNC90L3Ri9C1LicsXHJcblx0XHRcdFx0NjogJ9Cf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQvdC1INC90LDQudC00LXQvS4nLFxyXG5cdFx0XHRcdDc6ICfQntGI0LjQsdC60LAg0L7QsdC90L7QstC70LXQvdC40Y8g0YPRh9C10YLQvdC+0Lkg0LfQsNC/0LjRgdC4LiDQn9C+0LbQsNC70YPQudGB0YLQsCDQv9GA0L7QstC10YDRjNGC0LUg0LLQstC10LTQtdC90L3Ri9C1INC00LDQvdC90YvQtS4nXHJcblx0XHRcdH0sXHJcblx0XHRcdFJFUE9SVFM6IHtcclxuXHRcdFx0XHQnbm90c3BlY2lmaWVkJzogJ9Cd0LUg0YPQutCw0LfQsNC90L4nXHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIGxvYWRlclxyXG5cdFx0XHRMT0FERVJfSEVJR0hUOiAnM3B4JyxcclxuXHRcdFx0TE9BREVSX0NPTE9SOiAnIzAwNTliYSdcclxuXHRcdH0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRzY29wZScsICckbG9jYXRpb24nLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gbG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5jaXRpZXMgPSBjb25maWcuQ0lUSUVTO1xyXG5cdFx0XHQkc2NvcGUuY29kZUNpdHkgPSB7fTtcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlQ2l0aWVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cclxuXHRcdFx0Ly8gVEVNUDogZGVmaW5lIGxvY2F0aW9uXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyUGFuZWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLmhhbmRsZVNpZ25PdXRCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JGF1dGguc2lnbk91dCgpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignQWxlcnRzU2VjdGlvbkN0cmwnLCBbJyRzY29wZScsICckdGltZW91dCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuYWxlcnRzID0gW107XHJcblxyXG5cdFx0XHQvLyBjbG9zZSBhbGVydFxyXG5cdFx0XHQkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogY2hlY2tpbmcgbmV3IGFsbGVydFxyXG5cdFx0XHQkc2NvcGUuJG9uKCduZXctYWxlcnQnLCBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG5cclxuXHRcdFx0XHR2YXIgYWxlcnQgPSAkc2NvcGUuYWxlcnRzLnB1c2goe1xyXG5cdFx0XHRcdFx0dHlwZTogZGF0YS50eXBlLFxyXG5cdFx0XHRcdFx0Y2xvc2VhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdFx0bWVzc2FnZTogY29uZmlnLkVSUk9SU1tkYXRhLmNvZGVdXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZSgkc2NvcGUuYWxlcnRzLmluZGV4T2YoYWxlcnQpLCAxKTtcclxuXHJcblx0XHRcdFx0fSwgODAwMCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0VkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gQlVHOiBpZiBjb3B5ICRhdXRoLnVzZXIsIHdlIHJlY2VpdmUgaXMgbm90IGFjY3VyYXRlIGRhdGFcclxuXHRcdFx0Ly8gSEFDSzogbm90IGNvcHkgKHN5bmMpXHJcblx0XHRcdCRzY29wZS5kYXRhID0gJGF1dGgudXNlcjtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogbG9naW4gc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHVwZGF0ZSBkYXRhXHJcblx0XHRcdFx0JGF1dGgudXBkYXRlQWNjb3VudCgkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygndXNlci5wZXJzb25hbCcpO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignVXNlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJywgJyRhdXRoJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsICRhdXRoLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5yZXBvcnRzID0gY29uZmlnLlJFUE9SVFM7XHJcblx0XHRcdCRzY29wZS5pc015UHJvZmlsZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0VXNlci5nZXRCeUlkKCRzdGF0ZVBhcmFtcy5pZClcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRhdGEgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUuZGF0YS5pZCA9PT0gJGF1dGgudXNlci5pZCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNNeVByb2ZpbGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZXJyb3JcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignRW1haWxDb25maXJtYXRpb25DdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdFVzZXIuY29uZmlybWF0aW9uRW1haWwoJHN0YXRlUGFyYW1zLnRva2VuKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIGVycm9yXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuZXJyb3IgPSBjb25maWcuRVJST1JTW3Jlcy5kYXRhLmNvZGVdO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9sb2dpbkNvbnRyb2xsZXInKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcicpO1xyXG5cdHJlcXVpcmUoJy4vcGVyc29uYWxDb250cm9sbGVyJyk7XHJcblx0cmVxdWlyZSgnLi9lZGl0Q29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBMT0dJTiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbJyRzY29wZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc2NvcGUsICRhdXRoKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGxvZ2luIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBsb2dpblxyXG5cdFx0XHRcdCRhdXRoLnN1Ym1pdExvZ2luKCRzY29wZS5kYXRhKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG5cclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIGVycnJvclxyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyByZXNldCBmb3JtXHJcblx0XHRcdFx0JHNjb3BlLnJlc2V0KCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUubG9naW5Gb3JtLiRzZXRQcmlzdGluZSgpO1xyXG5cdFx0XHRcdCRzY29wZS5sb2dpbkZvcm0uJHNldFVudG91Y2hlZCgpO1xyXG5cdFx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFBFUlNPTkFMIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1BlcnNvbmFsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdVc2VyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLnN0YXR1c2VzID0gY29uZmlnLlNUQVRVU0VTO1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9ICRhdXRoLnVzZXI7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIFRPRE86IG5hbWUgcm9sZXNcclxuXHRcdFx0JHNjb3BlLnJvbGVzID0gY29uZmlnLlJPTEVTO1xyXG5cdFx0XHQkc2NvcGUuY29kZVJvbGUgPSB7fTtcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBbMSwgNCwgNSwgNl07XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGxvZ2luIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiByZWdpc3RlclxyXG5cdFx0XHRcdCRhdXRoLnN1Ym1pdFJlZ2lzdHJhdGlvbigkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnaW5kZXgnKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdC8qJHNjb3BlLnJlc2V0KCk7Ki9cclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5yZWdpc3RlckZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdFxyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIERJUkVDVElWRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZGlyZWN0aXZlc1xyXG5cdFx0LmRpcmVjdGl2ZSgndXNlclBhbmVsJywgWyckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyLXBhbmVsLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyUGFuZWxDdHJsJyxcclxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICd1c2VycGFuZWwnXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZGlyZWN0aXZlKCdhbGVydHNTZWN0aW9uJywgWyckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2FsZXJ0cy1zZWN0aW9uLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdBbGVydHNTZWN0aW9uQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnYWxlcnRzc2VjdGlvbidcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5kaXJlY3RpdmUoJ2VxdWFscycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxyXG5cdFx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoIW5nTW9kZWwpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdFx0dmFsaWRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRhdHRycy4kb2JzZXJ2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKHZhbCkge1xyXG5cclxuXHRcdFx0XHRcdFx0dmFsaWRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyB2YWx1ZXNcclxuXHRcdFx0XHRcdFx0dmFyIHZhbHVlRmlyc3QgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZVNlY29uZCA9IGF0dHJzLmVxdWFscztcclxuXHJcblx0XHRcdFx0XHRcdC8vIHNldCB2YWxpZGl0eVxyXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWYWxpZGl0eSgnZXF1YWxzJywgIXZhbHVlRmlyc3QgfHwgIXZhbHVlU2Vjb25kIHx8IHZhbHVlRmlyc3QgPT09IHZhbHVlU2Vjb25kKTtcclxuXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEZJTFRFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZmlsdGVyc1xyXG5cdFx0LmZpbHRlcigncnViJywgWyckZmlsdGVyJywgJyRsb2NhbGUnLCBmdW5jdGlvbiAoJGZpbHRlciwgJGxvY2FsZSkge1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChudW0pIHtcclxuXHRcdFx0XHRyZXR1cm4gJGZpbHRlcignbnVtYmVyJykobnVtLCAyKSArICc8c3BhbiBjbGFzcz1cImN1cnJlbmN5XCI+INGA0YPQsS48L3NwYW4+JztcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIExPR0lOXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIubG9naW4nLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIubG9naW4nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvbG9naW4nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL2xvZ2luLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdsb2dpbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFBFUlNPTkFMXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogUGVyc29uYWwgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIucGVyc29uYWwnLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucGVyc29uYWwnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcGVyc29uYWwnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3BlcnNvbmFsLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1BlcnNvbmFsQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdwZXJzb25hbCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy51c2VyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIuZWRpdCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy9lZGl0JyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9lZGl0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0VkaXRDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2VkaXQnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MudXNlclxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVJcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBSZWdpc3RlciBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5yZWdpc3RlcicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5yZWdpc3RlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9yZWdpc3RlcicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvcmVnaXN0ZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLmFub255bW91c1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmNvbmZpcm0nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXIvOnRva2VuJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9jb25maXJtLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0VtYWlsQ29uZmlybWF0aW9uQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdjb25maXJtJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0dG9rZW46IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFJPVVRFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGh0dHBQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgnaW5kZXgnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaW5kZXguaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2luZGV4JyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCc0MDQnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvNDA0JyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvNDA0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkdXJsUm91dGVyUHJvdmlkZXJcclxuXHRcdFx0XHQub3RoZXJ3aXNlKCcvNDA0Jyk7XHJcblxyXG5cdFx0XHQvLyBpbnRlcmNlcHRvcnNcclxuXHRcdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xyXG5cdFx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdQcm9ncmVzc0ludGVyY2VwdG9yJyk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgVXNlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogdmFsaWRhdGUgdXNlclxyXG5cdFx0XHRcdCRhdXRoLnZhbGlkYXRlVXNlcigpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoISgnZGF0YScgaW4gdG9TdGF0ZSkgfHwgISgnYWNjZXNzJyBpbiB0b1N0YXRlLmRhdGEpKSB7XHJcblx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRVc2VyLmNoZWNrQWNjZXNzKHRvU3RhdGUuZGF0YS5hY2Nlc3MsIGZyb21TdGF0ZS51cmwsICRhdXRoLnVzZXIucm9sZSwgZnVuY3Rpb24gKGFjY2Vzcykge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmICghYWNjZXNzKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdCRhdXRoLnVzZXIucm9sZSA9IDA7XHJcblx0XHRcdFx0XHRcdC8vIGNoZWNrIGFjY2Vzc1xyXG5cdFx0XHRcdFx0XHRVc2VyLmNoZWNrQWNjZXNzKHRvU3RhdGUuZGF0YS5hY2Nlc3MsIGZyb21TdGF0ZS51cmwsICRhdXRoLnVzZXIucm9sZSwgZnVuY3Rpb24gKGFjY2Vzcykge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIWFjY2VzcylcclxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS4kb24oJ2F1dGg6bG9naW4tc3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgcmVhc29uKSB7XHJcblxyXG5cdFx0XHRcdCRzdGF0ZS5nbygnaW5kZXgnKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS4kb24oJ2F1dGg6bG9nb3V0LXN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcblx0XHRcdFx0JGF1dGgudXNlci5yb2xlID0gMDtcclxuXHRcdFx0XHQvLyBjaGVjayBhY2Nlc3NcclxuXHRcdFx0XHRVc2VyLmNoZWNrQWNjZXNzKCRzdGF0ZS5jdXJyZW50LmRhdGEuYWNjZXNzLCAkc3RhdGUuY3VycmVudC51cmwsICRhdXRoLnVzZXIucm9sZSwgZnVuY3Rpb24gKGFjY2Vzcykge1xyXG5cclxuXHRcdFx0XHRcdGlmICghYWNjZXNzKVxyXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0Ly8gLi4uXHJcblx0XHQvLyBUT0RPOiBjb21tb24gaW50ZXJjZXB0b3JzXHJcblx0XHQuZmFjdG9yeSgnUmVzcG9uc2VJbnRlcmNlcHRvcicsIFsnJHEnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24sICRyb290U2NvcGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljUmVzcG9uc2VFcnJvcihyZXMpIHtcclxuXHJcblx0XHRcdFx0Ly8gZXJyb3IgYWxlcnRcclxuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ25ldy1hbGVydCcsIF8uYXNzaWduKHJlcy5kYXRhLCB7XHJcblx0XHRcdFx0XHR0eXBlOiAnZGFuZ2VyJ1xyXG5cdFx0XHRcdH0pKTtcclxuXHJcblx0XHRcdFx0aWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXIvbG9naW4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLzQwNCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXMpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXNwb25zZUVycm9yOiBwdWJsaWNSZXNwb25zZUVycm9yXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZmFjdG9yeSgnUHJvZ3Jlc3NJbnRlcmNlcHRvcicsIFsnJHEnLCAnJGluamVjdG9yJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcSwgJGluamVjdG9yLCBjb25maWcpIHtcclxuXHJcblx0XHRcdHZhciBuZ1Byb2dyZXNzID0gbnVsbDtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHByaXZhdGVHZXROZ1Byb2dyZXNzKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBpbml0IHByZWxvYWRlclxyXG5cdFx0XHRcdG5nUHJvZ3Jlc3MgPSBuZ1Byb2dyZXNzIHx8ICRpbmplY3Rvci5nZXQoJ25nUHJvZ3Jlc3NGYWN0b3J5JykuY3JlYXRlSW5zdGFuY2UoKTtcclxuXHRcdFx0XHRuZ1Byb2dyZXNzLnNldEhlaWdodChjb25maWcuTE9BREVSX0hFSUdIVCk7XHJcblx0XHRcdFx0bmdQcm9ncmVzcy5zZXRDb2xvcihjb25maWcuTE9BREVSX0NPTE9SKTtcclxuXHRcdFx0XHRyZXR1cm4gbmdQcm9ncmVzcztcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpIHtcclxuXHJcblx0XHRcdFx0dmFyIG5nUHJvZ3Jlc3MgPSBwcml2YXRlR2V0TmdQcm9ncmVzcygpO1xyXG5cdFx0XHRcdC8vIFRPRE86IHByZWxvYWRlciBjb21wbGV0ZVxyXG5cdFx0XHRcdG5nUHJvZ3Jlc3MuY29tcGxldGUoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlcXVlc3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgbmdQcm9ncmVzcyA9IHByaXZhdGVHZXROZ1Byb2dyZXNzKCk7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBwcmVsb2FkZXIgc3RhcnRcclxuXHRcdFx0XHRcdG5nUHJvZ3Jlc3MucmVzZXQoKTtcclxuXHRcdFx0XHRcdG5nUHJvZ3Jlc3Muc3RhcnQoKTtcclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmVxdWVzdEVycm9yOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRyZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuICRxLnJlamVjdChyZXMpO1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gXHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBTRVJWSUNFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnNlcnZpY2VzLnVzZXInLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0LmZhY3RvcnkoJ1VzZXInLCBbJyRodHRwJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljR2V0QnlJZChpZCkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NoZWNrQWNjZXNzKGFjY2VzcywgZnJvbVVybCwgcm9sZSwgY2FsbGJhY2spIHtcclxuXHJcblx0XHRcdFx0aWYgKHJvbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0cm9sZSA9IGNvbmZpZy5ERUZBVUxUX1JPTEU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKGFjY2Vzcywgcm9sZSkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhmYWxzZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCRhdXRoLnVzZXIuc2lnbmVkSW4pIHtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdpbmRleCcpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLmxvZ2luJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NvbmZpcm1hdGlvbkVtYWlsKHRva2VuKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci9yZWdpc3Rlci8nICsgdG9rZW4pO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRnZXRCeUlkOiBwdWJsaWNHZXRCeUlkLFxyXG5cdFx0XHRcdGNoZWNrQWNjZXNzOiBwdWJsaWNDaGVja0FjY2VzcyxcclxuXHRcdFx0XHRjb25maXJtYXRpb25FbWFpbDogcHVibGljQ29uZmlybWF0aW9uRW1haWxcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ2luIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyJywgW1xyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2xvZ2luJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9yZWdpc3RlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vcGVyc29uYWwnKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy91c2VyJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy86aWQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcicsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdGlkOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
