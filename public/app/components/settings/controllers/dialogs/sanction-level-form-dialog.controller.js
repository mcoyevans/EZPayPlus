settings
	.controller('sanctionLevelDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		Helper.get('/sanction-type')
			.success(function(data){
				$scope.sanctions = data;
			})

		if($scope.config.action == 'create')
		{
			$scope.sanction_level = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.sanction_level = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.sanction_level)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.sanctionLevelForm.$invalid){
				angular.forEach($scope.sanctionLevelForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.sanction_level)
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
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.sanction_level)
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