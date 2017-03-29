payroll
	.controller('thirteenthMonthPayEntryDialogController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.thirteenth_month_pay_process = Helper.fetch();

		$scope.thirteenth_month_pay_process.start = new Date($scope.thirteenth_month_pay_process.start);
		$scope.thirteenth_month_pay_process.end = new Date($scope.thirteenth_month_pay_process.end);

		$scope.thirteenth_month_pay_entry = {}

		$scope.thirteenth_month_pay_entry.thirteenth_month_pay_process_id = $scope.thirteenth_month_pay_process.id;

		if($scope.thirteenth_month_pay_process.action == 'create')
		{

		}
		else if($scope.thirteenth_month_pay_process.action == 'edit')
		{

		}

		$scope.cancel = function(){
			Helper.cancel();
		}

		var query = {
			'where': [
				{
					'label':'batch_id',
					'condition': '=',
					'value': $scope.thirteenth_month_pay_process.batch_id,
				},
			],
			'whereDoesntHave': [
				{
					'relation': 'thirteen_month_pay_entries',
					'where': [
						{
							'label':'id',
							'condition':'=',
							'value':$scope.thirteenth_month_pay_process.id,
						}
					],
				},
			],
		}

		Helper.post('/employee/enlist', query)
			.success(function(data){
				$scope.employees = data;
			})
			.error(function(){
				Helper.error();
			})

		$scope.partial_amount = 0;

		$scope.fetchPartialAmount = function(){
			$scope.checkDuplicate();

			var query = {
				'with': [
					{
						'relation': 'payroll_process.payroll_period',
						'withTrashed': false,
						'whereBetween': {
							'label': 'start_cut_off',
							'start': $scope.thirteenth_month_pay_process.start.toDateString(),
							'end': $scope.thirteenth_month_pay_process.end.toDateString(),
						},
					},
				],
				'where': [
					{
						'label': 'employee_id',
						'condition': '=',
						'value': $scope.thirteenth_month_pay_entry.employee.id,
					},
				],
			}

			Helper.post('/payroll-entry/enlist', query)
				.success(function(data){
					$scope.payroll_entries = data;
					
					angular.forEach($scope.payroll_entries, function(item){
						$scope.partial_amount += item.partial_thirteenth_month_pay;
						item.payroll_process.payroll_period.start_cut_off = new Date(item.payroll_process.payroll_period.start_cut_off);
						item.payroll_process.payroll_period.end_cut_off = new Date(item.payroll_process.payroll_period.end_cut_off);
						item.payroll_process.payroll_period.payout = new Date(item.payroll_process.payroll_period.payout);
					});

					$scope.thirteenth_month_pay_entry.net_pay = $scope.partial_amount;
				})
				.error(function(){
					Helper.error();
				})
		}

		$scope.checkDuplicate = function(){
			var query = {
				'where': [
					{
						'label': 'thirteenth_month_pay_process_id',
						'condition': '=',
						'value': $scope.thirteenth_month_pay_process.id,
					},
					{
						'label': 'employee_id',
						'condition': '=',
						'value': $scope.thirteenth_month_pay_entry.employee.id,
					},
				],
				'first': true,
			}

			Helper.post('/thirteenth-month-pay-entry/enlist', query)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Helper.error();
				})
		}

		$scope.submit = function(){
			if($scope.thirteenthMonthPayEntryForm.$invalid){
				angular.forEach($scope.thirteenthMonthPayEntryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
		}
	}]);