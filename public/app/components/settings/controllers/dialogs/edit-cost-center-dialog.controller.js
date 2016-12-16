settings
	.controller('editCostCenterDialogController', ['$scope', 'Helper', function($scope, Helper){
		var cost_center = Helper.fetch();

		Helper.get('/cost-center/' + cost_center.id)
			.success(function(data){
				$scope.cost_center = data;
			})
			.error(function(){
				Preloader.error();
			});

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
				Helper.put('/cost-center/' + $scope.cost_center.id, $scope.cost_center)
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