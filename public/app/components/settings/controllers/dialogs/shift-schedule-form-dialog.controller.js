settings
	.controller('shiftScheduleDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.shift_schedule = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.shift_schedule = data;
					$scope.shift_schedule.paid = data.paid ? true : false;
					$scope.shift_schedule.convertible = data.convertible ? true : false;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.shift_schedule)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.shiftScheduleForm.$invalid){
				angular.forEach($scope.shiftScheduleForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.shift_schedule)
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
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.shift_schedule)
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