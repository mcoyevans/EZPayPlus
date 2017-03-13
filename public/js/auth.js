var auth = angular.module('auth', ['ngMaterial', 'ngMessages',]);
auth
	.config(['$mdThemingProvider', function($mdThemingProvider){
		/* Defaul Theme Blue - Light Blue */
		$mdThemingProvider.theme('default')
			.primaryPalette('blue')
			.accentPalette('deep-purple')
	}]);
auth
	.controller('formController', ['$scope', function($scope){
		$scope.show = function(){
			angular.element(document.querySelector('.main-view')).removeClass('no-opacity');
		};
	}]);
//# sourceMappingURL=auth.js.map
