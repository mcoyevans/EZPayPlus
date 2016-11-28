settings
	.controller('timeInterpretationDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		if($scope.config.action == 'create')
		{
			$scope.time_interpretation = {};
		}
		else if($scope.config.action == 'edit')
		{
			Helper.get($scope.config.url + '/' + $scope.config.id)
				.success(function(data){
					$scope.regular_working_hours = data.regular_working_hours;
					$scope.night_differential = data.night_differential;
					$scope.overtime = data.overtime;
					$scope.overtime_night_differential = data.overtime_night_differential;
					$scope.rest_day_rate = data.rest_day_rate;
					$scope.rest_day_night_differential = data.rest_day_night_differential;
					$scope.rest_day_overtime = data.rest_day_overtime;
					$scope.rest_day_overtime_night_differential = data.rest_day_overtime_night_differential;

					$scope.special_holiday_rate = data.special_holiday_rate;
					$scope.special_holiday_night_differential = data.special_holiday_night_differential;
					$scope.special_holiday_overtime = data.special_holiday_overtime;
					$scope.special_holiday_overtime_night_differential = data.special_holiday_overtime_night_differential;
					$scope.special_holiday_rest_day_rate = data.special_holiday_rest_day_rate;
					$scope.special_holiday_rest_day_night_differential = data.special_holiday_rest_day_night_differential;
					$scope.special_holiday_rest_day_overtime = data.special_holiday_rest_day_overtime;
					$scope.special_holiday_rest_day_overtime_night_differential = data.special_holiday_rest_day_overtime_night_differential;

					$scope.regular_holiday_rate = data.regular_holiday_rate;
					$scope.regular_holiday_night_differential = data.regular_holiday_night_differential;
					$scope.regular_holiday_overtime = data.regular_holiday_overtime;
					$scope.regular_holiday_overtime_night_differential = data.regular_holiday_overtime_night_differential;
					$scope.regular_holiday_rest_day_rate = data.regular_holiday_rest_day_rate;
					$scope.regular_holiday_rest_day_night_differential = data.regular_holiday_rest_day_night_differential;
					$scope.regular_holiday_rest_day_overtime = data.regular_holiday_rest_day_overtime;
					$scope.regular_holiday_rest_day_overtime_night_differential = data.regular_holiday_rest_day_overtime_night_differential;

					$scope.time_interpretation = data;
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post($scope.config.url + '/check-duplicate', $scope.time_interpretation)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.timeInterpretationForm.$invalid){
				angular.forEach($scope.timeInterpretationForm.$error, function(field){
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
					Helper.post($scope.config.url, $scope.time_interpretation)
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
					Helper.put($scope.config.url + '/' + $scope.config.id, $scope.time_interpretation)
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