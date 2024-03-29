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