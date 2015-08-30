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
			'ui.bootstrap'/*,
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQVBQTElDQVRJT05cclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHQvKipcclxuXHQgKiBBcHAgbW9kdWxlXHJcblx0ICogQHR5cGUge0FuZ3VsYXIubW9kdWxlfVxyXG5cdCAqL1xyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFtcclxuXHRcdFx0J3VpLnJvdXRlcicsXHJcblx0XHRcdCd1aS5ib290c3RyYXAnLyosXHJcblx0XHRcdHJlcXVpcmUoJy4vY29udHJvbGxlcnMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKS5uYW1lLFxyXG5cdFx0XHRyZXF1aXJlKCcuL2ZpbHRlcnMvJykubmFtZSxcclxuXHRcdFx0cmVxdWlyZSgnLi9zZXJ2aWNlcycpLm5hbWUqL1xyXG5cdFx0XSlcclxuXHRcdC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdpbmRleCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy8nLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9pbmRleC5odG1sJ1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JHVybFJvdXRlclByb3ZpZGVyXHJcblx0XHRcdFx0Lm90aGVyd2lzZSgnLycpO1xyXG5cclxuXHRcdFx0JGxvY2F0aW9uUHJvdmlkZXJcclxuXHRcdFx0XHQuaHRtbDVNb2RlKHRydWUpO1xyXG5cclxuXHRcdH1dKVxyXG5cdFx0LmNvbnN0YW50KCdjb25maWcnLCB7XHJcblx0XHRcdE5BTUU6ICdBTExNT05FWScsXHJcblx0XHRcdERFQlVHOiB0cnVlLFxyXG5cdFx0XHRTRVJWRVJfQUREUkVTUzogJzg5LjE4OS4xNzYuMTYxJyxcclxuXHRcdFx0U0VSVkVSX1BPUlQ6ICczMDAwJ1xyXG5cdFx0fSk7XHJcblxyXG59KSgpOyJdfQ==
