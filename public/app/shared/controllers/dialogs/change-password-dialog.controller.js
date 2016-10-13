sharedModule
	.controller('changePasswordDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.password = {};

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.checkPassword = function(){
			Helper.post('/user/check-password', $scope.password)
				.success(function(data){
					$scope.match = data;
					$scope.show = true;
				});
		}

		$scope.submit = function(){
			$scope.showErrors = true;
			if($scope.changePasswordForm.$invalid){
				angular.forEach($scope.changePasswordForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});
			}
			else if($scope.password.old == $scope.password.new || $scope.password.new != $scope.password.confirm)
			{
				return;
			}
			else {
				$scope.busy = true;
				Helper.post('/user/change-password', $scope.password)
					.success(function(){
						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;
					});
			}
		}
	}]);