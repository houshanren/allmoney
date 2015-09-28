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
},{"./ad.create":2,"./controllers/ad":9,"./services/ad":22}],4:[function(require,module,exports){
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
			require('./ad').name,
			require('./catalog').name
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
},{"./ad":3,"./catalog":5,"./config":6,"./controllers":11,"./directives":18,"./filters":20,"./routes":21,"./services":24,"./user":26}],5:[function(require,module,exports){
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
},{"./controllers/catalog":10,"./directives/catalog":17,"./filters/catalog":19,"./services/catalog":23}],6:[function(require,module,exports){
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
			// filder ads
			AMOUNTS: [500, 1000000],
			TERMS: [0, 1825],
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
				9: 'Объявление не найдено.',
				10: 'Объявления не найдены.'
			},
			REPORTS: {
				'notspecified': 'Не указано',
				'noreviews': 'Нет ни одного отзыва :(',
				'noads': 'Нет ни одного объявления :(',
				'howtoget': 'Как получить?'
			},
			// loader
			LOADER_HEIGHT: '3px',
			LOADER_COLOR: '#0059ba'
		});

	// requires

})();
},{"./access.json":1}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"./createController":7,"./editController":8}],10:[function(require,module,exports){
/**
 * CATALOG CONTROLLERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.controllers.catalog', [])
		// TODO: common controllers
		.controller('CatalogCtrl', ['$scope', '$stateParams', 'Catalog', 'config', function ($scope, $stateParams, Catalog, config) {

			// define
			$scope.reports = config.REPORTS;
			$scope.cities = config.CITIES;
			$scope.citiesCodes = [0, 1, 2, 3, 4, 5, 6, 7];
			$scope.amounts = config.AMOUNTS;
			$scope.terms = config.TERMS;

			$scope.data = {};
			$scope.ads = [];

			Catalog.getAds($stateParams.category)
				.then(function (res) {

					// success
					$scope.ads = res.data;
					if (!$scope.ads.length)
						$scope.ads = false;

				}, function (res) {

					// error

				});

		}])
		.controller('CatalogAdCtrl', ['$scope', '$state', 'config', function ($scope, $state, config) {

			// define
			$scope.reports = config.REPORTS;
			$scope.termUnits = config.TERM_UNITS;
			$scope.rateUnits = config.RATE_UNITS;
			$scope.periodUnits = config.PERIOD_UNITS;
			$scope.securityTypes = config.SECURITY_TYPES;
			$scope.waygetTypes = config.WAYGET_TYPES;

		}]);

	// requires

})();
},{}],11:[function(require,module,exports){
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
			$scope.citiesCodes = [0, 1, 2, 3, 4, 5, 6, 7];

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

		}])
		.controller('SidebarCtrl', ['$scope', 'config', function ($scope, config) {

			// ...

		}]);

	// requires

})();
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{"./editController":12,"./loginController":14,"./personalController":15,"./registerController":16}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
/**
 * CATALOG DIRECTIVES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.directives.catalog', [])
		// TODO: common directives
		.directive('ad', ['$state', 'config', function ($state, config) {

			return {
				restrict: 'E',
				replace: true,
				scope: {
					ad: '='
				},
				templateUrl: 'partials/catalog/ad.html',
				controller: 'CatalogAdCtrl',
				controllerAs: 'ad'
			};

		}]);

	// requires

})();
},{}],18:[function(require,module,exports){
/**
 * DIRECTIVES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.directives', [])
		// TODO: common directives
		.directive('userPanel', ['config', function (config) {

			return {
				restrict: 'A',
				templateUrl: 'partials/user-panel.html',
				controller: 'UserPanelCtrl',
				controllerAs: 'userpanel'
			};

		}])
		.directive('alertsSection', ['config', function (config) {

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

		})
		.directive('sidebar', ['config', function (config) {

			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'partials/sidebar.html',
				controller: 'SidebarCtrl',
				controllerAs: 'sidebar'
			};

		}]);

	// requires

})();
},{}],19:[function(require,module,exports){
/**
 * CATALOG FILTERS
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.filters.catalog', [])
		// TODO: common filters
		.filter('adCity', [function () {

			return function () {
				
				// ...

				return;

			};

		}]);

	// requires

})();
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
/**
 * CATALOG SERVICES
 */

'use strict';

(function () {

	module.exports = angular
		.module('app.services.catalog', [])
		// TODO: common services
		.factory('Catalog', ['$http', '$state', 'config', function ($http, $state, config) {

			function publicGetAds(category) {

				return $http.get('/api/catalog/' + category);

			}

			// ...

			return {
				getAds: publicGetAds
			};

		}]);

	// requires

})();
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{"./controllers/user":13,"./services/user":25,"./user.login":27,"./user.personal":28,"./user.register":29}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hZC5jcmVhdGUuanMiLCJzcmMvYXBwL2FkLmpzIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NhdGFsb2cuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvYWQvY3JlYXRlQ29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvYWQvZWRpdENvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL2FkL2luZGV4LmpzIiwic3JjL2FwcC9jb250cm9sbGVycy9jYXRhbG9nL2luZGV4LmpzIiwic3JjL2FwcC9jb250cm9sbGVycy9pbmRleC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9lZGl0Q29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9pbmRleC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvcGVyc29uYWxDb250cm9sbGVyLmpzIiwic3JjL2FwcC9jb250cm9sbGVycy91c2VyL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9jYXRhbG9nL2luZGV4LmpzIiwic3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL2FwcC9maWx0ZXJzL2NhdGFsb2cvaW5kZXguanMiLCJzcmMvYXBwL2ZpbHRlcnMvaW5kZXguanMiLCJzcmMvYXBwL3JvdXRlcy5qcyIsInNyYy9hcHAvc2VydmljZXMvYWQvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL2NhdGFsb2cvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL2luZGV4LmpzIiwic3JjL2FwcC9zZXJ2aWNlcy91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIiwic3JjL2FwcC91c2VyLmxvZ2luLmpzIiwic3JjL2FwcC91c2VyLnBlcnNvbmFsLmpzIiwic3JjL2FwcC91c2VyLnJlZ2lzdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9LyoqXHJcbiAqIFJPTEVTOlxyXG4gKiAwIC0gYW5vbnltb3VzXHJcbiAqIDEgLSB1c2VyXHJcbiAqIDIgLSBtb2RlcmF0b3JcclxuICogMyAtIGFkbWluXHJcbiAqIDQgLSBwcml2YXRlIHBlcnNvbiAocHApXHJcbiAqIDUgLSBtaWNyb2ZpbmFuY2Ugb3JnYW5pemF0aW9uIChtZmkpXHJcbiAqIDYgLSBwYXduc2hvcCAocHMpXHJcbiAqL1xyXG5cclxue1xyXG5cdFwicHVibGljXCI6IFswLCAxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImFub255bW91c1wiOiBbMF0sXHJcblx0XCJ1c2VyXCI6IFsxLCAyLCAzLCA0LCA1LCA2XSxcclxuXHRcImxlbmRlclwiOiBbNCwgNSwgNl0sXHJcblx0XCJhZG1pblwiOiBbM11cclxufSIsIi8qKlxyXG4gKiBBRCBDUkVBVEVcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmFkLmNyZWF0ZScsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgnYWQuY3JlYXRlJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL2NyZWF0ZScsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2FkL2NyZWF0ZS5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdBZENyZWF0ZUN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnY3JlYXRlJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLmxlbmRlclxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFEXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQWQgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmFkJywgW1xyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2FkJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcy9hZCcpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vYWQuY3JlYXRlJykubmFtZVxyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2FkJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL2FkJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ2FkLnZpZXcnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvOmlkJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvYWQvdmlldy5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdBZEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnYWQnLFxyXG5cdFx0XHRcdFx0cGFyYW1zOiAge1xyXG5cdFx0XHRcdFx0XHRpZDoge1xyXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdHNxdWFzaDogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQVBQTElDQVRJT05cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBBcHAgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFtcclxuXHRcdFx0J3VpLnJvdXRlcicsXHJcblx0XHRcdC8vIGluc3RlYWQgbmdDb29raWVzIGh0dHBzOi8vZ2l0aHViLmNvbS9seW5uZHlsYW5odXJsZXkvbmctdG9rZW4tYXV0aCN3aHktZG9lcy10aGlzLW1vZHVsZS11c2UtaXBjb29raWVzLWluc3RlYWQtb2Ytbmdjb29raWVzXHJcblx0XHRcdCduZy10b2tlbi1hdXRoJyxcclxuXHRcdFx0Ly8gZG9tXHJcblx0XHRcdCduZ1Nhbml0aXplJyxcclxuXHRcdFx0J25nUHJvZ3Jlc3MnLFxyXG5cdFx0XHQndWkuYm9vdHN0cmFwJyxcclxuXHRcdFx0J3VpLnNlbGVjdCcsXHJcblx0XHRcdCdjaGVja2xpc3QtbW9kZWwnLFxyXG5cdFx0XHQvLyB2YWx1ZXMgJiBjb25zdGFudHNcclxuXHRcdFx0cmVxdWlyZSgnLi9jb25maWcnKS5uYW1lLFxyXG5cdFx0XHQvLyBjb21wb25lbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzJykubmFtZSxcclxuXHRcdFx0Ly8gbW9kdWxlc1xyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2FkJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9jYXRhbG9nJykubmFtZVxyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckbG9jYXRpb25Qcm92aWRlcicsICckYXV0aFByb3ZpZGVyJywgJyRwcm92aWRlJywgZnVuY3Rpb24gKCRsb2NhdGlvblByb3ZpZGVyLCAkYXV0aFByb3ZpZGVyLCAkcHJvdmlkZSkge1xyXG5cclxuXHRcdFx0JGxvY2F0aW9uUHJvdmlkZXJcclxuXHRcdFx0XHQuaHRtbDVNb2RlKHRydWUpO1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogYXV0aCBjb25maWdcclxuXHRcdFx0JGF1dGhQcm92aWRlci5jb25maWd1cmUoe1xyXG5cdFx0XHRcdC8vIGxvY2FsaG9zdFxyXG5cdFx0XHRcdGFwaVVybDogJy9hcGknLFxyXG5cdFx0XHRcdHRva2VuVmFsaWRhdGlvblBhdGg6ICcvdXNlci92YWxpZGF0ZScsXHJcbiAgXHRcdFx0XHRzaWduT3V0VXJsOiAnL3VzZXIvc2lnbm91dCcsXHJcbiAgXHRcdFx0XHRlbWFpbFJlZ2lzdHJhdGlvblBhdGg6ICcvdXNlci9yZWdpc3RlcicsXHJcblx0XHRcdFx0YWNjb3VudFVwZGF0ZVBhdGg6ICcvdXNlci91cGRhdGUnLFxyXG5cdFx0XHRcdGFjY291bnREZWxldGVQYXRoOiAnL3VzZXIvZGVsZXRlJyxcclxuXHRcdFx0XHRwYXNzd29yZFJlc2V0UGF0aDogJy91c2VyL3Bhc3N3b3JkJyxcclxuXHRcdFx0XHRwYXNzd29yZFVwZGF0ZVBhdGg6ICcvdXNlci9wYXNzd29yZCcsXHJcblx0XHRcdFx0ZW1haWxTaWduSW5QYXRoOiAnL3VzZXIvc2lnbmluJyxcclxuXHJcblx0XHRcdFx0dG9rZW5Gb3JtYXQ6IHtcclxuXHRcdFx0XHRcdFwiYWNjZXNzLXRva2VuXCI6IFwie3sgdG9rZW4gfX1cIixcclxuXHRcdFx0XHRcdFwidG9rZW4tdHlwZVwiOiBcIkJlYXJlclwiLFxyXG5cdFx0XHRcdFx0XCJleHBpcnlcIjogXCJ7eyBleHBpcnkgfX1cIixcclxuXHRcdFx0XHRcdFwidWlkXCI6IFwie3sgdWlkIH19XCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhhbmRsZUxvZ2luUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhhbmRsZUFjY291bnRVcGRhdGVSZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGhhbmRsZVRva2VuVmFsaWRhdGlvblJlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBIQUNLOiByZWRlZmluZSB1aS1ib290c3RyYXAgdGVtcGxhdGVzXHJcblx0XHRcdCRwcm92aWRlLmRlY29yYXRvcignYWxlcnREaXJlY3RpdmUnLCBmdW5jdGlvbiAoJGRlbGVnYXRlKSB7XHJcblxyXG5cdFx0XHRcdCRkZWxlZ2F0ZVswXS50ZW1wbGF0ZVVybCA9ICdwYXJ0aWFscy9hbGVydC5odG1sJztcclxuXHRcdFx0XHRyZXR1cm4gJGRlbGVnYXRlO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vcm91dGVzJyk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDQVRBTE9HXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQ2F0YWxvZyBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY2F0YWxvZycsIFtcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycy9jYXRhbG9nJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcy9jYXRhbG9nJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NhdGFsb2cnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMvY2F0YWxvZycpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdjYXRhbG9nJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL2NhdGFsb2cnLFxyXG5cdFx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzx1aS12aWV3PicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgnY2F0YWxvZy52aWV3Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzpjYXRlZ29yeScsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2NhdGFsb2cvdmlldy5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdDYXRhbG9nQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdjYXRhbG9nJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0Y2F0ZWdvcnk6IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTkZJR1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbmZpZyBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0Ly8gbWFpblxyXG5cdFx0XHROQU1FOiAnQUxMTU9ORVknLFxyXG5cdFx0XHRERUJVRzogdHJ1ZSxcclxuXHRcdFx0Ly8gZm9yIHVzZXJzXHJcblx0XHRcdFJPTEVTOiBbXHJcblx0XHRcdFx0J9CQ0L3QvtC90LjQvNGD0YEnLFxyXG5cdFx0XHRcdCfQn9C+0LvRjNC30L7QstCw0YLQtdC70YwnLFxyXG5cdFx0XHRcdCfQnNC+0LTQtdGA0LDRgtC+0YAnLFxyXG5cdFx0XHRcdCfQkNC00LzQuNC90LjRgdGC0YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9Cn0LDRgdGC0L3QvtC1INC70LjRhtC+JyxcclxuXHRcdFx0XHQn0JzQpNCeJyxcclxuXHRcdFx0XHQn0JvQvtC80LHQsNGA0LQnXHJcblx0XHRcdF0sXHJcblx0XHRcdERFRkFVTFRfUk9MRTogMCxcclxuXHRcdFx0QUNDRVNTOiByZXF1aXJlKCcuL2FjY2Vzcy5qc29uJyksXHJcblx0XHRcdFNUQVRVU0VTOiBbXHJcblx0XHRcdFx0J9Cd0LUg0L/QvtC00YLQstC10YDQttC00LXQvScsXHJcblx0XHRcdFx0J9Cd0LUg0L/RgNC+0LLQtdGA0LXQvScsXHJcblx0XHRcdFx0J9Cd0LAg0LzQvtC00LXRgNCw0YbQuNC4JyxcclxuXHRcdFx0XHQn0JDQutGC0LjQstC10L0nLFxyXG5cdFx0XHRcdCfQl9Cw0LzQvtGA0L7QttC10L0nXHJcblx0XHRcdF0sXHJcblx0XHRcdC8vIGZvciBhZHNcclxuXHRcdFx0Q0lUSUVTOiBbXHJcblx0XHRcdFx0J9CS0YHQtSDQs9C+0YDQvtC00LAnLFxyXG5cdFx0XHRcdCfQnNC+0YHQutCy0LAnLFxyXG5cdFx0XHRcdCfQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsycsXHJcblx0XHRcdFx0J9Cd0L7QstC+0YHQuNCx0LjRgNGB0LonLFxyXG5cdFx0XHRcdCfQndC40LbQvdC40Lkt0J3QvtCy0LPQvtGA0L7QtCcsXHJcblx0XHRcdFx0J9Ca0YDQsNGB0L3QvtGP0YDRgdC6JyxcclxuXHRcdFx0XHQn0JrQsNC30LDQvdGMJyxcclxuXHRcdFx0XHQn0JXQutCw0YLQtdGA0LjQvdCx0YPRgNCzJ1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRURVJNX1VOSVRTOiBbXHJcblx0XHRcdFx0J9CU0L3QtdC5J1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRSQVRFX1VOSVRTOiBbXHJcblx0XHRcdFx0J9CSINC00LXQvdGMJyxcclxuXHRcdFx0XHQn0JIg0LzQtdGB0Y/RhicsXHJcblx0XHRcdFx0J9CSINCz0L7QtCdcclxuXHRcdFx0XSxcclxuXHRcdFx0UEVSSU9EX1VOSVRTOiBbXHJcblx0XHRcdFx0J9Cc0LjQvdGD0YInLFxyXG5cdFx0XHRcdCfQp9Cw0YHQvtCyJyxcclxuXHRcdFx0XHQn0JTQvdC10LknXHJcblx0XHRcdF0sXHJcblx0XHRcdFNFQ1VSSVRZX1RZUEVTOiBbXHJcblx0XHRcdFx0J9Cg0LDRgdC/0LjRgdC60LAnLFxyXG5cdFx0XHRcdCfQl9Cw0LvQvtCzJ1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRXQVlHRVRfVFlQRVM6IFtcclxuXHRcdFx0XHQn0J3QsNC70LjRh9C90YvQvNC4JyxcclxuXHRcdFx0XHQn0J7QvdC70LDQudC9J1xyXG5cdFx0XHRdLFxyXG5cdFx0XHQvLyBmaWxkZXIgYWRzXHJcblx0XHRcdEFNT1VOVFM6IFs1MDAsIDEwMDAwMDBdLFxyXG5cdFx0XHRURVJNUzogWzAsIDE4MjVdLFxyXG5cdFx0XHQvLyBoYW5kbGVyXHJcblx0XHRcdEVSUk9SUzoge1xyXG5cdFx0XHRcdDA6ICfQndC10LjQt9Cy0LXRgdGC0L3QsNGPINC+0YjQuNCx0LrQsC4nLFxyXG5cdFx0XHRcdDE6ICfQntGI0LjQsdC60LAg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDI6ICfQndC10LLQtdGA0L3Ri9C5INGC0L7QutC10L0g0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDM6ICfQmtC+0LQg0L/QvtC00YLQstC10YDQttC00LXQvdC40Y8g0L3QtSDQvdCw0LnQtNC10L0sINCx0YvQuyDQsNC60YLQuNCy0LjRgNC+0LLQsNC9INGA0LDQvdC10LUg0LjQu9C4INC40YHRgtC10Log0YHRgNC+0Log0LTQtdC50YHRgtCy0LjRjyDQutC+0LTQsCDQsNC60YLQuNCy0LDRhtC40LguJyxcclxuXHRcdFx0XHQ0OiAn0JLQstC10LTQtdC9INC90LXQstC10YDQvdGL0LkgZW1haWwg0LjQu9C4INC/0LDRgNC+0LvRjC4nLFxyXG5cdFx0XHRcdDU6ICfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDRg9GH0LXRgtC90L7QuSDQt9Cw0L/QuNGB0LguINCf0L7QttCw0LvRg9C50YHRgtCwINC/0YDQvtCy0LXRgNGM0YLQtSDQstCy0LXQtNC10L3QvdGL0LUg0LTQsNC90L3Ri9C1LicsXHJcblx0XHRcdFx0NjogJ9Cf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQvdC1INC90LDQudC00LXQvS4nLFxyXG5cdFx0XHRcdDc6ICfQntGI0LjQsdC60LAg0L7QsdC90L7QstC70LXQvdC40Y8g0YPRh9C10YLQvdC+0Lkg0LfQsNC/0LjRgdC4LiDQn9C+0LbQsNC70YPQudGB0YLQsCDQv9GA0L7QstC10YDRjNGC0LUg0LLQstC10LTQtdC90L3Ri9C1INC00LDQvdC90YvQtS4nLFxyXG5cdFx0XHRcdDg6ICfQntGI0LjQsdC60LAg0YHQvtC30LTQsNC90LjRjyDQvtCx0YrRj9Cy0LvQtdC90LjRjy4g0J/QvtC20LDQu9GD0LnRgdGC0LAg0L/RgNC+0LLQtdGA0YzRgtC1INCy0LLQtdC00LXQvdC90YvQtSDQtNCw0L3QvdGL0LUuJyxcclxuXHRcdFx0XHQ5OiAn0J7QsdGK0Y/QstC70LXQvdC40LUg0L3QtSDQvdCw0LnQtNC10L3Qvi4nLFxyXG5cdFx0XHRcdDEwOiAn0J7QsdGK0Y/QstC70LXQvdC40Y8g0L3QtSDQvdCw0LnQtNC10L3Riy4nXHJcblx0XHRcdH0sXHJcblx0XHRcdFJFUE9SVFM6IHtcclxuXHRcdFx0XHQnbm90c3BlY2lmaWVkJzogJ9Cd0LUg0YPQutCw0LfQsNC90L4nLFxyXG5cdFx0XHRcdCdub3Jldmlld3MnOiAn0J3QtdGCINC90Lgg0L7QtNC90L7Qs9C+INC+0YLQt9GL0LLQsCA6KCcsXHJcblx0XHRcdFx0J25vYWRzJzogJ9Cd0LXRgiDQvdC4INC+0LTQvdC+0LPQviDQvtCx0YrRj9Cy0LvQtdC90LjRjyA6KCcsXHJcblx0XHRcdFx0J2hvd3RvZ2V0JzogJ9Ca0LDQuiDQv9C+0LvRg9GH0LjRgtGMPydcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gbG9hZGVyXHJcblx0XHRcdExPQURFUl9IRUlHSFQ6ICczcHgnLFxyXG5cdFx0XHRMT0FERVJfQ09MT1I6ICcjMDA1OWJhJ1xyXG5cdFx0fSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBBRCBDUkVBVEUgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMuYWQnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0FkQ3JlYXRlQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdBZCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBBZCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUudXNlciA9ICRhdXRoLnVzZXI7XHJcblxyXG5cdFx0XHQvLyBzZWxlY3RzXHJcblx0XHRcdC8vIHRlcm0gdW5pdHNcclxuXHRcdFx0JHNjb3BlLnRlcm1Vbml0cyA9IGNvbmZpZy5URVJNX1VOSVRTO1xyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlVGVybVVuaXRzID0gWzBdO1xyXG5cdFx0XHQvLyByYXRlIHVuaXRzXHJcblx0XHRcdCRzY29wZS5yYXRlVW5pdHMgPSBjb25maWcuUkFURV9VTklUUztcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZVJhdGVVbml0cyA9IFswLCAxLCAyXTtcclxuXHRcdFx0Ly8gcGVyaW9kIHVuaXRzXHJcblx0XHRcdCRzY29wZS5wZXJpb2RVbml0cyA9IGNvbmZpZy5QRVJJT0RfVU5JVFM7XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVQZXJpb2RVbml0cyA9IFswLCAxLCAyXTtcclxuXHRcdFx0Ly8gc2VjdXJpdHlcclxuXHRcdFx0JHNjb3BlLnNlY3VyaXR5VHlwZXMgPSBjb25maWcuU0VDVVJJVFlfVFlQRVM7XHJcblx0XHRcdCRzY29wZS5zZWN1cml0eUNvZGVzID0gWzAsIDFdO1xyXG5cdFx0XHQvLyB3YXlnZXRcclxuXHRcdFx0JHNjb3BlLndheWdldFR5cGVzID0gY29uZmlnLldBWUdFVF9UWVBFUztcclxuXHRcdFx0JHNjb3BlLndheWdldENvZGVzID0gWzAsIDFdO1xyXG5cdFx0XHQvLyBjaXRpZXNcclxuXHRcdFx0JHNjb3BlLmNpdGllcyA9IGNvbmZpZy5DSVRJRVM7XHJcblx0XHRcdCRzY29wZS5jaXRpZXNDb2RlcyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcclxuXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge1xyXG5cdFx0XHRcdHRlcm06IHtcclxuXHRcdFx0XHRcdHVuaXQ6IDBcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJhdGU6IHtcclxuXHRcdFx0XHRcdHVuaXQ6IDBcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHBlcmlvZDoge1xyXG5cdFx0XHRcdFx0dW5pdDogMFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBjcmVhdGUgc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IGNyZWF0ZVxyXG5cdFx0XHRcdEFkLmNyZWF0ZSgkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHRcdFx0JHNjb3BlLnJlc2V0KCk7XHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygndXNlci5wZXJzb25hbCcpO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLmNyZWF0ZUZvcm0uJHNldFVudG91Y2hlZCgpO1xyXG5cdFx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQUQgRURJVCBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy5hZCcpXHJcblx0XHQuY29udHJvbGxlcignQWRFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBlZGl0IHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiB1cGRhdGUgZGF0YVxyXG5cdFx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBBRCBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLmFkJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdBZEN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJywgJ0FkJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHN0YXRlLCBBZCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyBkZWZpbmVcclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLnRlcm1Vbml0cyA9IGNvbmZpZy5URVJNX1VOSVRTO1xyXG5cdFx0XHQkc2NvcGUucmF0ZVVuaXRzID0gY29uZmlnLlJBVEVfVU5JVFM7XHJcblx0XHRcdCRzY29wZS5wZXJpb2RVbml0cyA9IGNvbmZpZy5QRVJJT0RfVU5JVFM7XHJcblx0XHRcdCRzY29wZS5zZWN1cml0eVR5cGVzID0gY29uZmlnLlNFQ1VSSVRZX1RZUEVTO1xyXG5cdFx0XHQkc2NvcGUud2F5Z2V0VHlwZXMgPSBjb25maWcuV0FZR0VUX1RZUEVTO1xyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHJcblx0XHRcdEFkLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IHJlcy5kYXRhO1xyXG5cclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZXJyb3JcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vY3JlYXRlQ29udHJvbGxlcicpO1xyXG5cdHJlcXVpcmUoJy4vZWRpdENvbnRyb2xsZXInKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENBVEFMT0cgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy5jYXRhbG9nJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdDYXRhbG9nQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdDYXRhbG9nJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ2F0YWxvZywgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyBkZWZpbmVcclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLmNpdGllcyA9IGNvbmZpZy5DSVRJRVM7XHJcblx0XHRcdCRzY29wZS5jaXRpZXNDb2RlcyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcclxuXHRcdFx0JHNjb3BlLmFtb3VudHMgPSBjb25maWcuQU1PVU5UUztcclxuXHRcdFx0JHNjb3BlLnRlcm1zID0gY29uZmlnLlRFUk1TO1xyXG5cclxuXHRcdFx0JHNjb3BlLmRhdGEgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmFkcyA9IFtdO1xyXG5cclxuXHRcdFx0Q2F0YWxvZy5nZXRBZHMoJHN0YXRlUGFyYW1zLmNhdGVnb3J5KVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuYWRzID0gcmVzLmRhdGE7XHJcblx0XHRcdFx0XHRpZiAoISRzY29wZS5hZHMubGVuZ3RoKVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUuYWRzID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdDYXRhbG9nQWRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyBkZWZpbmVcclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLnRlcm1Vbml0cyA9IGNvbmZpZy5URVJNX1VOSVRTO1xyXG5cdFx0XHQkc2NvcGUucmF0ZVVuaXRzID0gY29uZmlnLlJBVEVfVU5JVFM7XHJcblx0XHRcdCRzY29wZS5wZXJpb2RVbml0cyA9IGNvbmZpZy5QRVJJT0RfVU5JVFM7XHJcblx0XHRcdCRzY29wZS5zZWN1cml0eVR5cGVzID0gY29uZmlnLlNFQ1VSSVRZX1RZUEVTO1xyXG5cdFx0XHQkc2NvcGUud2F5Z2V0VHlwZXMgPSBjb25maWcuV0FZR0VUX1RZUEVTO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ01haW5DdHJsJywgWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAobG9jYXRpb24pIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGxvY2F0aW9uID09PSAkbG9jYXRpb24ucGF0aCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdJbmRleEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkYXV0aCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNpdGllc0NvZGVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cclxuXHRcdFx0Ly8gVEVNUDogZGVmaW5lIGxvY2F0aW9uXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyUGFuZWxDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLmhhbmRsZVNpZ25PdXRCdG5DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JGF1dGguc2lnbk91dCgpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignQWxlcnRzU2VjdGlvbkN0cmwnLCBbJyRzY29wZScsICckdGltZW91dCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuYWxlcnRzID0gW107XHJcblxyXG5cdFx0XHQvLyBjbG9zZSBhbGVydFxyXG5cdFx0XHQkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogY2hlY2tpbmcgbmV3IGFsbGVydFxyXG5cdFx0XHQkc2NvcGUuJG9uKCduZXctYWxlcnQnLCBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG5cclxuXHRcdFx0XHR2YXIgYWxlcnQgPSAkc2NvcGUuYWxlcnRzLnB1c2goe1xyXG5cdFx0XHRcdFx0dHlwZTogZGF0YS50eXBlLFxyXG5cdFx0XHRcdFx0Y2xvc2VhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdFx0bWVzc2FnZTogY29uZmlnLkVSUk9SU1tkYXRhLmNvZGVdXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHQkc2NvcGUuYWxlcnRzLnNwbGljZSgkc2NvcGUuYWxlcnRzLmluZGV4T2YoYWxlcnQpLCAxKTtcclxuXHJcblx0XHRcdFx0fSwgODAwMCk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIFsnJHNjb3BlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBFRElUIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIEJVRzogaWYgY29weSAkYXV0aC51c2VyLCB3ZSByZWNlaXZlIGlzIG5vdCBhY2N1cmF0ZSBkYXRhXHJcblx0XHRcdC8vIEhBQ0s6IG5vdCBjb3B5IChzeW5jKVxyXG5cdFx0XHQkc2NvcGUuZGF0YSA9ICRhdXRoLnVzZXI7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGVkaXQgc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHVwZGF0ZSBkYXRhXHJcblx0XHRcdFx0JGF1dGgudXBkYXRlQWNjb3VudCgkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygndXNlci5wZXJzb25hbCcpO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignVXNlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJywgJyRhdXRoJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsICRhdXRoLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5yZXBvcnRzID0gY29uZmlnLlJFUE9SVFM7XHJcblx0XHRcdCRzY29wZS5pc015UHJvZmlsZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0VXNlci5nZXRCeUlkKCRzdGF0ZVBhcmFtcy5pZClcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG5cdFx0XHRcdFx0JHNjb3BlLmRhdGEgPSByZXMuZGF0YTtcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUuZGF0YS5pZCA9PT0gJGF1dGgudXNlci5pZCkge1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNNeVByb2ZpbGUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gZXJyb3JcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29udHJvbGxlcignVXNlckVtYWlsQ29uZmlybWF0aW9uQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdVc2VyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgVXNlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRVc2VyLmNvbmZpcm1hdGlvbkVtYWlsKCRzdGF0ZVBhcmFtcy50b2tlbilcclxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG5cdFx0XHRcdFx0JHNjb3BlLmNvbmZpcm1lZCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cdFx0XHRcdFx0JHNjb3BlLmNvbmZpcm1lZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0JHNjb3BlLmVycm9yID0gY29uZmlnLkVSUk9SU1tyZXMuZGF0YS5jb2RlXTtcclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vbG9naW5Db250cm9sbGVyJyk7XHJcblx0cmVxdWlyZSgnLi9yZWdpc3RlckNvbnRyb2xsZXInKTtcclxuXHRyZXF1aXJlKCcuL3BlcnNvbmFsQ29udHJvbGxlcicpO1xyXG5cdHJlcXVpcmUoJy4vZWRpdENvbnRyb2xsZXInKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU4gQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignVXNlckxvZ2luQ3RybCcsIFsnJHNjb3BlJywgJyRhdXRoJywgZnVuY3Rpb24gKCRzY29wZSwgJGF1dGgpIHtcclxuXHJcblx0XHRcdCRzY29wZS5pbml0aWFsID0ge307XHJcblx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogbG9naW4gc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IGxvZ2luXHJcblx0XHRcdFx0JGF1dGguc3VibWl0TG9naW4oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gZXJycm9yXHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5sb2dpbkZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFBFUlNPTkFMIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJQZXJzb25hbEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5yZXBvcnRzID0gY29uZmlnLlJFUE9SVFM7XHJcblx0XHRcdCRzY29wZS5zdGF0dXNlcyA9IGNvbmZpZy5TVEFUVVNFUztcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSAkYXV0aC51c2VyO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBSRUdJU1RFUiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyUmVnaXN0ZXJDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gVE9ETzogbmFtZSByb2xlc1xyXG5cdFx0XHQkc2NvcGUucm9sZXMgPSBjb25maWcuUk9MRVM7XHJcblx0XHRcdC8vIGRlZmluZSBmb3IgZ3Vlc3RcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZVJvbGVzID0gWzEsIDQsIDUsIDZdO1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiByZWdpc3RlciBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogcmVnaXN0ZXJcclxuXHRcdFx0XHQkYXV0aC5zdWJtaXRSZWdpc3RyYXRpb24oJHNjb3BlLmRhdGEpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLnBlcnNvbmFsJyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIHJlc2V0IGZvcm1cclxuXHRcdFx0XHQvKiRzY29wZS5yZXNldCgpOyovXHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUucmVnaXN0ZXJGb3JtLiRzZXRQcmlzdGluZSgpO1xyXG5cdFx0XHRcdCRzY29wZS5yZWdpc3RlckZvcm0uJHNldFVudG91Y2hlZCgpO1xyXG5cdFx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ0FUQUxPRyBESVJFQ1RJVkVTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuZGlyZWN0aXZlcy5jYXRhbG9nJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZGlyZWN0aXZlc1xyXG5cdFx0LmRpcmVjdGl2ZSgnYWQnLCBbJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlLCBjb25maWcpIHtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0XHRyZXBsYWNlOiB0cnVlLFxyXG5cdFx0XHRcdHNjb3BlOiB7XHJcblx0XHRcdFx0XHRhZDogJz0nXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2NhdGFsb2cvYWQuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ0NhdGFsb2dBZEN0cmwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXJBczogJ2FkJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIERJUkVDVElWRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZGlyZWN0aXZlc1xyXG5cdFx0LmRpcmVjdGl2ZSgndXNlclBhbmVsJywgWydjb25maWcnLCBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnQScsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyLXBhbmVsLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyUGFuZWxDdHJsJyxcclxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICd1c2VycGFuZWwnXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZGlyZWN0aXZlKCdhbGVydHNTZWN0aW9uJywgWydjb25maWcnLCBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2FsZXJ0cy1zZWN0aW9uLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdBbGVydHNTZWN0aW9uQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnYWxlcnRzc2VjdGlvbidcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5kaXJlY3RpdmUoJ2VxdWFscycsIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0XHRyZXF1aXJlOiAnP25nTW9kZWwnLFxyXG5cdFx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIG5nTW9kZWwpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoIW5nTW9kZWwpIHJldHVybjtcclxuXHJcblx0XHRcdFx0XHRzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdFx0dmFsaWRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRhdHRycy4kb2JzZXJ2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKHZhbCkge1xyXG5cclxuXHRcdFx0XHRcdFx0dmFsaWRhdGUoKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyB2YWx1ZXNcclxuXHRcdFx0XHRcdFx0dmFyIHZhbHVlRmlyc3QgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZVNlY29uZCA9IGF0dHJzLmVxdWFscztcclxuXHJcblx0XHRcdFx0XHRcdC8vIHNldCB2YWxpZGl0eVxyXG5cdFx0XHRcdFx0XHRuZ01vZGVsLiRzZXRWYWxpZGl0eSgnZXF1YWxzJywgIXZhbHVlRmlyc3QgfHwgIXZhbHVlU2Vjb25kIHx8IHZhbHVlRmlyc3QgPT09IHZhbHVlU2Vjb25kKTtcclxuXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KVxyXG5cdFx0LmRpcmVjdGl2ZSgnc2lkZWJhcicsIFsnY29uZmlnJywgZnVuY3Rpb24gKGNvbmZpZykge1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHRcdHJlcGxhY2U6IHRydWUsXHJcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9zaWRlYmFyLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdTaWRlYmFyQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnc2lkZWJhcidcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDQVRBTE9HIEZJTFRFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5maWx0ZXJzLmNhdGFsb2cnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBmaWx0ZXJzXHJcblx0XHQuZmlsdGVyKCdhZENpdHknLCBbZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBGSUxURVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuZmlsdGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGZpbHRlcnNcclxuXHRcdC5maWx0ZXIoJ3J1YicsIFsnJGZpbHRlcicsICckbG9jYWxlJywgZnVuY3Rpb24gKCRmaWx0ZXIsICRsb2NhbGUpIHtcclxuXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAobnVtKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkZmlsdGVyKCdudW1iZXInKShudW0sIDIpICsgJzxzcGFuIGNsYXNzPVwiY3VycmVuY3lcIj4g0YDRg9CxLjwvc3Bhbj4nO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFJPVVRFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGh0dHBQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgnaW5kZXgnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaW5kZXguaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnSW5kZXhDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2luZGV4JyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCc0MDQnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvNDA0JyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvNDA0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkdXJsUm91dGVyUHJvdmlkZXJcclxuXHRcdFx0XHQub3RoZXJ3aXNlKCcvNDA0Jyk7XHJcblxyXG5cdFx0XHQvLyBpbnRlcmNlcHRvcnNcclxuXHRcdFx0JGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xyXG5cdFx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdQcm9ncmVzc0ludGVyY2VwdG9yJyk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgVXNlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogdmFsaWRhdGUgdXNlclxyXG5cdFx0XHRcdCRhdXRoLnZhbGlkYXRlVXNlcigpXHJcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoISgnZGF0YScgaW4gdG9TdGF0ZSkgfHwgISgnYWNjZXNzJyBpbiB0b1N0YXRlLmRhdGEpKSB7XHJcblx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRVc2VyLmNoZWNrQWNjZXNzKHRvU3RhdGUuZGF0YS5hY2Nlc3MsIGZyb21TdGF0ZS51cmwsICRhdXRoLnVzZXIucm9sZSwgZnVuY3Rpb24gKGFjY2Vzcykge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGlmICghYWNjZXNzKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdCRhdXRoLnVzZXIucm9sZSA9IDA7XHJcblx0XHRcdFx0XHRcdC8vIGNoZWNrIGFjY2Vzc1xyXG5cdFx0XHRcdFx0XHRVc2VyLmNoZWNrQWNjZXNzKHRvU3RhdGUuZGF0YS5hY2Nlc3MsIGZyb21TdGF0ZS51cmwsICRhdXRoLnVzZXIucm9sZSwgZnVuY3Rpb24gKGFjY2Vzcykge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIWFjY2VzcylcclxuXHRcdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS4kb24oJ2F1dGg6bG9naW4tc3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgcmVhc29uKSB7XHJcblxyXG5cdFx0XHRcdCRzdGF0ZS5nbygnaW5kZXgnKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHJvb3RTY29wZS4kb24oJ2F1dGg6bG9nb3V0LXN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcblx0XHRcdFx0JGF1dGgudXNlci5yb2xlID0gMDtcclxuXHRcdFx0XHQvLyBjaGVjayBhY2Nlc3NcclxuXHRcdFx0XHRVc2VyLmNoZWNrQWNjZXNzKCRzdGF0ZS5jdXJyZW50LmRhdGEuYWNjZXNzLCAkc3RhdGUuY3VycmVudC51cmwsICRhdXRoLnVzZXIucm9sZSwgZnVuY3Rpb24gKGFjY2Vzcykge1xyXG5cclxuXHRcdFx0XHRcdGlmICghYWNjZXNzKVxyXG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFEIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMuYWQnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0LmZhY3RvcnkoJ0FkJywgWyckaHR0cCcsICckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRodHRwLCAkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljR2V0QnlJZChpZCkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkLycgKyBpZCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNDcmVhdGUoZGF0YSkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZC9jcmVhdGUnLCBkYXRhKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRnZXRCeUlkOiBwdWJsaWNHZXRCeUlkLFxyXG5cdFx0XHRcdGNyZWF0ZTogcHVibGljQ3JlYXRlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ0FUQUxPRyBTRVJWSUNFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnNlcnZpY2VzLmNhdGFsb2cnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0LmZhY3RvcnkoJ0NhdGFsb2cnLCBbJyRodHRwJywgJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNHZXRBZHMoY2F0ZWdvcnkpIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9jYXRhbG9nLycgKyBjYXRlZ29yeSk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Z2V0QWRzOiBwdWJsaWNHZXRBZHNcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBTRVJWSUNFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHRcdC8vIC4uLlxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGludGVyY2VwdG9yc1xyXG5cdFx0LmZhY3RvcnkoJ1Jlc3BvbnNlSW50ZXJjZXB0b3InLCBbJyRxJywgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcSwgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCBjb25maWcpIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY1Jlc3BvbnNlRXJyb3IocmVzKSB7XHJcblxyXG5cdFx0XHRcdC8vIGVycm9yIGFsZXJ0XHJcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCduZXctYWxlcnQnLCBfLmFzc2lnbihyZXMuZGF0YSwge1xyXG5cdFx0XHRcdFx0dHlwZTogJ2RhbmdlcidcclxuXHRcdFx0XHR9KSk7XHJcblxyXG5cdFx0XHRcdGlmIChyZXMuc3RhdHVzID09PSA0MDEgfHwgcmVzLnN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy91c2VyL2xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy80MDQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzcG9uc2VFcnJvcjogcHVibGljUmVzcG9uc2VFcnJvclxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmZhY3RvcnkoJ1Byb2dyZXNzSW50ZXJjZXB0b3InLCBbJyRxJywgJyRpbmplY3RvcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHEsICRpbmplY3RvciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHR2YXIgbmdQcm9ncmVzcyA9IG51bGw7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwcml2YXRlR2V0TmdQcm9ncmVzcygpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogaW5pdCBwcmVsb2FkZXJcclxuXHRcdFx0XHRuZ1Byb2dyZXNzID0gbmdQcm9ncmVzcyB8fCAkaW5qZWN0b3IuZ2V0KCduZ1Byb2dyZXNzRmFjdG9yeScpLmNyZWF0ZUluc3RhbmNlKCk7XHJcblx0XHRcdFx0bmdQcm9ncmVzcy5zZXRIZWlnaHQoY29uZmlnLkxPQURFUl9IRUlHSFQpO1xyXG5cdFx0XHRcdG5nUHJvZ3Jlc3Muc2V0Q29sb3IoY29uZmlnLkxPQURFUl9DT0xPUik7XHJcblx0XHRcdFx0cmV0dXJuIG5nUHJvZ3Jlc3M7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKSB7XHJcblxyXG5cdFx0XHRcdHZhciBuZ1Byb2dyZXNzID0gcHJpdmF0ZUdldE5nUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHQvLyBUT0RPOiBwcmVsb2FkZXIgY29tcGxldGVcclxuXHRcdFx0XHRuZ1Byb2dyZXNzLmNvbXBsZXRlKCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXF1ZXN0OiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG5nUHJvZ3Jlc3MgPSBwcml2YXRlR2V0TmdQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogcHJlbG9hZGVyIHN0YXJ0XHJcblx0XHRcdFx0XHRuZ1Byb2dyZXNzLnJlc2V0KCk7XHJcblx0XHRcdFx0XHRuZ1Byb2dyZXNzLnN0YXJ0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlcXVlc3RFcnJvcjogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gJHEucmVqZWN0KHJlcyk7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRyZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IFxyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgU0VSVklDRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHRcdC5mYWN0b3J5KCdVc2VyJywgWyckaHR0cCcsICckc3RhdGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRodHRwLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0dldEJ5SWQoaWQpIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VyLycgKyBpZCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNDaGVja0FjY2VzcyhhY2Nlc3MsIGZyb21VcmwsIHJvbGUsIGNhbGxiYWNrKSB7XHJcblxyXG5cdFx0XHRcdGlmIChyb2xlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHJvbGUgPSBjb25maWcuREVGQVVMVF9ST0xFO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKF8uaW5kZXhPZihhY2Nlc3MsIHJvbGUpID09PSAtMSkge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soZmFsc2UpO1xyXG5cclxuXHRcdFx0XHRcdGlmICgkYXV0aC51c2VyLnNpZ25lZEluKSB7XHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnaW5kZXgnKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygndXNlci5sb2dpbicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayh0cnVlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNDb25maXJtYXRpb25FbWFpbCh0b2tlbikge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvcmVnaXN0ZXIvJyArIHRva2VuKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0Z2V0QnlJZDogcHVibGljR2V0QnlJZCxcclxuXHRcdFx0XHRjaGVja0FjY2VzczogcHVibGljQ2hlY2tBY2Nlc3MsXHJcblx0XHRcdFx0Y29uZmlybWF0aW9uRW1haWw6IHB1YmxpY0NvbmZpcm1hdGlvbkVtYWlsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ2luIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyJywgW1xyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzL3VzZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXIubG9naW4nKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXIucmVnaXN0ZXInKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXIucGVyc29uYWwnKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy91c2VyJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy86aWQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcicsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdGlkOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIExPR0lOXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIubG9naW4nLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIubG9naW4nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvbG9naW4nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL2xvZ2luLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJMb2dpbkN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnbG9naW4nLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MuYW5vbnltb3VzXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBQRVJTT05BTFxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFBlcnNvbmFsIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyLnBlcnNvbmFsJywgW10pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLnBlcnNvbmFsJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3BlcnNvbmFsJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9wZXJzb25hbC5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyUGVyc29uYWxDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3BlcnNvbmFsJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnVzZXJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5lZGl0Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL2VkaXQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL2VkaXQuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckVkaXRDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2VkaXQnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MudXNlclxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVJcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBSZWdpc3RlciBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5yZWdpc3RlcicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5yZWdpc3RlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9yZWdpc3RlcicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvcmVnaXN0ZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlclJlZ2lzdGVyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdyZWdpc3RlcicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5jb25maXJtJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3JlZ2lzdGVyLzp0b2tlbicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvY29uZmlybS5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyRW1haWxDb25maXJtYXRpb25DdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2NvbmZpcm0nLFxyXG5cdFx0XHRcdFx0cGFyYW1zOiAge1xyXG5cdFx0XHRcdFx0XHR0b2tlbjoge1xyXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdHNxdWFzaDogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiXX0=
