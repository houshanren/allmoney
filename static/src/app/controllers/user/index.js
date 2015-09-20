/**
 * USER CONTROLLERS
 */

(function () {

	module.exports = angular
		.module('app.controllers.user', [])
		// TODO: common controllers
		.controller('UserCtrl', ['$scope', '$stateParams', '$state', '$auth', 'User', function ($scope, $stateParams, $state, $auth, User) {

			$scope.isMyProfile = false;

			User.getById($stateParams.id)
				.success(function (res) {

					$scope.data = res;
					if ($scope.data._id === $auth.user._id) {
						$scope.isMyProfile = true;
					}

				})
				.error(function (res, status) {

					/*if (status == 404) $state.go('404');*/
					if (!!res.message) console.log(res.message);

				});

		}]);

	// requires
	require('./loginControllers');
	require('./registerControllers');

})();