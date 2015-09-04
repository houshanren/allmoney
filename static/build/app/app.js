(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * APPLICATION
 */

(function () {

	/**
	 * App module
	 * @type {Angular.module}
	 */
	angular
		.module('app', [
			'ui.router',
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
			SERVER_ADDRESS: '89.189.176.161',
			SERVER_PORT: '3000'
		});

	// requires
	require('./routes');

})();
},{"./controllers":2,"./directives":5,"./filters":6,"./routes":9,"./services":10,"./user":11}],2:[function(require,module,exports){
/**
 * CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers', []);
		// TODO: common controllers


	// requires

})();
},{}],3:[function(require,module,exports){
/**
 * USER CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers.user', []);
		// TODO: common controllers


	// requires
	require('./loginControllers');

})();
},{"./loginControllers":4}],4:[function(require,module,exports){
/**
 * USER LOGIN CONTROLLERS
 */

(function () {

	/**
	 * Login controllers
	 * @type {Angular.module}
	 */
	angular
		.module('app.controllers.user')
		.controller('LoginController', ['$scope', function ($scope) {

			$scope.initial = {};
			$scope.user = angular.copy($scope.initial);

			// ...

			// TODO: login submit
			$scope.submit = function () {

				console.log($scope.user);
				// ...

				// reset form
				$scope.reset();

			};

			$scope.reset = function () {

				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
				$scope.user = angular.copy($scope.initial);

			};

			

		}]);

})();
},{}],5:[function(require,module,exports){
/**
 * DIRECTIVES
 */

(function () {

	module.exports = angular
		.module('app.directives', []);
		// TODO: common directives


	// requires

})();
},{}],6:[function(require,module,exports){
/**
 * FILTERS
 */

(function () {

	module.exports = angular
		.module('app.filters', []);
		// TODO: common filters


	// requires

})();
},{}],7:[function(require,module,exports){
/**
 * USER LOGIN
 */

(function () {

	/**
	 * Login module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.login', [
			'ui.router',
			require('./controllers/user').name
		])
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.login', {
					url: '/login',
					templateUrl: 'partials/user/login.html',
					controller: 'LoginController',
					controllerAs: 'login'
				});

		}]);

	// requires

})();
},{"./controllers/user":3}],8:[function(require,module,exports){
/**
 * USER REGISTER
 */

(function () {

	/**
	 * Register module
	 * @type {Angular.module}
	 */
	module.exports = angular
		.module('app.user.register', [
			'ui.router'
		])
		.config(['$stateProvider', function ($stateProvider) {

			$stateProvider
				.state('user.register', {
					url: '/register',
					templateUrl: 'partials/user/register.html'
				});

		}]);

	// requires

})();
},{}],9:[function(require,module,exports){
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
					templateUrl: 'partials/index.html'
				});

			$urlRouterProvider
				.otherwise('/');

		}]);

})();
},{}],10:[function(require,module,exports){
/**
 * SERVICES
 */

(function () {

	module.exports = angular
		.module('app.services', []);
		// TODO: common services


	// requires

})();
},{}],11:[function(require,module,exports){
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
			'ui.router',
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
					templateUrl: 'partials/user/view.html'
				});

		}]);

	// requires

})();
},{"./login":7,"./register":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvaW5kZXguanMiLCJzcmMvYXBwL2NvbnRyb2xsZXJzL3VzZXIvbG9naW5Db250cm9sbGVycy5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qcyIsInNyYy9hcHAvZmlsdGVycy9pbmRleC5qcyIsInNyYy9hcHAvbG9naW4uanMiLCJzcmMvYXBwL3JlZ2lzdGVyLmpzIiwic3JjL2FwcC9yb3V0ZXMuanMiLCJzcmMvYXBwL3NlcnZpY2VzL2luZGV4LmpzIiwic3JjL2FwcC91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQVBQTElDQVRJT05cclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBBcHAgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFtcclxuXHRcdFx0J3VpLnJvdXRlcicsXHJcblx0XHRcdC8vIGNvbXBvbmVudHNcclxuXHRcdFx0cmVxdWlyZSgnLi9kaXJlY3RpdmVzJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZmlsdGVycycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vc2VydmljZXMnKS5uYW1lLFxyXG5cdFx0XHQvLyBtb2R1bGVzXHJcblx0XHRcdHJlcXVpcmUoJy4vdXNlcicpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJGxvY2F0aW9uUHJvdmlkZXInLCBmdW5jdGlvbiAoJGxvY2F0aW9uUHJvdmlkZXIpIHtcclxuXHJcblx0XHRcdCRsb2NhdGlvblByb3ZpZGVyXHJcblx0XHRcdFx0Lmh0bWw1TW9kZSh0cnVlKTtcclxuXHJcblx0XHR9XSlcclxuXHRcdC5jb25zdGFudCgnY29uZmlnJywge1xyXG5cdFx0XHROQU1FOiAnQUxMTU9ORVknLFxyXG5cdFx0XHRERUJVRzogdHJ1ZSxcclxuXHRcdFx0U0VSVkVSX0FERFJFU1M6ICc4OS4xODkuMTc2LjE2MScsXHJcblx0XHRcdFNFUlZFUl9QT1JUOiAnMzAwMCdcclxuXHRcdH0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cdHJlcXVpcmUoJy4vcm91dGVzJyk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGNvbnRyb2xsZXJzXHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBDT05UUk9MTEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gY29udHJvbGxlcnNcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblx0cmVxdWlyZSgnLi9sb2dpbkNvbnRyb2xsZXJzJyk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBVU0VSIExPR0lOIENPTlRST0xMRVJTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0LyoqXHJcblx0ICogTG9naW4gY29udHJvbGxlcnNcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzLnVzZXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xyXG5cclxuXHRcdFx0JHNjb3BlLmluaXRpYWwgPSB7fTtcclxuXHRcdFx0JHNjb3BlLnVzZXIgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmluaXRpYWwpO1xyXG5cclxuXHRcdFx0Ly8gLi4uXHJcblxyXG5cdFx0XHQvLyBUT0RPOiBsb2dpbiBzdWJtaXRcclxuXHRcdFx0JHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXIpO1xyXG5cdFx0XHRcdC8vIC4uLlxyXG5cclxuXHRcdFx0XHQvLyByZXNldCBmb3JtXHJcblx0XHRcdFx0JHNjb3BlLnJlc2V0KCk7XHJcblxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0JHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkc2NvcGUubG9naW5Gb3JtLiRzZXRQcmlzdGluZSgpO1xyXG5cdFx0XHRcdCRzY29wZS5sb2dpbkZvcm0uJHNldFVudG91Y2hlZCgpO1xyXG5cdFx0XHRcdCRzY29wZS51c2VyID0gYW5ndWxhci5jb3B5KCRzY29wZS5pbml0aWFsKTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBESVJFQ1RJVkVTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFtdKTtcclxuXHRcdC8vIFRPRE86IGNvbW1vbiBkaXJlY3RpdmVzXHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogRklMVEVSU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLmZpbHRlcnMnLCBbXSk7XHJcblx0XHQvLyBUT0RPOiBjb21tb24gZmlsdGVyc1xyXG5cclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVTRVIgTE9HSU5cclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBMb2dpbiBtb2R1bGVcclxuXHQgKiBAdHlwZSB7QW5ndWxhci5tb2R1bGV9XHJcblx0ICovXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAudXNlci5sb2dpbicsIFtcclxuXHRcdFx0J3VpLnJvdXRlcicsXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMvdXNlcicpLm5hbWVcclxuXHRcdF0pXHJcblx0XHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCd1c2VyLmxvZ2luJywge1xyXG5cdFx0XHRcdFx0dXJsOiAnL2xvZ2luJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvdXNlci9sb2dpbi5odG1sJyxcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlckFzOiAnbG9naW4nXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUiBSRUdJU1RFUlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlZ2lzdGVyIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyLnJlZ2lzdGVyJywgW1xyXG5cdFx0XHQndWkucm91dGVyJ1xyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIucmVnaXN0ZXInLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2VyL3JlZ2lzdGVyLmh0bWwnXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fV0pO1xyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogUk9VVEVTXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgnaW5kZXgnLCB7XHJcblx0XHRcdFx0XHR1cmw6ICcvJyxcclxuXHRcdFx0XHRcdHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaW5kZXguaHRtbCdcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdCR1cmxSb3V0ZXJQcm92aWRlclxyXG5cdFx0XHRcdC5vdGhlcndpc2UoJy8nKTtcclxuXHJcblx0XHR9XSk7XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBTRVJWSUNFU1xyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdG1vZHVsZS5leHBvcnRzID0gYW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pO1xyXG5cdFx0Ly8gVE9ETzogY29tbW9uIHNlcnZpY2VzXHJcblxyXG5cclxuXHQvLyByZXF1aXJlc1xyXG5cclxufSkoKTsiLCIvKipcclxuICogVVNFUlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIExvZ2luIG1vZHVsZVxyXG5cdCAqIEB0eXBlIHtBbmd1bGFyLm1vZHVsZX1cclxuXHQgKi9cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC51c2VyJywgW1xyXG5cdFx0XHQndWkucm91dGVyJyxcclxuXHRcdFx0cmVxdWlyZSgnLi9sb2dpbicpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vcmVnaXN0ZXInKS5uYW1lXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcblxyXG5cdFx0XHQkc3RhdGVQcm92aWRlclxyXG5cdFx0XHRcdC5zdGF0ZSgndXNlcicsIHtcclxuXHRcdFx0XHRcdHVybDogJy91c2VyJyxcclxuXHRcdFx0XHRcdGFic3RyYWN0OiB0cnVlLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICc8dWktdmlldz4nXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ3VzZXIudmlldycsIHtcclxuXHRcdFx0XHRcdHVybDogJy97aWQ6aW50fScsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXIvdmlldy5odG1sJ1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdH1dKTtcclxuXHJcblx0Ly8gcmVxdWlyZXNcclxuXHJcbn0pKCk7Il19
