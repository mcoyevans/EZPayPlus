sharedModule
	.controller('listItemActionsDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.data = Helper.fetch();
	}]);