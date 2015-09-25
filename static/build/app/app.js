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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FjY2Vzcy5qc29uIiwic3JjL2FwcC9hZC5jcmVhdGUuanMiLCJzcmMvYXBwL2FkLmpzIiwic3JjL2FwcC9hcHAuanMiLCJzcmMvYXBwL2NhdGFsb2cuanMiLCJzcmMvYXBwL2NvbmZpZy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvYWQvY3JlYXRlQ29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvYWQvZWRpdENvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL2FkL2luZGV4LmpzIiwic3JjL2FwcC9jb250cm9sbGVycy9jYXRhbG9nL2luZGV4LmpzIiwic3JjL2FwcC9jb250cm9sbGVycy9pbmRleC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9lZGl0Q29udHJvbGxlci5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9pbmRleC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9sb2dpbkNvbnRyb2xsZXIuanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvcGVyc29uYWxDb250cm9sbGVyLmpzIiwic3JjL2FwcC9jb250cm9sbGVycy91c2VyL3JlZ2lzdGVyQ29udHJvbGxlci5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9jYXRhbG9nL2luZGV4LmpzIiwic3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL2FwcC9maWx0ZXJzL2NhdGFsb2cvaW5kZXguanMiLCJzcmMvYXBwL2ZpbHRlcnMvaW5kZXguanMiLCJzcmMvYXBwL3JvdXRlcy5qcyIsInNyYy9hcHAvc2VydmljZXMvYWQvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL2NhdGFsb2cvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL2luZGV4LmpzIiwic3JjL2FwcC9zZXJ2aWNlcy91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIiwic3JjL2FwcC91c2VyLmxvZ2luLmpzIiwic3JjL2FwcC91c2VyLnBlcnNvbmFsLmpzIiwic3JjL2FwcC91c2VyLnJlZ2lzdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz0vKipcclxuICogUk9MRVM6XHJcbiAqIDAgLSBhbm9ueW1vdXNcclxuICogMSAtIHVzZXJcclxuICogMiAtIG1vZGVyYXRvclxyXG4gKiAzIC0gYWRtaW5cclxuICogNCAtIHByaXZhdGUgcGVyc29uIChwcClcclxuICogNSAtIG1pY3JvZmluYW5jZSBvcmdhbml6YXRpb24gKG1maSlcclxuICogNiAtIHBhd25zaG9wIChwcylcclxuICovXHJcblxyXG57XHJcblx0XCJwdWJsaWNcIjogWzAsIDEsIDIsIDMsIDQsIDUsIDZdLFxyXG5cdFwiYW5vbnltb3VzXCI6IFswXSxcclxuXHRcInVzZXJcIjogWzEsIDIsIDMsIDQsIDUsIDZdLFxyXG5cdFwibGVuZGVyXCI6IFs0LCA1LCA2XSxcclxuXHRcImFkbWluXCI6IFszXVxyXG59IiwiLyoqXHJcbiAqIEFEIENSRUFURVxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuYWQuY3JlYXRlJywgW10pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdhZC5jcmVhdGUnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvY3JlYXRlJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvYWQvY3JlYXRlLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0FkQ3JlYXRlQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdjcmVhdGUnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MubGVuZGVyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQURcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBBZCBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuYWQnLCBbXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvYWQnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzL2FkJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9hZC5jcmVhdGUnKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgnYWQnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvYWQnLFxyXG5cdFx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzx1aS12aWV3PicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgnYWQudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy86aWQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9hZC92aWV3Lmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0FkQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdhZCcsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdGlkOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBBUFBMSUNBVElPTlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFwcCBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJywgW1xyXG5cdFx0XHQndWkucm91dGVyJyxcclxuXHRcdFx0Ly8gaW5zdGVhZCBuZ0Nvb2tpZXMgaHR0cHM6Ly9naXRodWIuY29tL2x5bm5keWxhbmh1cmxleS9uZy10b2tlbi1hdXRoI3doeS1kb2VzLXRoaXMtbW9kdWxlLXVzZS1pcGNvb2tpZXMtaW5zdGVhZC1vZi1uZ2Nvb2tpZXNcclxuXHRcdFx0J25nLXRva2VuLWF1dGgnLFxyXG5cdFx0XHQvLyBkb21cclxuXHRcdFx0J25nU2FuaXRpemUnLFxyXG5cdFx0XHQnbmdQcm9ncmVzcycsXHJcblx0XHRcdCd1aS5ib290c3RyYXAnLFxyXG5cdFx0XHQndWkuc2VsZWN0JyxcclxuXHRcdFx0J2NoZWNrbGlzdC1tb2RlbCcsXHJcblx0XHRcdC8vIHZhbHVlcyAmIGNvbnN0YW50c1xyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbmZpZycpLm5hbWUsXHJcblx0XHRcdC8vIGNvbXBvbmVudHNcclxuXHRcdFx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZmlsdGVycycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vc2VydmljZXMnKS5uYW1lLFxyXG5cdFx0XHQvLyBtb2R1bGVzXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vYWQnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2NhdGFsb2cnKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRsb2NhdGlvblByb3ZpZGVyJywgJyRhdXRoUHJvdmlkZXInLCAnJHByb3ZpZGUnLCBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIsICRhdXRoUHJvdmlkZXIsICRwcm92aWRlKSB7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBhdXRoIGNvbmZpZ1xyXG5cdFx0XHQkYXV0aFByb3ZpZGVyLmNvbmZpZ3VyZSh7XHJcblx0XHRcdFx0Ly8gbG9jYWxob3N0XHJcblx0XHRcdFx0YXBpVXJsOiAnL2FwaScsXHJcblx0XHRcdFx0dG9rZW5WYWxpZGF0aW9uUGF0aDogJy91c2VyL3ZhbGlkYXRlJyxcclxuICBcdFx0XHRcdHNpZ25PdXRVcmw6ICcvdXNlci9zaWdub3V0JyxcclxuICBcdFx0XHRcdGVtYWlsUmVnaXN0cmF0aW9uUGF0aDogJy91c2VyL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRhY2NvdW50VXBkYXRlUGF0aDogJy91c2VyL3VwZGF0ZScsXHJcblx0XHRcdFx0YWNjb3VudERlbGV0ZVBhdGg6ICcvdXNlci9kZWxldGUnLFxyXG5cdFx0XHRcdHBhc3N3b3JkUmVzZXRQYXRoOiAnL3VzZXIvcGFzc3dvcmQnLFxyXG5cdFx0XHRcdHBhc3N3b3JkVXBkYXRlUGF0aDogJy91c2VyL3Bhc3N3b3JkJyxcclxuXHRcdFx0XHRlbWFpbFNpZ25JblBhdGg6ICcvdXNlci9zaWduaW4nLFxyXG5cclxuXHRcdFx0XHR0b2tlbkZvcm1hdDoge1xyXG5cdFx0XHRcdFx0XCJhY2Nlc3MtdG9rZW5cIjogXCJ7eyB0b2tlbiB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ0b2tlbi10eXBlXCI6IFwiQmVhcmVyXCIsXHJcblx0XHRcdFx0XHRcImV4cGlyeVwiOiBcInt7IGV4cGlyeSB9fVwiLFxyXG5cdFx0XHRcdFx0XCJ1aWRcIjogXCJ7eyB1aWQgfX1cIlxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlTG9naW5SZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlQWNjb3VudFVwZGF0ZVJlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aGFuZGxlVG9rZW5WYWxpZGF0aW9uUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIEhBQ0s6IHJlZGVmaW5lIHVpLWJvb3RzdHJhcCB0ZW1wbGF0ZXNcclxuXHRcdFx0JHByb3ZpZGUuZGVjb3JhdG9yKCdhbGVydERpcmVjdGl2ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcclxuXHJcblx0XHRcdFx0JGRlbGVnYXRlWzBdLnRlbXBsYXRlVXJsID0gJ3BhcnRpYWxzL2FsZXJ0Lmh0bWwnO1xyXG5cdFx0XHRcdHJldHVybiAkZGVsZWdhdGU7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9yb3V0ZXMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENBVEFMT0dcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBDYXRhbG9nIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jYXRhbG9nJywgW1xyXG5cdFx0XHRyZXF1aXJlKCcuL2NvbnRyb2xsZXJzL2NhdGFsb2cnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzL2NhdGFsb2cnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMvY2F0YWxvZycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZmlsdGVycy9jYXRhbG9nJykubmFtZVxyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2NhdGFsb2cnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvY2F0YWxvZycsXHJcblx0XHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcclxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnPHVpLXZpZXc+JyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCdjYXRhbG9nLnZpZXcnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvOmNhdGVnb3J5JyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2F0YWxvZy92aWV3Lmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0NhdGFsb2dDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2NhdGFsb2cnLFxyXG5cdFx0XHRcdFx0cGFyYW1zOiAge1xyXG5cdFx0XHRcdFx0XHRjYXRlZ29yeToge1xyXG5cdFx0XHRcdFx0XHRcdHZhbHVlOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdHNxdWFzaDogdHJ1ZVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09ORklHXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQ29uZmlnIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSlcclxuXHRcdC5jb25zdGFudCgnY29uZmlnJywge1xyXG5cdFx0XHQvLyBtYWluXHJcblx0XHRcdE5BTUU6ICdBTExNT05FWScsXHJcblx0XHRcdERFQlVHOiB0cnVlLFxyXG5cdFx0XHQvLyBmb3IgdXNlcnNcclxuXHRcdFx0Uk9MRVM6IFtcclxuXHRcdFx0XHQn0JDQvdC+0L3QuNC80YPRgScsXHJcblx0XHRcdFx0J9Cf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCcsXHJcblx0XHRcdFx0J9Cc0L7QtNC10YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9CQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAJyxcclxuXHRcdFx0XHQn0KfQsNGB0YLQvdC+0LUg0LvQuNGG0L4nLFxyXG5cdFx0XHRcdCfQnNCk0J4nLFxyXG5cdFx0XHRcdCfQm9C+0LzQsdCw0YDQtCdcclxuXHRcdFx0XSxcclxuXHRcdFx0REVGQVVMVF9ST0xFOiAwLFxyXG5cdFx0XHRBQ0NFU1M6IHJlcXVpcmUoJy4vYWNjZXNzLmpzb24nKSxcclxuXHRcdFx0U1RBVFVTRVM6IFtcclxuXHRcdFx0XHQn0J3QtSDQv9C+0LTRgtCy0LXRgNC20LTQtdC9JyxcclxuXHRcdFx0XHQn0J3QtSDQv9GA0L7QstC10YDQtdC9JyxcclxuXHRcdFx0XHQn0J3QsCDQvNC+0LTQtdGA0LDRhtC40LgnLFxyXG5cdFx0XHRcdCfQkNC60YLQuNCy0LXQvScsXHJcblx0XHRcdFx0J9CX0LDQvNC+0YDQvtC20LXQvSdcclxuXHRcdFx0XSxcclxuXHRcdFx0Ly8gZm9yIGFkc1xyXG5cdFx0XHRDSVRJRVM6IFtcclxuXHRcdFx0XHQn0JLRgdC1INCz0L7RgNC+0LTQsCcsXHJcblx0XHRcdFx0J9Cc0L7RgdC60LLQsCcsXHJcblx0XHRcdFx0J9Ch0LDQvdC60YIt0J/QtdGC0LXRgNCx0YPRgNCzJyxcclxuXHRcdFx0XHQn0J3QvtCy0L7RgdC40LHQuNGA0YHQuicsXHJcblx0XHRcdFx0J9Cd0LjQttC90LjQuS3QndC+0LLQs9C+0YDQvtC0JyxcclxuXHRcdFx0XHQn0JrRgNCw0YHQvdC+0Y/RgNGB0LonLFxyXG5cdFx0XHRcdCfQmtCw0LfQsNC90YwnLFxyXG5cdFx0XHRcdCfQldC60LDRgtC10YDQuNC90LHRg9GA0LMnXHJcblx0XHRcdF0sXHJcblx0XHRcdFRFUk1fVU5JVFM6IFtcclxuXHRcdFx0XHQn0JTQvdC10LknXHJcblx0XHRcdF0sXHJcblx0XHRcdFJBVEVfVU5JVFM6IFtcclxuXHRcdFx0XHQn0JIg0LTQtdC90YwnLFxyXG5cdFx0XHRcdCfQkiDQvNC10YHRj9GGJyxcclxuXHRcdFx0XHQn0JIg0LPQvtC0J1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRQRVJJT0RfVU5JVFM6IFtcclxuXHRcdFx0XHQn0JzQuNC90YPRgicsXHJcblx0XHRcdFx0J9Cn0LDRgdC+0LInLFxyXG5cdFx0XHRcdCfQlNC90LXQuSdcclxuXHRcdFx0XSxcclxuXHRcdFx0U0VDVVJJVFlfVFlQRVM6IFtcclxuXHRcdFx0XHQn0KDQsNGB0L/QuNGB0LrQsCcsXHJcblx0XHRcdFx0J9CX0LDQu9C+0LMnXHJcblx0XHRcdF0sXHJcblx0XHRcdFdBWUdFVF9UWVBFUzogW1xyXG5cdFx0XHRcdCfQndCw0LvQuNGH0L3Ri9C80LgnLFxyXG5cdFx0XHRcdCfQntC90LvQsNC50L0nXHJcblx0XHRcdF0sXHJcblx0XHRcdC8vIGZpbGRlciBhZHNcclxuXHRcdFx0QU1PVU5UUzogWzUwMCwgMTAwMDAwMF0sXHJcblx0XHRcdFRFUk1TOiBbMCwgMTgyNV0sXHJcblx0XHRcdC8vIGhhbmRsZXJcclxuXHRcdFx0RVJST1JTOiB7XHJcblx0XHRcdFx0MDogJ9Cd0LXQuNC30LLQtdGB0YLQvdCw0Y8g0L7RiNC40LHQutCwLicsXHJcblx0XHRcdFx0MTogJ9Ce0YjQuNCx0LrQsCDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LicsXHJcblx0XHRcdFx0MjogJ9Cd0LXQstC10YDQvdGL0Lkg0YLQvtC60LXQvSDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LicsXHJcblx0XHRcdFx0MzogJ9Ca0L7QtCDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjRjyDQvdC1INC90LDQudC00LXQvSwg0LHRi9C7INCw0LrRgtC40LLQuNGA0L7QstCw0L0g0YDQsNC90LXQtSDQuNC70Lgg0LjRgdGC0LXQuiDRgdGA0L7QuiDQtNC10LnRgdGC0LLQuNGPINC60L7QtNCwINCw0LrRgtC40LLQsNGG0LjQuC4nLFxyXG5cdFx0XHRcdDQ6ICfQktCy0LXQtNC10L0g0L3QtdCy0LXRgNC90YvQuSBlbWFpbCDQuNC70Lgg0L/QsNGA0L7Qu9GMLicsXHJcblx0XHRcdFx0NTogJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINGD0YfQtdGC0L3QvtC5INC30LDQv9C40YHQuC4g0J/QvtC20LDQu9GD0LnRgdGC0LAg0L/RgNC+0LLQtdGA0YzRgtC1INCy0LLQtdC00LXQvdC90YvQtSDQtNCw0L3QvdGL0LUuJyxcclxuXHRcdFx0XHQ2OiAn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC90LUg0L3QsNC50LTQtdC9LicsXHJcblx0XHRcdFx0NzogJ9Ce0YjQuNCx0LrQsCDQvtCx0L3QvtCy0LvQtdC90LjRjyDRg9GH0LXRgtC90L7QuSDQt9Cw0L/QuNGB0LguINCf0L7QttCw0LvRg9C50YHRgtCwINC/0YDQvtCy0LXRgNGM0YLQtSDQstCy0LXQtNC10L3QvdGL0LUg0LTQsNC90L3Ri9C1LicsXHJcblx0XHRcdFx0ODogJ9Ce0YjQuNCx0LrQsCDRgdC+0LfQtNCw0L3QuNGPINC+0LHRitGP0LLQu9C10L3QuNGPLiDQn9C+0LbQsNC70YPQudGB0YLQsCDQv9GA0L7QstC10YDRjNGC0LUg0LLQstC10LTQtdC90L3Ri9C1INC00LDQvdC90YvQtS4nLFxyXG5cdFx0XHRcdDk6ICfQntCx0YrRj9Cy0LvQtdC90LjQtSDQvdC1INC90LDQudC00LXQvdC+LicsXHJcblx0XHRcdFx0MTA6ICfQntCx0YrRj9Cy0LvQtdC90LjRjyDQvdC1INC90LDQudC00LXQvdGLLidcclxuXHRcdFx0fSxcclxuXHRcdFx0UkVQT1JUUzoge1xyXG5cdFx0XHRcdCdub3RzcGVjaWZpZWQnOiAn0J3QtSDRg9C60LDQt9Cw0L3QvicsXHJcblx0XHRcdFx0J25vcmV2aWV3cyc6ICfQndC10YIg0L3QuCDQvtC00L3QvtCz0L4g0L7RgtC30YvQstCwIDooJyxcclxuXHRcdFx0XHQnbm9hZHMnOiAn0J3QtdGCINC90Lgg0L7QtNC90L7Qs9C+INC+0LHRitGP0LLQu9C10L3QuNGPIDooJyxcclxuXHRcdFx0XHQnaG93dG9nZXQnOiAn0JrQsNC6INC/0L7Qu9GD0YfQuNGC0Yw/J1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBsb2FkZXJcclxuXHRcdFx0TE9BREVSX0hFSUdIVDogJzNweCcsXHJcblx0XHRcdExPQURFUl9DT0xPUjogJyMwMDU5YmEnXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFEIENSRUFURSBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy5hZCcpXHJcblx0XHQuY29udHJvbGxlcignQWRDcmVhdGVDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ0FkJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIEFkLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS51c2VyID0gJGF1dGgudXNlcjtcclxuXHJcblx0XHRcdC8vIHNlbGVjdHNcclxuXHRcdFx0Ly8gdGVybSB1bml0c1xyXG5cdFx0XHQkc2NvcGUudGVybVVuaXRzID0gY29uZmlnLlRFUk1fVU5JVFM7XHJcblx0XHRcdCRzY29wZS5hdmFpbGFibGVUZXJtVW5pdHMgPSBbMF07XHJcblx0XHRcdC8vIHJhdGUgdW5pdHNcclxuXHRcdFx0JHNjb3BlLnJhdGVVbml0cyA9IGNvbmZpZy5SQVRFX1VOSVRTO1xyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlUmF0ZVVuaXRzID0gWzAsIDEsIDJdO1xyXG5cdFx0XHQvLyBwZXJpb2QgdW5pdHNcclxuXHRcdFx0JHNjb3BlLnBlcmlvZFVuaXRzID0gY29uZmlnLlBFUklPRF9VTklUUztcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZVBlcmlvZFVuaXRzID0gWzAsIDEsIDJdO1xyXG5cdFx0XHQvLyBzZWN1cml0eVxyXG5cdFx0XHQkc2NvcGUuc2VjdXJpdHlUeXBlcyA9IGNvbmZpZy5TRUNVUklUWV9UWVBFUztcclxuXHRcdFx0JHNjb3BlLnNlY3VyaXR5Q29kZXMgPSBbMCwgMV07XHJcblx0XHRcdC8vIHdheWdldFxyXG5cdFx0XHQkc2NvcGUud2F5Z2V0VHlwZXMgPSBjb25maWcuV0FZR0VUX1RZUEVTO1xyXG5cdFx0XHQkc2NvcGUud2F5Z2V0Q29kZXMgPSBbMCwgMV07XHJcblx0XHRcdC8vIGNpdGllc1xyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNpdGllc0NvZGVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7XHJcblx0XHRcdFx0dGVybToge1xyXG5cdFx0XHRcdFx0dW5pdDogMFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmF0ZToge1xyXG5cdFx0XHRcdFx0dW5pdDogMFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cGVyaW9kOiB7XHJcblx0XHRcdFx0XHR1bml0OiAwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGNyZWF0ZSBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogY3JlYXRlXHJcblx0XHRcdFx0QWQuY3JlYXRlKCRzY29wZS5kYXRhKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdFx0XHQkc2NvcGUucmVzZXQoKTtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLnBlcnNvbmFsJyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUuY3JlYXRlRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBBRCBFRElUIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLmFkJylcclxuXHRcdC5jb250cm9sbGVyKCdBZEVkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGVkaXQgc3VibWl0XHJcblx0XHRcdCRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IHVwZGF0ZSBkYXRhXHJcblx0XHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEFEIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMuYWQnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ0FkQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnQWQnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIEFkLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIGRlZmluZVxyXG5cdFx0XHQkc2NvcGUucmVwb3J0cyA9IGNvbmZpZy5SRVBPUlRTO1xyXG5cdFx0XHQkc2NvcGUudGVybVVuaXRzID0gY29uZmlnLlRFUk1fVU5JVFM7XHJcblx0XHRcdCRzY29wZS5yYXRlVW5pdHMgPSBjb25maWcuUkFURV9VTklUUztcclxuXHRcdFx0JHNjb3BlLnBlcmlvZFVuaXRzID0gY29uZmlnLlBFUklPRF9VTklUUztcclxuXHRcdFx0JHNjb3BlLnNlY3VyaXR5VHlwZXMgPSBjb25maWcuU0VDVVJJVFlfVFlQRVM7XHJcblx0XHRcdCRzY29wZS53YXlnZXRUeXBlcyA9IGNvbmZpZy5XQVlHRVRfVFlQRVM7XHJcblx0XHRcdCRzY29wZS5jaXRpZXMgPSBjb25maWcuQ0lUSUVTO1xyXG5cclxuXHRcdFx0QWQuZ2V0QnlJZCgkc3RhdGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuXHRcdFx0XHRcdCRzY29wZS5kYXRhID0gcmVzLmRhdGE7XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9jcmVhdGVDb250cm9sbGVyJyk7XHJcblx0cmVxdWlyZSgnLi9lZGl0Q29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ0FUQUxPRyBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLmNhdGFsb2cnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ0NhdGFsb2dDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ0NhdGFsb2cnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBDYXRhbG9nLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIGRlZmluZVxyXG5cdFx0XHQkc2NvcGUucmVwb3J0cyA9IGNvbmZpZy5SRVBPUlRTO1xyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNpdGllc0NvZGVzID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xyXG5cdFx0XHQkc2NvcGUuYW1vdW50cyA9IGNvbmZpZy5BTU9VTlRTO1xyXG5cdFx0XHQkc2NvcGUudGVybXMgPSBjb25maWcuVEVSTVM7XHJcblxyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuYWRzID0gW107XHJcblxyXG5cdFx0XHRDYXRhbG9nLmdldEFkcygkc3RhdGVQYXJhbXMuY2F0ZWdvcnkpXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuXHRcdFx0XHRcdCRzY29wZS5hZHMgPSByZXMuZGF0YTtcclxuXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIGVycm9yXHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0NhdGFsb2dBZEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIGRlZmluZVxyXG5cdFx0XHQkc2NvcGUucmVwb3J0cyA9IGNvbmZpZy5SRVBPUlRTO1xyXG5cdFx0XHQkc2NvcGUudGVybVVuaXRzID0gY29uZmlnLlRFUk1fVU5JVFM7XHJcblx0XHRcdCRzY29wZS5yYXRlVW5pdHMgPSBjb25maWcuUkFURV9VTklUUztcclxuXHRcdFx0JHNjb3BlLnBlcmlvZFVuaXRzID0gY29uZmlnLlBFUklPRF9VTklUUztcclxuXHRcdFx0JHNjb3BlLnNlY3VyaXR5VHlwZXMgPSBjb25maWcuU0VDVVJJVFlfVFlQRVM7XHJcblx0XHRcdCRzY29wZS53YXlnZXRUeXBlcyA9IGNvbmZpZy5XQVlHRVRfVFlQRVM7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRzY29wZScsICckbG9jYXRpb24nLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uIChsb2NhdGlvbikge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gbG9jYXRpb24gPT09ICRsb2NhdGlvbi5wYXRoKCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0luZGV4Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRhdXRoLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5jaXRpZXMgPSBjb25maWcuQ0lUSUVTO1xyXG5cdFx0XHQkc2NvcGUuY2l0aWVzQ29kZXMgPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgN107XHJcblxyXG5cdFx0XHQvLyBURU1QOiBkZWZpbmUgbG9jYXRpb25cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJQYW5lbEN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkYXV0aCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuaGFuZGxlU2lnbk91dEJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkYXV0aC5zaWduT3V0KClcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdBbGVydHNTZWN0aW9uQ3RybCcsIFsnJHNjb3BlJywgJyR0aW1lb3V0JywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzY29wZS5hbGVydHMgPSBbXTtcclxuXHJcblx0XHRcdC8vIGNsb3NlIGFsZXJ0XHJcblx0XHRcdCRzY29wZS5jbG9zZUFsZXJ0ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5hbGVydHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBjaGVja2luZyBuZXcgYWxsZXJ0XHJcblx0XHRcdCRzY29wZS4kb24oJ25ldy1hbGVydCcsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XHJcblxyXG5cdFx0XHRcdHZhciBhbGVydCA9ICRzY29wZS5hbGVydHMucHVzaCh7XHJcblx0XHRcdFx0XHR0eXBlOiBkYXRhLnR5cGUsXHJcblx0XHRcdFx0XHRjbG9zZWFibGU6IHRydWUsXHJcblx0XHRcdFx0XHRtZXNzYWdlOiBjb25maWcuRVJST1JTW2RhdGEuY29kZV1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdCRzY29wZS5hbGVydHMuc3BsaWNlKCRzY29wZS5hbGVydHMuaW5kZXhPZihhbGVydCksIDEpO1xyXG5cclxuXHRcdFx0XHR9LCA4MDAwKTtcclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgWyckc2NvcGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIEVESVQgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignVXNlckVkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0Ly8gQlVHOiBpZiBjb3B5ICRhdXRoLnVzZXIsIHdlIHJlY2VpdmUgaXMgbm90IGFjY3VyYXRlIGRhdGFcclxuXHRcdFx0Ly8gSEFDSzogbm90IGNvcHkgKHN5bmMpXHJcblx0XHRcdCRzY29wZS5kYXRhID0gJGF1dGgudXNlcjtcclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0Ly8gVE9ETzogZWRpdCBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogdXBkYXRlIGRhdGFcclxuXHRcdFx0XHQkYXV0aC51cGRhdGVBY2NvdW50KCRzY29wZS5kYXRhKVxyXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLnBlcnNvbmFsJyk7XHJcblxyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICckc3RhdGUnLCAnJGF1dGgnLCAnVXNlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgJGF1dGgsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLmlzTXlQcm9maWxlID0gZmFsc2U7XHJcblxyXG5cdFx0XHRVc2VyLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IHJlcy5kYXRhO1xyXG5cdFx0XHRcdFx0aWYgKCRzY29wZS5kYXRhLmlkID09PSAkYXV0aC51c2VyLmlkKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5pc015UHJvZmlsZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBlcnJvclxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyRW1haWxDb25maXJtYXRpb25DdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ1VzZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdFVzZXIuY29uZmlybWF0aW9uRW1haWwoJHN0YXRlUGFyYW1zLnRva2VuKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdC8vIGVycm9yXHJcblx0XHRcdFx0XHQkc2NvcGUuY29uZmlybWVkID0gZmFsc2U7XHJcblx0XHRcdFx0XHQkc2NvcGUuZXJyb3IgPSBjb25maWcuRVJST1JTW3Jlcy5kYXRhLmNvZGVdO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9sb2dpbkNvbnRyb2xsZXInKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcicpO1xyXG5cdHJlcXVpcmUoJy4vcGVyc29uYWxDb250cm9sbGVyJyk7XHJcblx0cmVxdWlyZSgnLi9lZGl0Q29udHJvbGxlcicpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBMT0dJTiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdVc2VyTG9naW5DdHJsJywgWyckc2NvcGUnLCAnJGF1dGgnLCBmdW5jdGlvbiAoJHNjb3BlLCAkYXV0aCkge1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBsb2dpbiBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogbG9naW5cclxuXHRcdFx0XHQkYXV0aC5zdWJtaXRMb2dpbigkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuXHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBlcnJyb3JcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUubG9naW5Gb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUEVSU09OQUwgQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignVXNlclBlcnNvbmFsQ3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdVc2VyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJGF1dGgsIFVzZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlcG9ydHMgPSBjb25maWcuUkVQT1JUUztcclxuXHRcdFx0JHNjb3BlLnN0YXR1c2VzID0gY29uZmlnLlNUQVRVU0VTO1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9ICRhdXRoLnVzZXI7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFJFR0lTVEVSIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJSZWdpc3RlckN0cmwnLCBbJyRzY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkYXV0aCwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQvLyBUT0RPOiBuYW1lIHJvbGVzXHJcblx0XHRcdCRzY29wZS5yb2xlcyA9IGNvbmZpZy5ST0xFUztcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBbMSwgNCwgNSwgNl07XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IHJlZ2lzdGVyIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiByZWdpc3RlclxyXG5cdFx0XHRcdCRhdXRoLnN1Ym1pdFJlZ2lzdHJhdGlvbigkc2NvcGUuZGF0YSlcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3VzZXIucGVyc29uYWwnKTtcclxuXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdC8qJHNjb3BlLnJlc2V0KCk7Ki9cclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQkc2NvcGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5yZWdpc3RlckZvcm0uJHNldFByaXN0aW5lKCk7XHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lzdGVyRm9ybS4kc2V0VW50b3VjaGVkKCk7XHJcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDQVRBTE9HIERJUkVDVElWRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzLmNhdGFsb2cnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBkaXJlY3RpdmVzXHJcblx0XHQuZGlyZWN0aXZlKCdhZCcsIFsnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHRcdHJlcGxhY2U6IHRydWUsXHJcblx0XHRcdFx0c2NvcGU6IHtcclxuXHRcdFx0XHRcdGFkOiAnPSdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2F0YWxvZy9hZC5odG1sJyxcclxuXHRcdFx0XHRjb250cm9sbGVyOiAnQ2F0YWxvZ0FkQ3RybCcsXHJcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnYWQnXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRElSRUNUSVZFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmRpcmVjdGl2ZXMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBkaXJlY3RpdmVzXHJcblx0XHQuZGlyZWN0aXZlKCd1c2VyUGFuZWwnLCBbJ2NvbmZpZycsIGZ1bmN0aW9uIChjb25maWcpIHtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXItcGFuZWwuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJQYW5lbEN0cmwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXJBczogJ3VzZXJwYW5lbCdcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5kaXJlY3RpdmUoJ2FsZXJ0c1NlY3Rpb24nLCBbJ2NvbmZpZycsIGZ1bmN0aW9uIChjb25maWcpIHtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0XHRyZXBsYWNlOiB0cnVlLFxyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvYWxlcnRzLXNlY3Rpb24uaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ0FsZXJ0c1NlY3Rpb25DdHJsJyxcclxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICdhbGVydHNzZWN0aW9uJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmRpcmVjdGl2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXN0cmljdDogJ0EnLFxyXG5cdFx0XHRcdHJlcXVpcmU6ICc/bmdNb2RlbCcsXHJcblx0XHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xyXG5cclxuXHRcdFx0XHRcdGlmICghbmdNb2RlbCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHRcdHNjb3BlLiR3YXRjaChhdHRycy5uZ01vZGVsLCBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YWxpZGF0ZSgpO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdGF0dHJzLiRvYnNlcnZlKCdlcXVhbHMnLCBmdW5jdGlvbiAodmFsKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YWxpZGF0ZSgpO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHZhciB2YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIHZhbHVlc1xyXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVGaXJzdCA9IG5nTW9kZWwuJHZpZXdWYWx1ZTtcclxuXHRcdFx0XHRcdFx0dmFyIHZhbHVlU2Vjb25kID0gYXR0cnMuZXF1YWxzO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gc2V0IHZhbGlkaXR5XHJcblx0XHRcdFx0XHRcdG5nTW9kZWwuJHNldFZhbGlkaXR5KCdlcXVhbHMnLCAhdmFsdWVGaXJzdCB8fCAhdmFsdWVTZWNvbmQgfHwgdmFsdWVGaXJzdCA9PT0gdmFsdWVTZWNvbmQpO1xyXG5cclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pXHJcblx0XHQuZGlyZWN0aXZlKCdzaWRlYmFyJywgWydjb25maWcnLCBmdW5jdGlvbiAoY29uZmlnKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3NpZGViYXIuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcclxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICdzaWRlYmFyJ1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENBVEFMT0cgRklMVEVSU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmZpbHRlcnMuY2F0YWxvZycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGZpbHRlcnNcclxuXHRcdC5maWx0ZXIoJ2FkQ2l0eScsIFtmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIEZJTFRFUlNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5maWx0ZXJzJywgW10pXHJcblx0XHQvLyBUT0RPOiBjb21tb24gZmlsdGVyc1xyXG5cdFx0LmZpbHRlcigncnViJywgWyckZmlsdGVyJywgJyRsb2NhbGUnLCBmdW5jdGlvbiAoJGZpbHRlciwgJGxvY2FsZSkge1xyXG5cclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChudW0pIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRmaWx0ZXIoJ251bWJlcicpKG51bSwgMikgKyAnPHNwYW4gY2xhc3M9XCJjdXJyZW5jeVwiPiDRgNGD0LEuPC9zcGFuPic7XHJcblx0XHRcdFx0XHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogUk9VVEVTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdpbmRleCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy8nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9pbmRleC5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJbmRleEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnaW5kZXgnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MucHVibGljXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJzQwNCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy80MDQnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy80MDQuaHRtbCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdCR1cmxSb3V0ZXJQcm92aWRlclxyXG5cdFx0XHRcdC5vdGhlcndpc2UoJy80MDQnKTtcclxuXHJcblx0XHRcdC8vIGludGVyY2VwdG9yc1xyXG5cdFx0XHQkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdSZXNwb25zZUludGVyY2VwdG9yJyk7XHJcblx0XHRcdCRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ1Byb2dyZXNzSW50ZXJjZXB0b3InKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckYXV0aCcsICdVc2VyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsICRhdXRoLCBVc2VyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiB2YWxpZGF0ZSB1c2VyXHJcblx0XHRcdFx0JGF1dGgudmFsaWRhdGVVc2VyKClcclxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmICghKCdkYXRhJyBpbiB0b1N0YXRlKSB8fCAhKCdhY2Nlc3MnIGluIHRvU3RhdGUuZGF0YSkpIHtcclxuXHRcdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFVzZXIuY2hlY2tBY2Nlc3ModG9TdGF0ZS5kYXRhLmFjY2VzcywgZnJvbVN0YXRlLnVybCwgJGF1dGgudXNlci5yb2xlLCBmdW5jdGlvbiAoYWNjZXNzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFhY2Nlc3MpXHJcblx0XHRcdFx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdFx0JGF1dGgudXNlci5yb2xlID0gMDtcclxuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWNjZXNzXHJcblx0XHRcdFx0XHRcdFVzZXIuY2hlY2tBY2Nlc3ModG9TdGF0ZS5kYXRhLmFjY2VzcywgZnJvbVN0YXRlLnVybCwgJGF1dGgudXNlci5yb2xlLCBmdW5jdGlvbiAoYWNjZXNzKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghYWNjZXNzKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkcm9vdFNjb3BlLiRvbignYXV0aDpsb2dpbi1zdWNjZXNzJywgZnVuY3Rpb24gKGV2ZW50LCByZWFzb24pIHtcclxuXHJcblx0XHRcdFx0JHN0YXRlLmdvKCdpbmRleCcpO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkcm9vdFNjb3BlLiRvbignYXV0aDpsb2dvdXQtc3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cclxuXHRcdFx0XHQkYXV0aC51c2VyLnJvbGUgPSAwO1xyXG5cdFx0XHRcdC8vIGNoZWNrIGFjY2Vzc1xyXG5cdFx0XHRcdFVzZXIuY2hlY2tBY2Nlc3MoJHN0YXRlLmN1cnJlbnQuZGF0YS5hY2Nlc3MsICRzdGF0ZS5jdXJyZW50LnVybCwgJGF1dGgudXNlci5yb2xlLCBmdW5jdGlvbiAoYWNjZXNzKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFhY2Nlc3MpXHJcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQUQgU0VSVklDRVNcclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5zZXJ2aWNlcy5hZCcsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQuZmFjdG9yeSgnQWQnLCBbJyRodHRwJywgJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNHZXRCeUlkKGlkKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWQvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NyZWF0ZShkYXRhKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkL2NyZWF0ZScsIGRhdGEpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGdldEJ5SWQ6IHB1YmxpY0dldEJ5SWQsXHJcblx0XHRcdFx0Y3JlYXRlOiBwdWJsaWNDcmVhdGVcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDQVRBTE9HIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMuY2F0YWxvZycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQuZmFjdG9yeSgnQ2F0YWxvZycsIFsnJGh0dHAnLCAnJHN0YXRlJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkaHR0cCwgJHN0YXRlLCBjb25maWcpIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0dldEFkcyhjYXRlZ29yeSkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2NhdGFsb2cvJyArIGNhdGVnb3J5KTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRnZXRBZHM6IHB1YmxpY0dldEFkc1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0Ly8gLi4uXHJcblx0XHQvLyBUT0RPOiBjb21tb24gaW50ZXJjZXB0b3JzXHJcblx0XHQuZmFjdG9yeSgnUmVzcG9uc2VJbnRlcmNlcHRvcicsIFsnJHEnLCAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRxLCAkbG9jYXRpb24sICRyb290U2NvcGUsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljUmVzcG9uc2VFcnJvcihyZXMpIHtcclxuXHJcblx0XHRcdFx0Ly8gZXJyb3IgYWxlcnRcclxuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ25ldy1hbGVydCcsIF8uYXNzaWduKHJlcy5kYXRhLCB7XHJcblx0XHRcdFx0XHR0eXBlOiAnZGFuZ2VyJ1xyXG5cdFx0XHRcdH0pKTtcclxuXHJcblx0XHRcdFx0aWYgKHJlcy5zdGF0dXMgPT09IDQwMSB8fCByZXMuc3RhdHVzID09PSA0MDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXIvbG9naW4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLzQwNCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXMpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRyZXNwb25zZUVycm9yOiBwdWJsaWNSZXNwb25zZUVycm9yXHJcblx0XHRcdH07XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuZmFjdG9yeSgnUHJvZ3Jlc3NJbnRlcmNlcHRvcicsIFsnJHEnLCAnJGluamVjdG9yJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkcSwgJGluamVjdG9yLCBjb25maWcpIHtcclxuXHJcblx0XHRcdHZhciBuZ1Byb2dyZXNzID0gbnVsbDtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHByaXZhdGVHZXROZ1Byb2dyZXNzKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBpbml0IHByZWxvYWRlclxyXG5cdFx0XHRcdG5nUHJvZ3Jlc3MgPSBuZ1Byb2dyZXNzIHx8ICRpbmplY3Rvci5nZXQoJ25nUHJvZ3Jlc3NGYWN0b3J5JykuY3JlYXRlSW5zdGFuY2UoKTtcclxuXHRcdFx0XHRuZ1Byb2dyZXNzLnNldEhlaWdodChjb25maWcuTE9BREVSX0hFSUdIVCk7XHJcblx0XHRcdFx0bmdQcm9ncmVzcy5zZXRDb2xvcihjb25maWcuTE9BREVSX0NPTE9SKTtcclxuXHRcdFx0XHRyZXR1cm4gbmdQcm9ncmVzcztcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpIHtcclxuXHJcblx0XHRcdFx0dmFyIG5nUHJvZ3Jlc3MgPSBwcml2YXRlR2V0TmdQcm9ncmVzcygpO1xyXG5cdFx0XHRcdC8vIFRPRE86IHByZWxvYWRlciBjb21wbGV0ZVxyXG5cdFx0XHRcdG5nUHJvZ3Jlc3MuY29tcGxldGUoKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJlcXVlc3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgbmdQcm9ncmVzcyA9IHByaXZhdGVHZXROZ1Byb2dyZXNzKCk7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBwcmVsb2FkZXIgc3RhcnRcclxuXHRcdFx0XHRcdG5nUHJvZ3Jlc3MucmVzZXQoKTtcclxuXHRcdFx0XHRcdG5nUHJvZ3Jlc3Muc3RhcnQoKTtcclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cmVxdWVzdEVycm9yOiBmdW5jdGlvbiAocmVzKSB7XHJcblxyXG5cdFx0XHRcdFx0cHJpdmF0ZUNvbXBsZXRlUHJvZ3Jlc3MoKTtcclxuXHRcdFx0XHRcdHJldHVybiAkcS5yZWplY3QocmVzKTtcclxuXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRyZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRcdHByaXZhdGVDb21wbGV0ZVByb2dyZXNzKCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0XHRwcml2YXRlQ29tcGxldGVQcm9ncmVzcygpO1xyXG5cdFx0XHRcdFx0cmV0dXJuICRxLnJlamVjdChyZXMpO1xyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gXHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBTRVJWSUNFU1xyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnNlcnZpY2VzLnVzZXInLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBzZXJ2aWNlc1xyXG5cdFx0LmZhY3RvcnkoJ1VzZXInLCBbJyRodHRwJywgJyRzdGF0ZScsICckYXV0aCcsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsICRzdGF0ZSwgJGF1dGgsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gcHVibGljR2V0QnlJZChpZCkge1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NoZWNrQWNjZXNzKGFjY2VzcywgZnJvbVVybCwgcm9sZSwgY2FsbGJhY2spIHtcclxuXHJcblx0XHRcdFx0aWYgKHJvbGUgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0cm9sZSA9IGNvbmZpZy5ERUZBVUxUX1JPTEU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoXy5pbmRleE9mKGFjY2Vzcywgcm9sZSkgPT09IC0xKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhmYWxzZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCRhdXRoLnVzZXIuc2lnbmVkSW4pIHtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdpbmRleCcpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCd1c2VyLmxvZ2luJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0NvbmZpcm1hdGlvbkVtYWlsKHRva2VuKSB7XHJcblxyXG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci9yZWdpc3Rlci8nICsgdG9rZW4pO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRnZXRCeUlkOiBwdWJsaWNHZXRCeUlkLFxyXG5cdFx0XHRcdGNoZWNrQWNjZXNzOiBwdWJsaWNDaGVja0FjY2VzcyxcclxuXHRcdFx0XHRjb25maXJtYXRpb25FbWFpbDogcHVibGljQ29uZmlybWF0aW9uRW1haWxcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXInLCBbXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vc2VydmljZXMvdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlci5sb2dpbicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlci5yZWdpc3RlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlci5wZXJzb25hbCcpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3VzZXInLFxyXG5cdFx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJzx1aS12aWV3PicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci52aWV3Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzppZCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvdmlldy5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICd1c2VyJyxcclxuXHRcdFx0XHRcdHBhcmFtczogIHtcclxuXHRcdFx0XHRcdFx0aWQ6IHtcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRzcXVhc2g6IHRydWVcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLnB1YmxpY1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5sb2dpbicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5sb2dpbicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9sb2dpbicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvbG9naW4uaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckxvZ2luQ3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdsb2dpbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5hbm9ueW1vdXNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFBFUlNPTkFMXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogUGVyc29uYWwgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXIucGVyc29uYWwnLCBbXSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdjb25maWcnLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGNvbmZpZykge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucGVyc29uYWwnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcGVyc29uYWwnLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3BlcnNvbmFsLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJQZXJzb25hbEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAncGVyc29uYWwnLFxyXG5cdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRhY2Nlc3M6IGNvbmZpZy5BQ0NFU1MudXNlclxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmVkaXQnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvZWRpdCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvZWRpdC5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyRWRpdEN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnZWRpdCcsXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy51c2VyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBSRUdJU1RFUlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlZ2lzdGVyIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyLnJlZ2lzdGVyJywgW10pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnY29uZmlnJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCBjb25maWcpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLnJlZ2lzdGVyJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9yZWdpc3Rlci5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdVc2VyUmVnaXN0ZXJDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdFx0YWNjZXNzOiBjb25maWcuQUNDRVNTLmFub255bW91c1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmNvbmZpcm0nLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXIvOnRva2VuJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9jb25maXJtLmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ1VzZXJFbWFpbENvbmZpcm1hdGlvbkN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnY29uZmlybScsXHJcblx0XHRcdFx0XHRwYXJhbXM6ICB7XHJcblx0XHRcdFx0XHRcdHRva2VuOiB7XHJcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0c3F1YXNoOiB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRcdGFjY2VzczogY29uZmlnLkFDQ0VTUy5wdWJsaWNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
