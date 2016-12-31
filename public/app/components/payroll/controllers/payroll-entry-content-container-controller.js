payroll
	.controller('payrollEntryContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var payrollProcessID = $stateParams.payrollProcessID;

		$scope.form = {}

		$scope.payroll_entry = {};

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};


		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.payrollEntryForm.$invalid){
				angular.forEach($scope.form.payrollEntryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				Helper.alert('Oops!', 'Kindly check form for errors.');

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				Helper.preload();

				if(!$stateParams.payrollEntryID)
				{
					Helper.post('/payroll-entry', $scope.payroll_entry)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.payroll-process', {'payrollProcessID': payrollProcessID});
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
				else
				{
					Helper.put('/payroll-entry/' + $stateParams.payrollEntryID, $scope.payroll_entry)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.payroll-process', {'payrollProcessID': $stateParams.payrollProcessID});
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
			}
		}

		$scope.setEmployee = function(){
			$scope.payroll_entry.allowances = [];
			$scope.payroll_entry.deductions = [];

			angular.forEach($scope.payroll_entry.employee.allowance_types, function(item, key){
				var allowance = {};

				allowance.name = item.name;
				allowance.description = item.description;
				allowance.amount = item.pivot.amount;
				allowance.employee_allowance_type_id = item.pivot.id;

				$scope.payroll_entry.allowances[key] = allowance;
			});

			angular.forEach($scope.payroll_entry.employee.deduction_types, function(item, key){
				var deduction = {};

				deduction.name = item.name;
				deduction.description = item.description;
				deduction.amount = item.pivot.amount;
				deduction.employee_deduction_type_id = item.pivot.id;

				$scope.payroll_entry.deductions[key] = deduction;
			});

			$scope.daily_rate = ($scope.payroll_entry.employee.basic_salary * 12) / $scope.payroll_process.payroll.working_days_per_year;
			$scope.hourly_rate = ($scope.payroll_entry.employee.basic_salary * 12) / $scope.payroll_process.payroll.working_days_per_year / $scope.payroll_process.payroll.working_hours_per_day;
		}

		$scope.removeAllowance = function(idx){
			$scope.payroll_entry.employee.allowance_types.splice(idx, 1);
			$scope.payroll_entry.allowances.splice(idx, 1);
		}

		$scope.init = function(){
			Helper.get('/branch')
				.success(function(data){
					$scope.branches = data;
				})

			Helper.get('/cost-center')
				.success(function(data){
					$scope.cost_centers = data;
				})			

			var payroll_process_query = {
				'with': [
					{
						'relation': 'batch',
						'withTrashed': false,
					},
					{
						'relation': 'payroll.time_interpretation',
						'withTrashed': false,
					},
					{
						'relation': 'payroll_period',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': payrollProcessID,
					}
				],
				'first': true,
			}

			Helper.post('/payroll-process/enlist', payroll_process_query)
				.success(function(data){
					data.payroll_period.start_cut_off = new Date(data.payroll_period.start_cut_off);
					data.payroll_period.end_cut_off = new Date(data.payroll_period.end_cut_off);
					data.payroll_period.payout = new Date(data.payroll_period.payout);

					$scope.payroll_process = data;

					if(data.payroll.pay_frequency == 'Weekly')
					{
						$scope.basic_pay_factor = 4;
					}
					else if(data.payroll.pay_frequency == 'Semi-monthly')
					{
						$scope.basic_pay_factor = 2;						
					}
					else if(data.payroll.pay_frequency == 'Monthly')
					{
						$scope.basic_pay_factor = 1;						
					}

					$scope.max_rest_day_hours = $scope.payroll_process.payroll.working_hours_per_day * (7 - $scope.payroll_process.payroll.working_days_per_week) * 4 / $scope.basic_pay_factor;

					var holiday_query = {
						'whereBetween': [
							{
								'label': 'date',
								'start': new Date(data.payroll_period.start_cut_off).toDateString(),
								'end': new Date(data.payroll_period.end_cut_off).toDateString(),
							},
						]
					}

					Helper.post('/holiday/enlist', holiday_query)
						.success(function(data){
							if(data.length)
							{
								$scope.regular_holidays = [];
								$scope.special_holidays = [];

								angular.forEach(data, function(item){
									item.date = new Date(item.date);

									if(item.type == 'Regular Holiday'){
										$scope.regular_holidays.push(item)
									}
									else if(item.type == 'Special Non-working Holiday')
									{
										$scope.special_holidays.push(item)
									}
								});

								$scope.max_regular_hours = $scope.payroll_process.payroll.working_hours_per_day * $scope.payroll_process.payroll.working_days_per_week * 4 / $scope.basic_pay_factor - data.length * $scope.payroll_process.payroll.working_hours_per_day;
							}
							else{
								$scope.max_regular_hours = $scope.payroll_process.payroll.working_hours_per_day * $scope.payroll_process.payroll.working_days_per_week * 4 / $scope.basic_pay_factor;
							}
							

							$scope.holidays = data;

						})


					var employee_query = {
						'with': [
							{
								'relation': 'allowance_types.de_minimis',
								'withTrashed': false,
							},
							{
								'relation': 'deduction_types',
								'withTrashed': false,
							},
							{
								'relation': 'tax_code',
								'withTrashed': false,	
							},
							{
								'relation': 'position',
								'withTrashed': false,	
							},
						],
						'where': [
							{
								'label': 'batch_id',
								'condition': '=',
								'value': $scope.payroll_process.batch_id,
							},
						],
						'whereDoesntHave': [
							{
								'relation': 'payroll_entries',
								'where': [
									{
										'label': 'payroll_process_id',
										'condition': '=',
										'value': $scope.payroll_process.id,
									},
								],
							},
						],
					}

					Helper.post('/employee/enlist', employee_query)
						.success(function(data){
							$scope.employees = data;
						})
				})
				.error(function(){
					Helper.error();
				})
		}();
	}]);