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