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