settings
	.controller('createCostCenterDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.cost_center = {};
		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/cost-center/check-duplicate', $scope.cost_center)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.costCenterForm.$invalid){
				angular.forEach($scope.costCenterForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.post('/cost-center', $scope.cost_center)
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