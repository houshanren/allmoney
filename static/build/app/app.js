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
			require('./directives').name/*,
			require('./controllers').name,
			require('./directives').name,
			require('./filters/').name,
			require('./services').name*/
		])
		.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'partials/index.html'
				});

			$urlRouterProvider
				.otherwise('/');

			$locationProvider
				.html5Mode(true);

		}])
		.constant('config', {
			NAME: 'ALLMONEY',
			DEBUG: true,
			SERVER_ADDRESS: '89.189.176.161',
			SERVER_PORT: '3000'
		});

})();
},{"./directives":2}],2:[function(require,module,exports){
/**
 * DIRECTIVES
 */

(function () {

	module.exports = angular
		.module('app.directives', []);
		// TODO: common directives


	// requires

})();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyIsInNyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQVBQTElDQVRJT05cclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBBcHAgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFtcclxuXHRcdFx0J3VpLnJvdXRlcicsXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUvKixcclxuXHRcdFx0cmVxdWlyZSgnLi9jb250cm9sbGVycycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLm5hbWUsXHJcblx0XHRcdHJlcXVpcmUoJy4vZmlsdGVycy8nKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL3NlcnZpY2VzJykubmFtZSovXHJcblx0XHRdKVxyXG5cdFx0LmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xyXG5cclxuXHRcdFx0JHN0YXRlUHJvdmlkZXJcclxuXHRcdFx0XHQuc3RhdGUoJ2luZGV4Jywge1xyXG5cdFx0XHRcdFx0dXJsOiAnLycsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2luZGV4Lmh0bWwnXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkdXJsUm91dGVyUHJvdmlkZXJcclxuXHRcdFx0XHQub3RoZXJ3aXNlKCcvJyk7XHJcblxyXG5cdFx0XHQkbG9jYXRpb25Qcm92aWRlclxyXG5cdFx0XHRcdC5odG1sNU1vZGUodHJ1ZSk7XHJcblxyXG5cdFx0fV0pXHJcblx0XHQuY29uc3RhbnQoJ2NvbmZpZycsIHtcclxuXHRcdFx0TkFNRTogJ0FMTE1PTkVZJyxcclxuXHRcdFx0REVCVUc6IHRydWUsXHJcblx0XHRcdFNFUlZFUl9BRERSRVNTOiAnODkuMTg5LjE3Ni4xNjEnLFxyXG5cdFx0XHRTRVJWRVJfUE9SVDogJzMwMDAnXHJcblx0XHR9KTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIERJUkVDVElWRVNcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcC5kaXJlY3RpdmVzJywgW10pO1xyXG5cdFx0Ly8gVE9ETzogY29tbW9uIGRpcmVjdGl2ZXNcclxuXHJcblxyXG5cdC8vIHJlcXVpcmVzXHJcblxyXG59KSgpOyJdfQ==
