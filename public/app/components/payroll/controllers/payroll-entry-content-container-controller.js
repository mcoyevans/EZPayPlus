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

			$scope.regularWorkingHoursPay();
			$scope.overtimePay();
			$scope.nightDifferentialPay();
			$scope.overtimeNightDifferentialPay();
		}

		$scope.setMaxRegularHours = function(){
			$scope.max_regular_work_hours = ($scope.payroll_entry.regular_working_days - $scope.payroll_entry.days_absent) * $scope.payroll_process.payroll.working_hours_per_day;
			
			$scope.payroll_entry.absent = $scope.payroll_entry.days_absent ? $scope.payroll_entry.days_absent * $scope.daily_rate : 0;
		}

		// Calculating
		$scope.regularWorkingHoursPay = function(){
			$scope.payroll_entry.regular_working_hours_pay = $scope.payroll_entry.employee.basic_salary ? $scope.payroll_entry.employee.basic_salary / $scope.basic_pay_factor : null;

			$scope.payroll_entry.tardy = ($scope.max_regular_work_hours - $scope.payroll_entry.regular_working_hours) * $scope.hourly_rate;
		}

		$scope.overtimePay = function(){
			$scope.payroll_entry.overtime_pay = $scope.payroll_entry.overtime ? $scope.payroll_entry.overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.overtime : null;
		}

		$scope.nightDifferentialPay = function(){
			$scope.payroll_entry.night_differential_pay = $scope.payroll_entry.night_differential ? $scope.payroll_entry.night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.night_differential : null;
		}

		$scope.overtimeNightDifferentialPay = function(){
			$scope.payroll_entry.overtime_night_differential_pay = $scope.payroll_entry.overtime_night_differential ? $scope.hourly_rate * $scope.payroll_entry.overtime_night_differential * $scope.payroll_process.payroll.time_interpretation.overtime_night_differential : null;
		}

		$scope.regularHolidayPay = function(){
			var work_days = $scope.payroll_entry.regular_holiday / $scope.payroll_process.payroll.working_hours_per_day;
			var remaining = $scope.payroll_entry.regular_holiday - (Math.floor(work_days) * $scope.payroll_process.payroll.working_hours_per_day);

			$scope.payroll_entry.regular_holiday_pay = $scope.payroll_entry.regular_holiday ? (Math.floor(work_days) * $scope.daily_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rate) + (remaining * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rate) : null;
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

					var timeDiff = Math.abs(data.payroll_period.end_cut_off.getTime() - data.payroll_period.start_cut_off.getTime());
					$scope.max_regular_working_days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

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

					var holiday_query = {
						'whereMonth': 
						{
							'label':'date',
							'value': new Date(data.payroll_period.start_cut_off).getMonth() + 1,
						},
						'whereBetweenDay': 
						{
							'label': 'date',
							'start': new Date(data.payroll_period.start_cut_off).getDate(),
							'end': new Date(data.payroll_period.end_cut_off).getDate(),
						},
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
							}							

							$scope.holidays = data;

							$scope.max_regular_holiday_regular_hours = $scope.regular_holidays.length * $scope.payroll_process.payroll.working_hours_per_day;
							$scope.max_special_holiday_regular_hours = $scope.special_holidays.length * $scope.payroll_process.payroll.working_hours_per_day;
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