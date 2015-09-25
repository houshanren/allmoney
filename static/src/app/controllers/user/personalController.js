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