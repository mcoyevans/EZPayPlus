settings
	.controller('payrollPeriodDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.payroll_period = {};

		$scope.today = new Date();

		if($scope.config.action == 'create')
		{
			$scope.payroll_period.start_cut_off = new Date();
			$scope.payroll_period.end_cut_off = new Date();
			$scope.payroll_period.payout = new Date();
		}

		else if($scope.config.action == 'edit')
		{
			var query = {
				'with': [
					{
						'relation': 'payroll',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': $scope.config.id,
					},
				],
				'first': true,
			}

			Helper.post('/payroll-period/enlist', query)
				.success(function(data){
					data.start_cut_off = new Date(data.start_cut_off);
					data.end_cut_off = new Date(data.end_cut_off);
					data.payout = new Date(data.payout);

					$scope.payroll_period = data;
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

		$scope.checkCutOffs = function(date){
			if(date == 'start')
			{
				if($scope.payroll_period.start_cut_off > $scope.payroll_period.end_cut_off)
				{
					$scope.payroll_period.end_cut_off = new Date($scope.payroll_period.start_cut_off);	
				}
			}
			else if(date == 'end')
			{
				if($scope.payroll_period.end_cut_off > $scope.payroll_period.payout)
				{
					$scope.payroll_period.payout = new Date($scope.payroll_period.end_cut_off);	
				}	
			}

			if($scope.payroll_period.payroll_id)
			{
				var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

				var query = {
					'withCount': [
						{
							'relation': 'payroll_periods',
							'withTrashed': false,
							'whereBetween': months[$scope.payroll_period.start_cut_off.getMonth()],
						},
					],
					'where': [
						{
							'label': 'id',
							'condition': '=',
							'value': $scope.payroll_period.payroll_id,
						},
					],
					'first' : true,
				}

				Helper.post('/payroll/enlist', query)
					.success(function(data){
						if(data.pay_frequency == 'Weekly')
						{
							var max_cut_off = 4;
						}
						else if(data.pay_frequency == 'Semi-monthly')
						{
							var max_cut_off = 2; 
						}
						else if(data.pay_frequency == 'Monthly')
						{
							var max_cut_off = 1; 
						}

						$scope.limit = data.payroll_periods_count == max_cut_off; 
					})
					.error(function(){
						$scope.error = true
					});
			}

			$scope.checkDuplicate();
		}

		$scope.checkDuplicate = function(){
			$scope.payroll_period.start_cut_off = $scope.payroll_period.start_cut_off.toLocaleDateString();
			$scope.payroll_period.end_cut_off = $scope.payroll_period.end_cut_off.toLocaleDateString();
			$scope.payroll_period.payout = $scope.payroll_period.payout.toLocaleDateString();

			Helper.post('/payroll-period/check-duplicate', $scope.payroll_period)
				.success(function(data){
					$scope.duplicate = data;

					$scope.payroll_period.start_cut_off = new Date($scope.payroll_period.start_cut_off);
					$scope.payroll_period.end_cut_off = new Date($scope.payroll_period.end_cut_off);
					$scope.payroll_period.payout = new Date($scope.payroll_period.payout);
				})
		}

		$scope.submit = function(){
			if($scope.payrollPeriodForm.$invalid){
				angular.forEach($scope.payrollPeriodForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			if(!$scope.duplicate && !$scope.limit)
			{
				$scope.busy = true;

				$scope.payroll_period.start_cut_off = $scope.payroll_period.start_cut_off.toLocaleDateString();
				$scope.payroll_period.end_cut_off = $scope.payroll_period.end_cut_off.toLocaleDateString();
				$scope.payroll_period.payout = $scope.payroll_period.payout.toLocaleDateString();

				if($scope.config.action == 'create')
				{
					Helper.post('/payroll-period', $scope.payroll_period)
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

							$scope.payroll_period.start_cut_off = new Date($scope.payroll_period.start_cut_off);
							$scope.payroll_period.end_cut_off = new Date($scope.payroll_period.end_cut_off);
							$scope.payroll_period.payout = new Date($scope.payroll_period.payout);
						});
				}
				if($scope.config.action == 'edit')
				{
					Helper.put('/payroll-period/' + $scope.config.id, $scope.payroll_period)
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

							$scope.payroll_period.start_cut_off = new Date($scope.payroll_period.start_cut_off);
							$scope.payroll_period.end_cut_off = new Date($scope.payroll_period.end_cut_off);
							$scope.payroll_period.payout = new Date($scope.payroll_period.payout);
						});
				}
			}
		}

		Helper.get('/payroll')
			.success(function(data){
				$scope.payrolls = data;
			})
	}]);