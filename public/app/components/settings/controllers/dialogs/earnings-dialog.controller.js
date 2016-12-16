settings
	.controller('earningsDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		Helper.get('/de-minimis')
			.success(function(data){
				$scope.de_minimis = data;
			})

		if($scope.config.action == 'create')
		{
			$scope.allowance_type = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.allowance_type = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.allowance_type)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.earningsForm.$invalid){
				angular.forEach($scope.earningsForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				if($scope.config.action == 'create')
				{
					Helper.post($scope.config.url, $scope.allowance_type)
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
				else if($scope.config.action == 'edit')
				{
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.allowance_type)
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
		}
	}]);