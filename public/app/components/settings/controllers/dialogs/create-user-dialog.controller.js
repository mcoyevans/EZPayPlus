settings
	.controller('createUserDialogController', ['$scope', 'Helper', function($scope, Helper){
		var user = Helper.authUser();

		$scope.user = {};

		$scope.duplicate = false;

		$scope.busy = false;
		
		Helper.post('/group/enlist')
			.success(function(data){
				$scope.groups = data;
			})

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user/check-email', $scope.user)
				.success(function(data){
					$scope.duplicate = data ? true : false;
				})
		}

		$scope.submit = function(){
			$scope.error = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate && $scope.user.password == $scope.user.confirm)
			{
				$scope.busy = true;
				Helper.post('/user', $scope.user)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;
					});
			}
		}
	}]);