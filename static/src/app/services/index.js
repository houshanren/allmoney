/**
 * SERVICES
 */

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