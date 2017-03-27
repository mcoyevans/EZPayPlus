payroll
	.controller('thirteenthMonthPayProcessDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.thirteenth_month_pay_process = {};

		$scope.today = new Date();

		if($scope.config.action == 'create')
		{
			$scope.thirteenth_month_pay_process.start = new Date(new Date().getFullYear(), 0, 1);
			$scope.thirteenth_month_pay_process.end = new Date(new Date().getFullYear(), 11, 31);
			$scope.thirteenth_month_pay_process.payout = new Date(new Date().getFullYear(), 11, 24);
		}

		else if($scope.config.action == 'edit')
		{
			var query = {
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first': true,
			}

			Helper.post('/thirteenth-month-pay-process/enlist', query)
				.success(function(data){
					$scope.thirteenth_month_pay_process = data;

					$scope.thirteenth_month_pay_process.start = new Date($scope.thirteenth_month_pay_process.start);
					$scope.thirteenth_month_pay_process.end = new Date($scope.thirteenth_month_pay_process.end);
					$scope.thirteenth_month_pay_process.payout = new Date($scope.thirteenth_month_pay_process.payout);
				})
				.error(function(){
					Helper.error();
				})
		}

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(date){
			if(date == 'start')
			{
				if($scope.thirteenth_month_pay_process.start > $scope.thirteenth_month_pay_process.end)
				{
					$scope.thirteenth_month_pay_process.end = new Date($scope.thirteenth_month_pay_process.start);	
				}
			}
			else if(date == 'end')
			{
				if($scope.thirteenth_month_pay_process.end > $scope.thirteenth_month_pay_process.payout)
				{
					$scope.thirteenth_month_pay_process.payout = new Date($scope.thirteenth_month_pay_process.end);	
				}	
			}

			var query = {
				'id': $scope.thirteenth_month_pay_process.id,
				'batch_id': $scope.thirteenth_month_pay_process.batch_id,
				'start': $scope.thirteenth_month_pay_process.start.toDateString(),
				'end': $scope.thirteenth_month_pay_process.end.toDateString(),
				'payout': $scope.thirteenth_month_pay_process.payout.toDateString(),
			}

			Helper.post('/thirteenth-month-pay-process/check-duplicate', query)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					$scope.error = true;
				})
		}

		var convertDates = function(){
			$scope.thirteenth_month_pay_process.start = new Date($scope.thirteenth_month_pay_process.start);
			$scope.thirteenth_month_pay_process.end = new Date($scope.thirteenth_month_pay_process.end);
			$scope.thirteenth_month_pay_process.payout = new Date($scope.thirteenth_month_pay_process.payout);
		}

		$scope.submit = function(){
			if($scope.thirteenthMonthPayProcessForm.$invalid){
				angular.forEach($scope.thirteenthMonthPayProcessForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				$scope.thirteenth_month_pay_process.start = $scope.thirteenth_month_pay_process.start.toDateString();
				$scope.thirteenth_month_pay_process.end = $scope.thirteenth_month_pay_process.end.toDateString();
				$scope.thirteenth_month_pay_process.payout = $scope.thirteenth_month_pay_process.payout.toDateString();

				if($scope.config.action == 'create')
				{
					Helper.post('/thirteenth-month-pay-process', $scope.thirteenth_month_pay_process)
						.success(function(duplicate){
							if(duplicate){
								convertDates();
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							convertDates();
							$scope.busy = false;
							$scope.error = true;
						});
				}
				if($scope.config.action == 'edit')
				{
					Helper.put('/thirteenth-month-pay-process/' + $scope.config.id, $scope.thirteenth_month_pay_process)
						.success(function(duplicate){
							if(duplicate){
								convertDates();
								$scope.busy = false;
								return;
							}

							Helper.stop();
						})
						.error(function(){
							convertDates();
							$scope.busy = false;
							$scope.error = true;
						});
				}
			}
		}

		Helper.get('/batch')
			.success(function(data){
				$scope.batches = data;
			})
			.error(function(){
				Helper.error();
			})
	}]);