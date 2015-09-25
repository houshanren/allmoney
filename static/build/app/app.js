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
	"lender": [4, 5, 6],
	"admin": [3]
}
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./ad.create":2,"./controllers/ad":8,"./services/ad":18}],4:[function(require,module,exports){
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
			'checklist-model',
			// values & constants
			require('./config').name,
			// components
			require('./directives').name,
			require('./controllers').name,
			require('./directives').name,
			require('./filters').name,
			require('./services').name,
			// modules
			require('./user').name,
			require('./ad').name
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
},{"./ad":3,"./config":5,"./controllers":9,"./directives":15,"./filters":16,"./routes":17,"./services":19,"./user":21}],5:[function(require,module,exports){
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
			TERM_UNITS: [
				'Дней'
			],
			RATE_UNITS: [
				'В день',
				'В месяц',
				'В год'
			],
			PERIOD_UNITS: [
				'Минут',
				'Часов',
				'Дней'
			],
			SECURITY_TYPES: [
				'Расписка',
				'Залог'
			],
			WAYGET_TYPES: [
				'Наличными',
				'Онлайн'
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
				7: 'Ошибка обновления учетной записи. Пожалуйста проверьте введенные данные.',
				8: 'Ошибка создания объявления. Пожалуйста проверьте введенные данные.',
				9: 'Объявление не найдено.'
			},
			REPORTS: {
				'notspecified': 'Не указано',
				'noreviews': 'Нет ни одного отзыва :('
			},
			// loader
			LOADER_HEIGHT: '3px',
			LOADER_COLOR: '#0059ba'
		});

	// requires

})();
},{"./access.json":1}],6:[function(require,module,exports){
/**
 * AD CREATE CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.ad')
		.controller('AdCreateCtrl', ['$scope', '$state', '$auth', 'Ad', 'config', function ($scope, $state, $auth, Ad, config) {

			$scope.user = $auth.user;

			// selects
			// term units
			$scope.termUnits = config.TERM_UNITS;
			$scope.availableTermUnits = [0];
			// rate units
			$scope.rateUnits = config.RATE_UNITS;
			$scope.availableRateUnits = [0, 1, 2];
			// period units
			$scope.periodUnits = config.PERIOD_UNITS;
			$scope.availablePeriodUnits = [0, 1, 2];
			// security
			$scope.securityTypes = config.SECURITY_TYPES;
			$scope.securityCodes = [0, 1];
			// wayget
			$scope.waygetTypes = config.WAYGET_TYPES;
			$scope.waygetCodes = [0, 1];
			// cities
			$scope.cities = config.CITIES;
			$scope.citiesCodes = [0, 1, 2, 3, 4, 5, 6, 7];

			$scope.initial = {
				term: {
					unit: 0
				},
				rate: {
					unit: 0
				},
				period: {
					unit: 0
				}
			};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: create submit
			$scope.submit = function () {

				// TODO: create
				Ad.create($scope.data)
					.then(function (res) {

						// reset form
						$scope.reset();
						$state.go('user.personal');

					});

			};

			$scope.reset = function () {

				$scope.createForm.$setPristine();
				$scope.createForm.$setUntouched();
				$scope.data = angular.copy($scope.initial);

			};

		}]);

})();
},{}],7:[function(require,module,exports){
/**
 * AD EDIT CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.ad')
		.controller('AdEditCtrl', ['$scope', '$state', 'config', function ($scope, $state, config) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: edit submit
			$scope.submit = function () {

				// TODO: update data
				// ...

			};

		}]);

})();
},{}],8:[function(require,module,exports){
/**
 * AD CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers.ad', [])
		// TODO: common controllers
		.controller('AdCtrl', ['$scope', '$stateParams', '$state', 'Ad', 'config', function ($scope, $stateParams, $state, Ad, config) {

			// define
			$scope.reports = config.REPORTS;
			$scope.termUnits = config.TERM_UNITS;
			$scope.rateUnits = config.RATE_UNITS;
			$scope.periodUnits = config.PERIOD_UNITS;
			$scope.securityTypes = config.SECURITY_TYPES;
			$scope.waygetTypes = config.WAYGET_TYPES;
			$scope.cities = config.CITIES;

			Ad.getById($stateParams.id)
				.then(function (res) {

					// success
					$scope.data = res.data;

				}, function (res) {

					// error

				});

		}]);

	// requires
	require('./createController');
	require('./editController');

})();
},{"./createController":6,"./editController":7}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
/**
 * USER EDIT CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('UserEditCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			// BUG: if copy $auth.user, we receive is not accurate data
			// HACK: not copy (sync)
			$scope.data = $auth.user;

			// ...

			// TODO: edit submit
			$scope.submit = function () {

				// TODO: update data
				$auth.updateAccount($scope.data)
					.then(function (res) {
						
						$state.go('user.personal');

					});

			};

		}]);

})();
},{}],11:[function(require,module,exports){
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
		.controller('UserEmailConfirmationCtrl', ['$scope', '$stateParams', 'User', 'config', function ($scope, $stateParams, User, config) {

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
},{"./editController":10,"./loginController":12,"./personalController":13,"./registerController":14}],12:[function(require,module,exports){
/**
 * USER LOGIN CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('UserLoginCtrl', ['$scope', '$auth', function ($scope, $auth) {

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
},{}],13:[function(require,module,exports){
/**
 * USER PERSONAL CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('UserPersonalCtrl', ['$scope', '$state', '$auth', 'User', 'config', function ($scope, $state, $auth, User, config) {

			$scope.reports = config.REPORTS;
			$scope.statuses = config.STATUSES;
			$scope.data = $auth.user;

			// ...

		}]);

})();
},{}],14:[function(require,module,exports){
/**
 * USER REGISTER CONTROLLERS
 */

'use strict';

(function () {

	angular
		.module('app.controllers.user')
		.controller('UserRegisterCtrl', ['$scope', '$state', '$auth', 'config', function ($scope, $state, $auth, config) {

			// TODO: name roles
			$scope.roles = config.ROLES;
			// define for guest
			$scope.availableRoles = [1, 4, 5, 6];

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: register submit
			$scope.submit = function () {

				// TODO: register
				$auth.submitRegistration($scope.data)
					.then(function (res) {

						$scope.reset();
						$state.go('user.personal');

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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
/**
 * AD SERVICES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.services.ad', [])
		// TODO: common services
		.factory('Ad', ['$http', '$state', 'config', function ($http, $state, config) {

			function publicGetById(id) {

				return $http.get('/api/ad/' + id);

			}

			function publicCreate(data) {

				return $http.post('/api/ad/create', data);

			}

			// ...

			return {
				getById: publicGetById,
				create: publicCreate
			};

		}]);


	// requires

})();
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
			require('./user.login').name,
			require('./user.register').name,
			require('./user.personal').name
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
},{"./controllers/user":11,"./services/user":20,"./user.login":22,"./user.personal":23,"./user.register":24}],22:[function(require,module,exports){
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
					controller: 'UserLoginCtrl',
					controllerAs: 'login',
					data: {
						access: config.ACCESS.anonymous
					}
				});

		}]);

	// requires

})();
},{}],23:[function(require,module,exports){
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
					controller: 'UserPersonalCtrl',
					controllerAs: 'personal',
					data: {
						access: config.ACCESS.user
					}
				})
				.state('user.edit', {
					url: '/edit',
					templateUrl: 'partials/user/edit.html',
					controller: 'UserEditCtrl',
					controllerAs: 'edit',
					data: {
						access: config.ACCESS.user
					}
				});

		}]);

	// requires

})();
},{}],24:[function(require,module,exports){
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
					controller: 'UserRegisterCtrl',
					controllerAs: 'register',
					data: {
						access: config.ACCESS.anonymous
					}
				})
				.state('user.confirm', {
					url: '/register/:token',
					templateUrl: 'partials/user/confirm.html',
					controller: 'UserEmailConfirmationCtrl',
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
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hZC5jcmVhdGUuanMiLCJzcmMvYXBwL2FkLmpzIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvYWQvY3JlYXRlQ29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvYWQvZWRpdENvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL2FkL2luZGV4LmpzIiwic3JjL2FwcC9jb250cm9sbGVycy9pbmRleC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9lZGl0Q29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9pbmRleC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvcGVyc29uYWxDb250cm9sbGVyLmpzIiwic3JjL2FwcC9jb250cm9sbGVycy91c2VyL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9hcHAvZmlsdGVycy9pbmRleC5qcyIsInNyYy9hcHAvcm91dGVzLmpzIiwic3JjL2FwcC9zZXJ2aWNlcy9hZC9pbmRleC5qcyIsInNyYy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL3VzZXIuanMiLCJzcmMvYXBwL3VzZXIubG9naW4uanMiLCJzcmMvYXBwL3VzZXIucGVyc29uYWwuanMiLCJzcmMvYXBwL3VzZXIucmVnaXN0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPS8qKlxyXG4gKiBST0xFUzpcclxuICogMCAtIGFub255bW91c1xyXG4gKiAxIC0gdXNlclxyXG4gKiAyIC0gbW9kZXJhdG9yXHJcbiAqIDMgLSBhZG1pblxyXG4gKiA0IC0gcHJpdmF0ZSBwZXJzb24gKHBwKVxyXG4gKiA1IC0gbWljcm9maW5hbmNlIG9yZ2FuaXphdGlvbiAobWZpKVxyXG4gKiA2IC0gcGF3bnNob3AgKHBzKVxyXG4gKi9cclxuXHJcbntcclxuXHRcInB1YmxpY1wiOiBbMCwgMSwgMiwgMywgNCwgNSwgNl0sXHJcblx0XCJhbm9ueW1vdXNcIjogWzBdLFxyXG5cdFwidXNlclwiOiBbMSwgMiwgMywgNCwgNSwgNl0sXHJcblx0XCJsZW5kZXJcIjogWzQsIDUsIDZdLFxyXG5cdFwiYWRtaW5cIjogWzNdXHJcbn0iLCIvKipcclxuICogQUQgQ1JFQVRFXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5hZC5jcmVhdGUnLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2FkLmNyZWF0ZScsIHtcclxuXHRcdFx0XHRcdHVybDogJy9jcmVhdGUnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9hZC9jcmVhdGUuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnQWRDcmVhdGVDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2NyZWF0ZScsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5sZW5kZXJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBBRFxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5hZCcsIFtcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycy9hZCcpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vc2VydmljZXMvYWQnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2FkLmNyZWF0ZScpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdhZCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy9hZCcsXHJcblx0XHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcclxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnPHVpLXZpZXc+JyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCdhZC52aWV3Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzppZCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2FkL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnQWRDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2FkJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0aWQ6IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFQUExJQ0FUSU9OXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQXBwIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnLCBbXHJcblx0XHRcdCd1aS5yb3V0ZXInLFxyXG5cdFx0XHQvLyBpbnN0ZWFkIG5nQ29va2llcyBodHRwczovL2dpdGh1Yi5jb20vbHlubmR5bGFuaHVybGV5L25nLXRva2VuLWF1dGgjd2h5LWRvZXMtdGhpcy1tb2R1bGUtdXNlLWlwY29va2llcy1pbnN0ZWFkLW9mLW5nY29va2llc1xyXG5cdFx0XHQnbmctdG9rZW4tYXV0aCcsXHJcblx0XHRcdC8vIGRvbVxyXG5cdFx0XHQnbmdTYW5pdGl6ZScsXHJcblx0XHRcdCduZ1Byb2dyZXNzJyxcclxuXHRcdFx0J3VpLmJvb3RzdHJhcCcsXHJcblx0XHRcdCd1aS5zZWxlY3QnLFxyXG5cdFx0XHQnY2hlY2tsaXN0LW1vZGVsJyxcclxuXHRcdFx0Ly8gdmFsdWVzICYgY29uc3RhbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vY29uZmlnJykubmFtZSxcclxuXHRcdFx0Ly8gY29tcG9uZW50c1xyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9maWx0ZXJzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcycpLm5hbWUsXHJcblx0XHRcdC8vIG1vZHVsZXNcclxuXHRcdFx0cmVxdWlyZSgnLi91c2VyJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9hZCcpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJGxvY2F0aW9uUHJvdmlkZXInLCAnJGF1dGhQcm92aWRlcicsICckcHJvdmlkZScsIGZ1bmN0aW9uICgkbG9jYXRpb25Qcm92aWRlciwgJGF1dGhQcm92aWRlciwgJHByb3ZpZGUpIHtcclxuXHJcblx0XHRcdCRsb2NhdGlvblByb3ZpZGVyXHJcblx0XHRcdFx0Lmh0bWw1TW9kZSh0cnVlKTtcclxuXHJcblx0XHRcdC8vIFRPRE86IGF1dGggY29uZmlnXHJcblx0XHRcdCRhdXRoUHJvdmlkZXIuY29uZmlndXJlKHtcclxuXHRcdFx0XHQvLyBsb2NhbGhvc3RcclxuXHRcdFx0XHRhcGlVcmw6ICcvYXBpJyxcclxuXHRcdFx0XHR0b2tlblZhbGlkYXRpb25QYXRoOiAnL3VzZXIvdmFsaWRhdGUnLFxyXG4gIFx0XHRcdFx0c2lnbk91dFVybDogJy91c2VyL3NpZ25vdXQnLFxyXG4gIFx0XHRcdFx0ZW1haWxSZWdpc3RyYXRpb25QYXRoOiAnL3VzZXIvcmVnaXN0ZXInLFxyXG5cdFx0XHRcdGFjY291bnRVcGRhdGVQYXRoOiAnL3VzZXIvdXBkYXRlJyxcclxuXHRcdFx0XHRhY2NvdW50RGVsZXRlUGF0aDogJy91c2VyL2RlbGV0ZScsXHJcblx0XHRcdFx0cGFzc3dvcmRSZXNldFBhdGg6ICcvdXNlci9wYXNzd29yZCcsXHJcblx0XHRcdFx0cGFzc3dvcmRVcGRhdGVQYXRoOiAnL3VzZXIvcGFzc3dvcmQnLFxyXG5cdFx0XHRcdGVtYWlsU2lnbkluUGF0aDogJy91c2VyL3NpZ25pbicsXHJcblxyXG5cdFx0XHRcdHRva2VuRm9ybWF0OiB7XHJcblx0XHRcdFx0XHRcImFjY2Vzcy10b2tlblwiOiBcInt7IHRva2VuIH19XCIsXHJcblx0XHRcdFx0XHRcInRva2VuLXR5cGVcIjogXCJCZWFyZXJcIixcclxuXHRcdFx0XHRcdFwiZXhwaXJ5XCI6IFwie3sgZXhwaXJ5IH19XCIsXHJcblx0XHRcdFx0XHRcInVpZFwiOiBcInt7IHVpZCB9fVwiXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoYW5kbGVMb2dpblJlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoYW5kbGVBY2NvdW50VXBkYXRlUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRoYW5kbGVUb2tlblZhbGlkYXRpb25SZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gSEFDSzogcmVkZWZpbmUgdWktYm9vdHN0cmFwIHRlbXBsYXRlc1xyXG5cdFx0XHQkcHJvdmlkZS5kZWNvcmF0b3IoJ2FsZXJ0RGlyZWN0aXZlJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSkge1xyXG5cclxuXHRcdFx0XHQkZGVsZWdhdGVbMF0udGVtcGxhdGVVcmwgPSAncGFydGlhbHMvYWxlcnQuaHRtbCc7XHJcblx0XHRcdFx0cmV0dXJuICRkZWxlZ2F0ZTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHRyZXF1aXJlKCcuL3JvdXRlcycpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09ORklHXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQ29uZmlnIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSlcclxuXHRcdC5jb25zdGFudCgnY29uZmlnJywge1xyXG5cdFx0XHQvLyBtYWluXHJcblx0XHRcdE5BTUU6ICdBTExNT05FWScsXHJcblx0XHRcdERFQlVHOiB0cnVlLFxyXG5cdFx0XHQvLyBmb3IgdXNlcnNcclxuXHRcdFx0Uk9MRVM6IFtcclxuXHRcdFx0XHQn0JDQvdC+0L3QuNC80YPRgScsXHJcblx0XHRcdFx0J9Cf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCcsXHJcblx0XHRcdFx0J9Cc0L7QtNC10YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9CQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAJyxcclxuXHRcdFx0XHQn0KfQsNGB0YLQvdC+0LUg0LvQuNGG0L4nLFxyXG5cdFx0XHRcdCfQnNCk0J4nLFxyXG5cdFx0XHRcdCfQm9C+0LzQsdCw0YDQtCdcclxuXHRcdFx0XSxcclxuXHRcdFx0REVGQVVMVF9ST0xFOiAwLFxyXG5cdFx0XHRBQ0NFU1M6IHJlcXVpcmUoJy4vYWNjZXNzLmpzb24nKSxcclxuXHRcdFx0U1RBVFVTRVM6IFtcclxuXHRcdFx0XHQn0J3QtSDQv9C+0LTRgtCy0LXRgNC20LTQtdC9JyxcclxuXHRcdFx0XHQn0J3QtSDQv9GA0L7QstC10YDQtdC9JyxcclxuXHRcdFx0XHQn0J3QsCDQvNC+0LTQtdGA0LDRhtC40LgnLFxyXG5cdFx0XHRcdCfQkNC60YLQuNCy0LXQvScsXHJcblx0XHRcdFx0J9CX0LDQvNC+0YDQvtC20LXQvSdcclxuXHRcdFx0XSxcclxuXHRcdFx0Ly8gZm9yIGFkc1xyXG5cdFx0XHRDSVRJRVM6IFtcclxuXHRcdFx0XHQn0JLRgdC1INCz0L7RgNC+0LTQsCcsXHJcblx0XHRcdFx0J9Cc0L7RgdC60LLQsCcsXHJcblx0XHRcdFx0J9Ch0LDQvdC60YIt0J/QtdGC0LXRgNCx0YPRgNCzJyxcclxuXHRcdFx0XHQn0J3QvtCy0L7RgdC40LHQuNGA0YHQuicsXHJcblx0XHRcdFx0J9Cd0LjQttC90LjQuS3QndC+0LLQs9C+0YDQvtC0JyxcclxuXHRcdFx0XHQn0JrRgNCw0YHQvdC+0Y/RgNGB0LonLFxyXG5cdFx0XHRcdCfQmtCw0LfQsNC90YwnLFxyXG5cdFx0XHRcdCfQldC60LDRgtC10YDQuNC90LHRg9GA0LMnXHJcblx0XHRcdF0sXHJcblx0XHRcdFRFUk1fVU5JVFM6IFtcclxuXHRcdFx0XHQn0JTQvdC10LknXHJcblx0XHRcdF0sXHJcblx0XHRcdFJBVEVfVU5JVFM6IFtcclxuXHRcdFx0XHQn0JIg0LTQtdC90YwnLFxyXG5cdFx0XHRcdCfQkiDQvNC10YHRj9GGJyxcclxuXHRcdFx0XHQn0JIg0LPQvtC0J1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRQRVJJT0RfVU5JVFM6IFtcclxuXHRcdFx0XHQn0JzQuNC90YPRgicsXHJcblx0XHRcdFx0J9Cn0LDRgdC+0LInLFxyXG5cdFx0XHRcdCfQlNC90LXQuSdcclxuXHRcdFx0XSxcclxuXHRcdFx0U0VDVVJJVFlfVFlQRVM6IFtcclxuXHRcdFx0XHQn0KDQsNGB0L/QuNGB0LrQsCcsXHJcblx0XHRcdFx0J9CX0LDQu9C+0LMnXHJcblx0XHRcdF0sXHJcblx0XHRcdFdBWUdFVF9UWVBFUzogW1xyXG5cdFx0XHRcdCfQndCw0LvQuNGH0L3Ri9C80LgnLFxyXG5cdFx0XHRcdCfQntC90LvQsNC50L0nXHJcblx0XHRcdF0sXHJcblx0XHRcdC8vIGhhbmRsZXJcclxuXHRcdFx0RVJST1JTOiB7XHJcblx0XHRcdFx0MDogJ9Cd0LXQuNC30LLQtdGB0YLQvdCw0Y8g0L7RiNC40LHQutCwLicsXHJcblx0XHRcdFx0MTogJ9Ce0YjQuNCx0LrQsCDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LicsXHJcblx0XHRcdFx0MjogJ9Cd0LXQstC10YDQvdGL0Lkg0YLQvtC60LXQvSDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LicsXHJcblx0XHRcdFx0MzogJ9Ca0L7QtCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyDQvdC1INC90LDQudC00LXQvSwg0LHRi9C7INCw0LrRgtC40LLQuNGA0L7QstCw0L0g0YDQsNC90LXQtSDQuNC70Lgg0LjRgdGC0LXQuiDRgdGA0L7QuiDQtNC10LnRgdGC0LLQuNGPINC60L7QtNCwINCw0LrRgtC40LLQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDQ6ICfQktCy0LXQtNC10L0g0L3QtdCy0LXRgNC90YvQuSBlbWFpbCDQuNC70Lgg0L/QsNGA0L7Qu9GMLicsXHJcblx0XHRcdFx0NTogJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINGD0YfQtdGC0L3QvtC5INC30LDQv9C40YHQuC4g0J/QvtC20LDQu9GD0LnRgdGC0LAg0L/RgNC+0LLQtdGA0YzRgtC1INCy0LLQtdC00LXQvdC90YvQtSDQtNCw0L3QvdGL0LUuJyxcclxuXHRcdFx0XHQ2OiAn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC90LUg0L3QsNC50LTQtdC9LicsXHJcblx0XHRcdFx0NzogJ9Ce0YjQuNCx0LrQsCDQvtCx0L3QvtCy0LvQtdC90LjRjyDRg9GH0LXRgtC90L7QuSDQt9Cw0L/QuNGB0LguINCf0L7QttCw0LvRg9C50YHRgtCwINC/0YDQvtCy0LXRgNGM0YLQtSDQstCy0LXQtNC10L3QvdGL0LUg0LTQsNC90L3Ri9C1LicsXHJcblx0XHRcdFx0ODogJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINC+0LHRitGP0LLQu9C10L3QuNGPLiDQn9C+0LbQsNC70YPQudGB0YLQsCDQv9GA0L7QstC10YDRjNGC0LUg0LLQstC10LTQtdC90L3Ri9C1INC00LDQvdC90YvQtS4nLFxyXG5cdFx0XHRcdDk6ICfQntCx0YrRj9Cy0LvQtdC90LjQtSDQvdC1INC90LDQudC00LXQvdC+LidcclxuXHRcdFx0fSxcclxuXHRcdFx0UkVQT1JUUzoge1xyXG5cdFx0XHRcdCdub3RzcGVjaWZpZWQnOiAn0J3QtSDRg9C60LDQt9Cw0L3QvicsXHJcblx0XHRcdFx0J25vcmV2aWV3cyc6ICfQndC10YIg0L3QuCDQvtC00L3QvtCz0L4g0L7RgtC30YvQstCwIDooJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBsb2FkZXJcclxuXHRcdFx0TE9BREVSX0hFSUdIVDogJzNweCcsXHJcblx0XHRcdExPQURFUl9DT0xPUjogJyMwMDU5YmEnXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFEIENSRUFURSBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy5hZCcpXHJcblx0XHQuY29udHJvbGxlcignQWRDcmVhdGVDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ0FkJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIEFkLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS51c2VyID0gJGF1dGgudXNlcjtcclxuXHJcblx0XHRcdC8vIHNlbGVjdHNcclxuXHRcdFx0Ly8gdGVybSB1bml0c1xyXG5cdFx0XHQkc2NvcGUudGVybVVuaXRzID0gY29uZmlnLlRFUk1fVU5JVFM7XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVUZXJtVW5pdHMgPSBbMF07XHJcblx0XHRcdC8vIHJhdGUgdW5pdHNcclxuXHRcdFx0JHNjb3BlLnJhdGVVbml0cyA9IGNvbmZpZy5SQVRFX1VOSVRTO1xyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlUmF0ZVVuaXRzID0gWzAsIDEsIDJdO1xyXG5cdFx0XHQvLyBwZXJpb2QgdW5pdHNcclxuXHRcdFx0JHNjb3BlLnBlcmlvZFVuaXRzID0gY29uZmlnLlBFUklPRF9VTklUUztcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZVBlcmlvZFVuaXRzID0gWzAsIDEsIDJdO1xyXG5cdFx0XHQvLyBzZWN1cml0eVxyXG5cdFx0XHQkc2NvcGUuc2VjdXJpdHlUeXBlcyA9IGNvbmZpZy5TRUNVUklUWV9UWVBFUztcclxuXHRcdFx0JHNjb3BlLnNlY3VyaXR5Q29kZXMgPSBbMCwgMV07XHJcblx0XHRcdC8vIHdheWdldFxyXG5cdFx0XHQkc2NvcGUud2F5Z2V0VHlwZXMgPSBjb25maWcuV0FZR0VUX1RZUEVTO1xyXG5cdFx0XHQkc2NvcGUud2F5Z2V0Q29kZXMgPSBbMCwgMV07XHJcblx0XHRcdC8vIGNpdGllc1xyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNpdGllc0NvZGVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7XHJcblx0XHRcdFx0dGVybToge1xyXG5cdFx0XHRcdFx0dW5pdDogMFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmF0ZToge1xyXG5cdFx0XHRcdFx0dW5pdDogMFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cGVyaW9kOiB7XHJcblx0XHRcdFx0XHR1bml0OiAwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGNyZWF0ZSBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogY3JlYXRlXHJcblx0XHRcdFx0QWQuY3JlYXRlKCRzY29wZS5kYXRhKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLnBlcnNvbmFsJyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBBRCBFRElUIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLmFkJylcclxuXHRcdC5jb250cm9sbGVyKCdBZEVkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGVkaXQgc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHVwZGF0ZSBkYXRhXHJcblx0XHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFEIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMuYWQnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ0FkQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnQWQnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIEFkLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIGRlZmluZVxyXG5cdFx0XHQkc2NvcGUucmVwb3J0cyA9IGNvbmZpZy5SRVBPUlRTO1xyXG5cdFx0XHQkc2NvcGUudGVybVVuaXRzID0gY29uZmlnLlRFUk1fVU5JVFM7XHJcblx0XHRcdCRzY29wZS5yYXRlVW5pdHMgPSBjb25maWcuUkFURV9VTklUUztcclxuXHRcdFx0JHNjb3BlLnBlcmlvZFVuaXRzID0gY29uZmlnLlBFUklPRF9VTklUUztcclxuXHRcdFx0JHNjb3BlLnNlY3VyaXR5VHlwZXMgPSBjb25maWcuU0VDVVJJVFlfVFlQRVM7XHJcblx0XHRcdCRzY29wZS53YXlnZXRUeXBlcyA9IGNvbmZpZy5XQVlHRVRfVFlQRVM7XHJcblx0XHRcdCRzY29wZS5jaXRpZXMgPSBjb25maWcuQ0lUSUVTO1xyXG5cclxuXHRcdFx0QWQuZ2V0QnlJZCgkc3RhdGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuXHRcdFx0XHRcdCRzY29wZS5kYXRhID0gcmVzLmRhdGE7XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9jcmVhdGVDb250cm9sbGVyJyk7XHJcblx0cmVxdWlyZSgnLi9lZGl0Q29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRzY29wZScsICckbG9jYXRpb24nLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBjb25maWcpIHtcclxuXHRcdFx0XHJcblx0XHRcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gbG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5jaXRpZXMgPSBjb25maWcuQ0lUSUVTO1xyXG5cdFx0XHQkc2NvcGUuY29kZUNpdHkgPSB7fTtcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlQ2l0aWVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cclxuXHRcdFx0Ly8gVEVNUDogZGVmaW5lIGxvY2F0aW9uXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyUGFuZWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLmhhbmRsZVNpZ25PdXRCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JGF1dGguc2lnbk91dCgpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignQWxlcnRzU2VjdGlvbkN0cmwnLCBbJyRzY29wZScsICckdGltZW91dCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuYWxlcnRzID0gW107XHJcblxyXG5cdFx0XHQvLyBjbG9zZSBhbGVydFxyXG5cdFx0XHQkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogY2hlY2tpbmcgbmV3IGFsbGVydFxyXG5cdFx0XHQkc2NvcGUuJG9uKCduZXctYWxlcnQnLCBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG5cclxuXHRcdFx0XHR2YXIgYWxlcnQgPSAkc2NvcGUuYWxlcnRzLnB1c2goe1xyXG5cdFx0XHRcdFx0dHlwZTogZGF0YS50eXBlLFxyXG5cdFx0XHRcdFx0Y2xvc2VhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdFx0bWVzc2FnZTogY29uZmlnLkVSUk9SU1tkYXRhLmNvZGVdXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZSgkc2NvcGUuYWxlcnRzLmluZGV4T2YoYWxlcnQpLCAxKTtcclxuXHJcblx0XHRcdFx0fSwgODAwMCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIEVESVQgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignVXNlckVkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gQlVHOiBpZiBjb3B5ICRhdXRoLnVzZXIsIHdlIHJlY2VpdmUgaXMgbm90IGFjY3VyYXRlIGRhdGFcclxuXHRcdFx0Ly8gSEFDSzogbm90IGNvcHkgKHN5bmMpXHJcblx0XHRcdCRzY29wZS5kYXRhID0gJGF1dGgudXNlcjtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogZWRpdCBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogdXBkYXRlIGRhdGFcclxuXHRcdFx0XHQkYXV0aC51cGRhdGVBY2NvdW50KCRzY29wZS5kYXRhKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLnBlcnNvbmFsJyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgJGF1dGgsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLmlzTXlQcm9maWxlID0gZmFsc2U7XHJcblxyXG5cdFx0XHRVc2VyLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IHJlcy5kYXRhO1xyXG5cdFx0XHRcdFx0aWYgKCRzY29wZS5kYXRhLmlkID09PSAkYXV0aC51c2VyLmlkKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc015UHJvZmlsZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyRW1haWxDb25maXJtYXRpb25DdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdFVzZXIuY29uZmlybWF0aW9uRW1haWwoJHN0YXRlUGFyYW1zLnRva2VuKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIGVycm9yXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuZXJyb3IgPSBjb25maWcuRVJST1JTW3Jlcy5kYXRhLmNvZGVdO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9sb2dpbkNvbnRyb2xsZXInKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcicpO1xyXG5cdHJlcXVpcmUoJy4vcGVyc29uYWxDb250cm9sbGVyJyk7XHJcblx0cmVxdWlyZSgnLi9lZGl0Q29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBMT0dJTiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyTG9naW5DdHJsJywgWyckc2NvcGUnLCAnJGF1dGgnLCBmdW5jdGlvbiAoJHNjb3BlLCAkYXV0aCkge1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBsb2dpbiBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogbG9naW5cclxuXHRcdFx0XHQkYXV0aC5zdWJtaXRMb2dpbigkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuXHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBlcnJyb3JcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUubG9naW5Gb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUEVSU09OQUwgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignVXNlclBlcnNvbmFsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdVc2VyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLnN0YXR1c2VzID0gY29uZmlnLlNUQVRVU0VTO1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9ICRhdXRoLnVzZXI7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJSZWdpc3RlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkYXV0aCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBuYW1lIHJvbGVzXHJcblx0XHRcdCRzY29wZS5yb2xlcyA9IGNvbmZpZy5ST0xFUztcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBbMSwgNCwgNSwgNl07XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IHJlZ2lzdGVyIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiByZWdpc3RlclxyXG5cdFx0XHRcdCRhdXRoLnN1Ym1pdFJlZ2lzdHJhdGlvbigkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3VzZXIucGVyc29uYWwnKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdC8qJHNjb3BlLnJlc2V0KCk7Ki9cclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5yZWdpc3RlckZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBESVJFQ1RJVkVTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGRpcmVjdGl2ZXNcclxuXHRcdC5kaXJlY3RpdmUoJ3VzZXJQYW5lbCcsIFsnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci1wYW5lbC5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnVXNlclBhbmVsQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcnBhbmVsJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmRpcmVjdGl2ZSgnYWxlcnRzU2VjdGlvbicsIFsnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHRcdHJlcGxhY2U6IHRydWUsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9hbGVydHMtc2VjdGlvbi5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnQWxlcnRzU2VjdGlvbkN0cmwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXJBczogJ2FsZXJ0c3NlY3Rpb24nXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZGlyZWN0aXZlKCdlcXVhbHMnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdFx0cmVxdWlyZTogJz9uZ01vZGVsJyxcclxuXHRcdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBuZ01vZGVsKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFuZ01vZGVsKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdFx0c2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhbGlkYXRlKCk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0YXR0cnMuJG9ic2VydmUoJ2VxdWFscycsIGZ1bmN0aW9uICh2YWwpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhbGlkYXRlKCk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gdmFsdWVzXHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZUZpcnN0ID0gbmdNb2RlbC4kdmlld1ZhbHVlO1xyXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVTZWNvbmQgPSBhdHRycy5lcXVhbHM7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBzZXQgdmFsaWRpdHlcclxuXHRcdFx0XHRcdFx0bmdNb2RlbC4kc2V0VmFsaWRpdHkoJ2VxdWFscycsICF2YWx1ZUZpcnN0IHx8ICF2YWx1ZVNlY29uZCB8fCB2YWx1ZUZpcnN0ID09PSB2YWx1ZVNlY29uZCk7XHJcblxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBGSUxURVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGZpbHRlcnNcclxuXHRcdC5maWx0ZXIoJ3J1YicsIFsnJGZpbHRlcicsICckbG9jYWxlJywgZnVuY3Rpb24gKCRmaWx0ZXIsICRsb2NhbGUpIHtcclxuXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAobnVtKSB7XHJcblx0XHRcdFx0cmV0dXJuICRmaWx0ZXIoJ251bWJlcicpKG51bSwgMikgKyAnPHNwYW4gY2xhc3M9XCJjdXJyZW5jeVwiPiDRgNGD0LEuPC9zcGFuPic7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogUk9VVEVTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdpbmRleCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy8nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9pbmRleC5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnaW5kZXgnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJzQwNCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy80MDQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy80MDQuaHRtbCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdCR1cmxSb3V0ZXJQcm92aWRlclxyXG5cdFx0XHRcdC5vdGhlcndpc2UoJy80MDQnKTtcclxuXHJcblx0XHRcdC8vIGludGVyY2VwdG9yc1xyXG5cdFx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdSZXNwb25zZUludGVyY2VwdG9yJyk7XHJcblx0XHRcdCRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ1Byb2dyZXNzSW50ZXJjZXB0b3InKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdVc2VyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiB2YWxpZGF0ZSB1c2VyXHJcblx0XHRcdFx0JGF1dGgudmFsaWRhdGVVc2VyKClcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmICghKCdkYXRhJyBpbiB0b1N0YXRlKSB8fCAhKCdhY2Nlc3MnIGluIHRvU3RhdGUuZGF0YSkpIHtcclxuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFVzZXIuY2hlY2tBY2Nlc3ModG9TdGF0ZS5kYXRhLmFjY2VzcywgZnJvbVN0YXRlLnVybCwgJGF1dGgudXNlci5yb2xlLCBmdW5jdGlvbiAoYWNjZXNzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFhY2Nlc3MpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0JGF1dGgudXNlci5yb2xlID0gMDtcclxuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWNjZXNzXHJcblx0XHRcdFx0XHRcdFVzZXIuY2hlY2tBY2Nlc3ModG9TdGF0ZS5kYXRhLmFjY2VzcywgZnJvbVN0YXRlLnVybCwgJGF1dGgudXNlci5yb2xlLCBmdW5jdGlvbiAoYWNjZXNzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghYWNjZXNzKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkcm9vdFNjb3BlLiRvbignYXV0aDpsb2dpbi1zdWNjZXNzJywgZnVuY3Rpb24gKGV2ZW50LCByZWFzb24pIHtcclxuXHJcblx0XHRcdFx0JHN0YXRlLmdvKCdpbmRleCcpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkcm9vdFNjb3BlLiRvbignYXV0aDpsb2dvdXQtc3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuXHRcdFx0XHQkYXV0aC51c2VyLnJvbGUgPSAwO1xyXG5cdFx0XHRcdC8vIGNoZWNrIGFjY2Vzc1xyXG5cdFx0XHRcdFVzZXIuY2hlY2tBY2Nlc3MoJHN0YXRlLmN1cnJlbnQuZGF0YS5hY2Nlc3MsICRzdGF0ZS5jdXJyZW50LnVybCwgJGF1dGgudXNlci5yb2xlLCBmdW5jdGlvbiAoYWNjZXNzKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFhY2Nlc3MpXHJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQUQgU0VSVklDRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy5hZCcsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQuZmFjdG9yeSgnQWQnLCBbJyRodHRwJywgJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNHZXRCeUlkKGlkKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWQvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NyZWF0ZShkYXRhKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkL2NyZWF0ZScsIGRhdGEpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGdldEJ5SWQ6IHB1YmxpY0dldEJ5SWQsXHJcblx0XHRcdFx0Y3JlYXRlOiBwdWJsaWNDcmVhdGVcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogU0VSVklDRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQvLyAuLi5cclxuXHRcdC8vIFRPRE86IGNvbW1vbiBpbnRlcmNlcHRvcnNcclxuXHRcdC5mYWN0b3J5KCdSZXNwb25zZUludGVyY2VwdG9yJywgWyckcScsICckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICdjb25maWcnLCBmdW5jdGlvbiAoJHEsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNSZXNwb25zZUVycm9yKHJlcykge1xyXG5cclxuXHRcdFx0XHQvLyBlcnJvciBhbGVydFxyXG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnbmV3LWFsZXJ0JywgXy5hc3NpZ24ocmVzLmRhdGEsIHtcclxuXHRcdFx0XHRcdHR5cGU6ICdkYW5nZXInXHJcblx0XHRcdFx0fSkpO1xyXG5cclxuXHRcdFx0XHRpZiAocmVzLnN0YXR1cyA9PT0gNDAxIHx8IHJlcy5zdGF0dXMgPT09IDQwMykge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvdXNlci9sb2dpbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvNDA0Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlcyk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3BvbnNlRXJyb3I6IHB1YmxpY1Jlc3BvbnNlRXJyb3JcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5mYWN0b3J5KCdQcm9ncmVzc0ludGVyY2VwdG9yJywgWyckcScsICckaW5qZWN0b3InLCAnY29uZmlnJywgZnVuY3Rpb24gKCRxLCAkaW5qZWN0b3IsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0dmFyIG5nUHJvZ3Jlc3MgPSBudWxsO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHJpdmF0ZUdldE5nUHJvZ3Jlc3MoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IGluaXQgcHJlbG9hZGVyXHJcblx0XHRcdFx0bmdQcm9ncmVzcyA9IG5nUHJvZ3Jlc3MgfHwgJGluamVjdG9yLmdldCgnbmdQcm9ncmVzc0ZhY3RvcnknKS5jcmVhdGVJbnN0YW5jZSgpO1xyXG5cdFx0XHRcdG5nUHJvZ3Jlc3Muc2V0SGVpZ2h0KGNvbmZpZy5MT0FERVJfSEVJR0hUKTtcclxuXHRcdFx0XHRuZ1Byb2dyZXNzLnNldENvbG9yKGNvbmZpZy5MT0FERVJfQ09MT1IpO1xyXG5cdFx0XHRcdHJldHVybiBuZ1Byb2dyZXNzO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgbmdQcm9ncmVzcyA9IHByaXZhdGVHZXROZ1Byb2dyZXNzKCk7XHJcblx0XHRcdFx0Ly8gVE9ETzogcHJlbG9hZGVyIGNvbXBsZXRlXHJcblx0XHRcdFx0bmdQcm9ncmVzcy5jb21wbGV0ZSgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVxdWVzdDogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHZhciBuZ1Byb2dyZXNzID0gcHJpdmF0ZUdldE5nUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdC8vIFRPRE86IHByZWxvYWRlciBzdGFydFxyXG5cdFx0XHRcdFx0bmdQcm9ncmVzcy5yZXNldCgpO1xyXG5cdFx0XHRcdFx0bmdQcm9ncmVzcy5zdGFydCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRyZXF1ZXN0RXJyb3I6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuICRxLnJlamVjdChyZXMpO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gJHEucmVqZWN0KHJlcyk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMudXNlcicsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQuZmFjdG9yeSgnVXNlcicsIFsnJGh0dHAnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkaHR0cCwgJHN0YXRlLCAkYXV0aCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNHZXRCeUlkKGlkKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci8nICsgaWQpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljQ2hlY2tBY2Nlc3MoYWNjZXNzLCBmcm9tVXJsLCByb2xlLCBjYWxsYmFjaykge1xyXG5cclxuXHRcdFx0XHRpZiAocm9sZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRyb2xlID0gY29uZmlnLkRFRkFVTFRfUk9MRTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChfLmluZGV4T2YoYWNjZXNzLCByb2xlKSA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKGZhbHNlKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoJGF1dGgudXNlci5zaWduZWRJbikge1xyXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2luZGV4Jyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3VzZXIubG9naW4nKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sodHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljQ29uZmlybWF0aW9uRW1haWwodG9rZW4pIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VyL3JlZ2lzdGVyLycgKyB0b2tlbik7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGdldEJ5SWQ6IHB1YmxpY0dldEJ5SWQsXHJcblx0XHRcdFx0Y2hlY2tBY2Nlc3M6IHB1YmxpY0NoZWNrQWNjZXNzLFxyXG5cdFx0XHRcdGNvbmZpcm1hdGlvbkVtYWlsOiBwdWJsaWNDb25maXJtYXRpb25FbWFpbFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXInLCBbXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vc2VydmljZXMvdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlci5sb2dpbicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlci5yZWdpc3RlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlci5wZXJzb25hbCcpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3VzZXInLFxyXG5cdFx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzx1aS12aWV3PicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci52aWV3Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzppZCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvdmlldy5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd1c2VyJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0aWQ6IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5sb2dpbicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5sb2dpbicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9sb2dpbicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvbG9naW4uaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckxvZ2luQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdsb2dpbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFBFUlNPTkFMXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogUGVyc29uYWwgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIucGVyc29uYWwnLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucGVyc29uYWwnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcGVyc29uYWwnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3BlcnNvbmFsLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJQZXJzb25hbEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAncGVyc29uYWwnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MudXNlclxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmVkaXQnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvZWRpdCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvZWRpdC5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyRWRpdEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnZWRpdCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy51c2VyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBSRUdJU1RFUlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlZ2lzdGVyIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyLnJlZ2lzdGVyJywgW10pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLnJlZ2lzdGVyJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9yZWdpc3Rlci5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyUmVnaXN0ZXJDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLmFub255bW91c1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmNvbmZpcm0nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXIvOnRva2VuJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9jb25maXJtLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJFbWFpbENvbmZpcm1hdGlvbkN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnY29uZmlybScsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdHRva2VuOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
