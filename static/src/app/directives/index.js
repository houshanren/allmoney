/**
 * DIRECTIVES
 */

(function () {

	module.exports = angular
		.module('app.directives', [])
		.directive('userPanel', ['$state', 'config', function ($state, config) {

			return {
				restrict: 'A',
				templateUrl: 'partials/user-panel.html',
				controller: 'UserPanelCtrl',
				controllerAs: 'userpanel'
			};

		}]);
		// TODO: common directives


	// requires

})();