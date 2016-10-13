settings
	.controller('createGroupDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.group = {};
		$scope.group.modules = [];
		$scope.duplicate = false;

		$scope.busy = false;

		Helper.get('/module')
			.success(function(data){
				$scope.modules = data;
			})

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/group/check-duplicate', $scope.group)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.groupForm.$invalid){
				angular.forEach($scope.groupForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				
				Helper.post('/group', $scope.group)
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