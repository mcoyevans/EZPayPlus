settings
	.controller('editLaborTypeDialogController', ['$scope', 'Helper', function($scope, Helper){
		var labor_type = Helper.fetch();

		Helper.get('/labor-type/' + labor_type.id)
			.success(function(data){
				$scope.labor_type = data;
			})

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/labor-type/check-duplicate', $scope.labor_type)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.laborTypeForm.$invalid){
				angular.forEach($scope.laborTypeForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/labor-type/' + labor_type.id, $scope.labor_type)
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