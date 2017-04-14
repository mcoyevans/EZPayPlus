auth
	.controller('formController', ['$scope', function($scope){
		$scope.show = function(){
			angular.element(document.querySelector('.main-view')).removeClass('no-opacity');
		};
	}]);