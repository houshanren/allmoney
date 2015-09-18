(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./controllers":2,"./directives":6,"./filters":7,"./routes":10,"./services":11,"./user":14}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
					console.log(data.message);

				});

		}]);

	// requires
	require('./loginControllers');
	require('./registerControllers');

})();
},{"./loginControllers":4,"./registerControllers":5}],4:[function(require,module,exports){
/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('LoginCtrl', ['$scope', 'Authentication', function ($scope, Authentication) {

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

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
},{}],5:[function(require,module,exports){
/**
 * USER REGISTER CONTROLLERS
 */

(function () {

	angular
		.module('app.controllers.user')
		.controller('RegisterCtrl', ['$scope', 'config', function ($scope, config) {

			// TODO: name roles
			$scope.roles = config.ROLES;
			$scope.codeRole = {};
			// define for guest
			$scope.availableRoles = [0, 3, 4, 5];

			$scope.initial = {};
			$scope.data = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				// TODO: service check
				console.log($scope.data);
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
},{}],6:[function(require,module,exports){
/**
 * DIRECTIVES
 */

(function () {

	module.exports = angular
		.module('app.directives', []);
		// TODO: common directives


	// requires

})();
},{}],7:[function(require,module,exports){
/**
 * FILTERS
 */

(function () {

	module.exports = angular
		.module('app.filters', []);
		// TODO: common filters


	// requires

})();
},{}],8:[function(require,module,exports){
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
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.login', {
					url: '/login',
					templateUrl: 'partials/user/login.html',
					controller: 'LoginCtrl',
					controllerAs: 'login'
				});

		}]);

	// requires

})();
},{}],9:[function(require,module,exports){
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
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.register', {
					url: '/register',
					templateUrl: 'partials/user/register.html',
					controller: 'RegisterCtrl',
					controllerAs: 'register'
				});

		}]);

	// requires

})();
},{}],10:[function(require,module,exports){
/**
 * ROUTES
 */

(function () {

	module.exports = angular
		.module('app')
		.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'partials/index.html',
					controller: 'IndexCtrl',
					controllerAs: 'index'
				})
				.state('404', {
					url: '/404',
					templateUrl: 'partials/404.html'
				});

			$urlRouterProvider
				.otherwise('/404');

		}]);

})();
},{}],11:[function(require,module,exports){
/**
 * SERVICES
 */

(function () {

	module.exports = angular
		.module('app.services', []);
		// TODO: common services


	// requires

})();
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
	require('./authenticationService');

})();
},{"./authenticationService":12}],14:[function(require,module,exports){
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
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user', {
					url: '/user',
					abstract: true,
					template: '<ui-view>'
				})
				.state('user.view', {
					url: '/{id:int}',
					templateUrl: 'partials/user/view.html',
					controller: 'UserCtrl',
					controllerAs: 'user'
				});

		}]);

	// requires

})();
},{"./controllers/user":3,"./login":8,"./register":9,"./services/user":13}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVycy5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvdXNlci9yZWdpc3RlckNvbnRyb2xsZXJzLmpzIiwic3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwic3JjL2FwcC9maWx0ZXJzL2luZGV4LmpzIiwic3JjL2FwcC9sb2dpbi5qcyIsInNyYy9hcHAvcmVnaXN0ZXIuanMiLCJzcmMvYXBwL3JvdXRlcy5qcyIsInNyYy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJzcmMvYXBwL3NlcnZpY2VzL3VzZXIvYXV0aGVudGljYXRpb25TZXJ2aWNlLmpzIiwic3JjL2FwcC9zZXJ2aWNlcy91c2VyL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiAqIEFQUExJQ0FUSU9OXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogQXBwIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnLCBbXHJcblx0XHRcdCd1aS5yb3V0ZXInLFxyXG5cdFx0XHQnbmdTYW5pdGl6ZScsXHJcblx0XHRcdCd1aS5zZWxlY3QnLFxyXG5cdFx0XHQvLyBjb21wb25lbnRzXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzJykubmFtZSxcclxuXHRcdFx0Ly8gbW9kdWxlc1xyXG5cdFx0XHRyZXF1aXJlKCcuL3VzZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRsb2NhdGlvblByb3ZpZGVyJywgZnVuY3Rpb24gKCRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0TkFNRTogJ0FMTE1PTkVZJyxcclxuXHRcdFx0REVCVUc6IHRydWUsXHJcblx0XHRcdFJPTEVTOiBbXHJcblx0XHRcdFx0J9Ce0LHRi9GH0L3Ri9C5INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCcsXHJcblx0XHRcdFx0J9Cc0L7QtNC10YDQsNGC0L7RgCcsXHJcblx0XHRcdFx0J9CQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAJyxcclxuXHRcdFx0XHQn0KfQsNGB0YLQvdC+0LUg0LvQuNGG0L4nLFxyXG5cdFx0XHRcdCfQnNCk0J4nLFxyXG5cdFx0XHRcdCfQm9C+0LzQsdCw0YDQtCdcclxuXHRcdFx0XSxcclxuXHRcdFx0Q0lUSUVTOiBbXHJcblx0XHRcdFx0J9CS0YHQtSDQs9C+0YDQvtC00LAnLFxyXG5cdFx0XHRcdCfQnNC+0YHQutCy0LAnLFxyXG5cdFx0XHRcdCfQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsycsXHJcblx0XHRcdFx0J9Cd0L7QstC+0YHQuNCx0LjRgNGB0LonLFxyXG5cdFx0XHRcdCfQndC40LbQvdC40Lkt0J3QvtCy0LPQvtGA0L7QtCcsXHJcblx0XHRcdFx0J9Ca0YDQsNGB0L3QvtGP0YDRgdC6JyxcclxuXHRcdFx0XHQn0JrQsNC30LDQvdGMJyxcclxuXHRcdFx0XHQn0JXQutCw0YLQtdGA0LjQvdCx0YPRgNCzJ1xyXG5cdFx0XHRdXHJcblx0XHR9KTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHRyZXF1aXJlKCcuL3JvdXRlcycpO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycycsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblx0XHQuY29udHJvbGxlcignSW5kZXhDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRzdGF0ZScsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgY29uZmlnKSB7XHJcblxyXG5cdFx0XHQkc2NvcGUuY2l0aWVzID0gY29uZmlnLkNJVElFUztcclxuXHRcdFx0JHNjb3BlLmNvZGVDaXR5ID0ge307XHJcblx0XHRcdC8vIGRlZmluZSBmb3IgZ3Vlc3RcclxuXHRcdFx0JHNjb3BlLmF2YWlsYWJsZUNpdGllcyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3XTtcclxuXHJcblx0XHRcdC8vIFRFTVA6IGRlZmluZSBsb2NhdGlvblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInLCBbXSlcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBjb250cm9sbGVyc1xyXG5cdFx0LmNvbnRyb2xsZXIoJ1VzZXJDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRzdGF0ZScsICdVc2VyJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIFVzZXIpIHtcclxuXHJcblx0XHRcdFVzZXIuZ2V0QnlJZCgkc3RhdGVQYXJhbXMuaWQpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IGRhdGE7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cykge1xyXG5cclxuXHRcdFx0XHRcdC8qaWYgKHN0YXR1cyA9PSA0MDQpICRzdGF0ZS5nbygnNDA0Jyk7Ki9cclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEubWVzc2FnZSk7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHRyZXF1aXJlKCcuL2xvZ2luQ29udHJvbGxlcnMnKTtcclxuXHRyZXF1aXJlKCcuL3JlZ2lzdGVyQ29udHJvbGxlcnMnKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU4gQ09OVFJPTExFUlNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuY29udHJvbGxlcnMudXNlcicpXHJcblx0XHQuY29udHJvbGxlcignTG9naW5DdHJsJywgWyckc2NvcGUnLCAnQXV0aGVudGljYXRpb24nLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoZW50aWNhdGlvbikge1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLmRhdGEgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBsb2dpbiBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogc2VydmljZSBjaGVja1xyXG5cdFx0XHRcdEF1dGhlbnRpY2F0aW9uLmxvZ2luKCRzY29wZS5kYXRhKTtcclxuXHRcdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdFx0Ly8gcmVzZXQgZm9ybVxyXG5cdFx0XHRcdCRzY29wZS5yZXNldCgpO1xyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdCRzY29wZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmxvZ2luRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuXHRcdFx0XHQkc2NvcGUubG9naW5Gb3JtLiRzZXRVbnRvdWNoZWQoKTtcclxuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0XHJcblxyXG5cdFx0fV0pO1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBSRUdJU1RFUiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5jb250cm9sbGVycy51c2VyJylcclxuXHRcdC5jb250cm9sbGVyKCdSZWdpc3RlckN0cmwnLCBbJyRzY29wZScsICdjb25maWcnLCBmdW5jdGlvbiAoJHNjb3BlLCBjb25maWcpIHtcclxuXHJcblx0XHRcdC8vIFRPRE86IG5hbWUgcm9sZXNcclxuXHRcdFx0JHNjb3BlLnJvbGVzID0gY29uZmlnLlJPTEVTO1xyXG5cdFx0XHQkc2NvcGUuY29kZVJvbGUgPSB7fTtcclxuXHRcdFx0Ly8gZGVmaW5lIGZvciBndWVzdFxyXG5cdFx0XHQkc2NvcGUuYXZhaWxhYmxlUm9sZXMgPSBbMCwgMywgNCwgNV07XHJcblxyXG5cdFx0XHQkc2NvcGUuaW5pdGlhbCA9IHt9O1xyXG5cdFx0XHQkc2NvcGUuZGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuaW5pdGlhbCk7XHJcblxyXG5cdFx0XHQvLyAuLi5cclxuXHJcblx0XHRcdC8vIFRPRE86IGxvZ2luIHN1Ym1pdFxyXG5cdFx0XHQkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBzZXJ2aWNlIGNoZWNrXHJcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLmRhdGEpO1xyXG5cdFx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0XHQvLyByZXNldCBmb3JtXHJcblx0XHRcdFx0JHNjb3BlLnJlc2V0KCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUucmVnaXN0ZXJGb3JtLiRzZXRQcmlzdGluZSgpO1xyXG5cdFx0XHRcdCRzY29wZS5yZWdpc3RlckZvcm0uJHNldFVudG91Y2hlZCgpO1xyXG5cdFx0XHRcdCRzY29wZS5kYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBESVJFQ1RJVkVTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFtdKTtcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBkaXJlY3RpdmVzXHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRklMVEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gZmlsdGVyc1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU5cclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5sb2dpbicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5sb2dpbicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9sb2dpbicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvbG9naW4uaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ2xvZ2luJ1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgUkVHSVNURVJcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBSZWdpc3RlciBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5yZWdpc3RlcicsIFtdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlci5yZWdpc3RlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy9yZWdpc3RlcicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvcmVnaXN0ZXIuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJ1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFJPVVRFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2luZGV4Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLycsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2luZGV4Lmh0bWwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlcjogJ0luZGV4Q3RybCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyQXM6ICdpbmRleCdcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgnNDA0Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLzQwNCcsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzLzQwNC5odG1sJ1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHVybFJvdXRlclByb3ZpZGVyXHJcblx0XHRcdFx0Lm90aGVyd2lzZSgnLzQwNCcpO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMnLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gc2VydmljZXNcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIEFVVEhFTlRJQ0FUSU9OIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMudXNlcicpXHJcblx0XHQuZmFjdG9yeSgnQXV0aGVudGljYXRpb24nLCBbJyRodHRwJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBwdWJsaWNMb2dpbihkYXRhKSB7XHJcblxyXG5cdFx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsb2dpbjogcHVibGljTG9naW5cclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIFNFUlZJQ0VTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuc2VydmljZXMudXNlcicsIFtdKVxyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblx0XHQuZmFjdG9yeSgnVXNlcicsIFsnJGh0dHAnLCBmdW5jdGlvbiAoJGh0dHApIHtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIHB1YmxpY0dldEJ5SWQoaWQpIHtcclxuXHJcblx0XHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VyLycgKyBpZCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGdldEJ5SWQ6IHB1YmxpY0dldEJ5SWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vYXV0aGVudGljYXRpb25TZXJ2aWNlJyk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnVzZXInLCBbXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vc2VydmljZXMvdXNlcicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vbG9naW4nKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3JlZ2lzdGVyJykubmFtZVxyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXInLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvdXNlcicsXHJcblx0XHRcdFx0XHRhYnN0cmFjdDogdHJ1ZSxcclxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnPHVpLXZpZXc+J1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLnZpZXcnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcve2lkOmludH0nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3ZpZXcuaHRtbCcsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnVXNlckN0cmwnLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAndXNlcidcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
