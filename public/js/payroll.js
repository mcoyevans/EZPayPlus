var payroll = angular.module('payroll', []);
payroll
	.controller('payrollContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.$emit('closeSidenav');
		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

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
		$scope.fab.icon = 'mdi-plus';

		/* Action originates from subheader */
		$scope.$on('setInit', function(){
			var current = Helper.fetch();

			$scope.subheader.current = current;
			$scope.isLoading = true;
			$scope.init(current);
			$scope.$broadcast('close');
			$scope.showInactive = false;

			$scope.view = function(data){
				$scope.subheader.current.view(data);
			}

			$scope.edit = function(data){
				$scope.subheader.current.menu[0].action(data);
			}

			$scope.delete = function(data){
				$scope.subheader.current.menu[1].action(data);
			}
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			if($scope.subheader.current.label == 'Payroll Processes')
			{
				data.payroll_period.start_cut_off = new Date(data.payroll_period.start_cut_off);
				data.payroll_period.end_cut_off = new Date(data.payroll_period.end_cut_off);
				data.payroll_period.payout = new Date(data.payroll_period.payout);
			}
			else if($scope.subheader.current.label == 'Thirteenth Month Pay Processes')
			{
				data.start = new Date(data.start);
				data.end = new Date(data.end);
				data.payout = new Date(data.payout);	
			}
		}

		$scope.init = function(query, refresh){
			$scope.type = {};
			$scope.type.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.type.page = 2;

			Helper.post(query.url, query.request)
				.success(function(data){
					$scope.type.details = data;
					$scope.type.items = data.data;
					$scope.type.show = true;

					$scope.fab.label = query.label;
					$scope.fab.action = function(){
						Helper.set(query.fab);

						Helper.customDialog(query.fab)
							.then(function(){
								Helper.notify(query.fab.message);
								$scope.refresh();
							}, function(){
								return;
							});
					}
					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.type.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.type.busy || ($scope.type.page > $scope.type.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.type.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post(query.url + '?page=' + $scope.type.page, query.request)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.type.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.type.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.type.busy = false;
								$scope.isLoading = false;
							})
							.error(function(){
								Helper.failed()
									.then(function(){
										$scope.type.paginateLoad();
									});
							});
					}
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.init(query, refresh);
						})
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.type.show = false;

  			$scope.init($scope.subheader.current);
		};
	}]);
payroll
	.controller('payrollEntryContentContainerController', ['$scope', '$filter', '$state', '$stateParams', 'Helper', function($scope, $filter, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		var payrollProcessID = $stateParams.payrollProcessID;
		var payrollEntryID = $stateParams.payrollEntryID;

		$scope.form = {}

		$scope.payroll_entry = {};
		$scope.payroll_entry.payroll_process_id = payrollProcessID;
		$scope.payroll_entry.government_contributions = [];

		$scope.subtotal = {};

		if(payrollEntryID)
		{
			var query = {
				'with': [
					{
						'relation': 'employee.tax_code',
						'withTrashed': false,
					},
					{
						'relation': 'employee.position',
						'withTrashed': false,
					},
					{
						'relation': 'allowances.allowance_type',
						'withTrashed': false,
					},
					{
						'relation': 'deductions.deduction',
						'withTrashed': false,
					},
					{
						'relation': 'government_contributions',
						'withTrashed': false,
					},
				],
				'where': [
					{
						'label': 'id',
						'condition': '=',
						'value': payrollEntryID,
					},
				],
				'first': true,
			}

			var payrollEntry = function(){
				Helper.post('/payroll-entry/enlist', query)
					.success(function(data){
						$scope.payroll_entry = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								payrollEntry();
							});
					});
			}

			payrollEntry();
		}

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

				if(!payrollEntryID)
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
			$scope.payroll_entry.employee_id = $scope.payroll_entry.employee.id;
			$scope.payroll_entry.allowances = [];
			$scope.payroll_entry.deductions = [];
			$scope.payroll_entry.additional_earnings = 0;
			$scope.payroll_entry.additional_deductions = 0;

			angular.forEach($scope.payroll_entry.employee.allowance_types, function(item, key){
				if(($scope.payroll_process.payroll_period.cut_off == 'first' && item.pivot.first_cut_off) || ($scope.payroll_process.payroll_period.cut_off == 'second' && item.pivot.second_cut_off)){
					var allowance = {};

					allowance.name = item.name;
					allowance.description = item.description;
					allowance.amount = item.pivot.amount;
					allowance.employee_allowance_type_id = item.pivot.id;

					$scope.payroll_entry.allowances.push(allowance);
					$scope.payroll_entry.additional_earnings += allowance.amount;
				}
			});

			angular.forEach($scope.payroll_entry.employee.deduction_types, function(item, key){
				if(($scope.payroll_process.payroll_period.cut_off == 'first' && item.pivot.first_cut_off) || ($scope.payroll_process.payroll_period.cut_off == 'second' && item.pivot.second_cut_off)){
					var deduction = {};

					deduction.name = item.name;
					deduction.description = item.description;
					deduction.amount = item.pivot.amount;
					deduction.employee_deduction_type_id = item.pivot.id;
					
					$scope.payroll_entry.deductions.push(deduction);
					$scope.payroll_entry.additional_deductions += deduction.amount;
				}
			});

			if($scope.payroll_entry.employee.time_interpretation.name == 'Monthly')
			{
				$scope.daily_rate = ($scope.payroll_entry.employee.basic_salary * 12) / $scope.payroll_process.payroll.working_days_per_year;
				$scope.hourly_rate = ($scope.payroll_entry.employee.basic_salary * 12) / $scope.payroll_process.payroll.working_days_per_year / $scope.payroll_process.payroll.working_hours_per_day;
			}
			else if($scope.payroll_entry.employee.time_interpretation.name == 'Daily') {
				$scope.daily_rate = $scope.payroll_entry.employee.basic_salary;
				$scope.hourly_rate = $scope.daily_rate / $scope.payroll_process.payroll.working_hours_per_day;
			}


			$scope.regularWorkingHoursPay();
			$scope.overtimePay();
			$scope.nightDifferentialPay();
			$scope.overtimeNightDifferentialPay();
			$scope.regularHolidayPay();
			$scope.regularHolidayOvertimePay();
			$scope.regularHolidayNightDifferentialPay();
			$scope.regularHolidayOvertimeNightDifferentialPay();
			$scope.specialHolidayPay();
			$scope.specialHolidayOvertimePay();
			$scope.specialHolidayNightDifferentialPay();
			$scope.specialHolidayOvertimeNightDifferentialPay();
			$scope.restDayPay();
			$scope.restDayOvertimePay();
			$scope.restDayNightDifferentialPay();
			$scope.restDayOvertimeNightDifferentialPay();
			$scope.regularHolidayRestDayPay();
			$scope.regularHolidayRestDayOvertimePay();
			$scope.regularHolidayRestDayNightDifferentialPay();
			$scope.regularHolidayRestDayOvertimeNightDifferentialPay();
			$scope.specialHolidayRestDayPay();
			$scope.specialHolidayRestDayOvertimePay();
			$scope.specialHolidayRestDayNightDifferentialPay();
			$scope.specialHolidayRestDayOvertimeNightDifferentialPay();

			if($scope.payroll_process.payroll_period.cut_off == 'second')
			{
				var previous_payroll_entry_query = {
					'with': [
						{
							'relation': 'employee',
							'withTrashed': false,
						},
						{
							'relation': 'government_contributions',
							'withTrashed': false,
						},
						{
							'relation': 'allowances',
							'withTrashed': false,
						},
						{
							'relation': 'deductions',
							'withTrashed': false,
						},
					],
					'whereHas': [
						{
							'relation': 'payroll_process.payroll_period',
							'whereMonth': {
								'label': 'start_cut_off',
								'value': new Date($scope.payroll_process.payroll_period.start_cut_off).getMonth() + 1,
							},
							'whereYear': {
								'label': 'start_cut_off',
								'value': new Date($scope.payroll_process.payroll_period.start_cut_off).getFullYear(),	
							},
							'where': [
								{
									'label': 'cut_off',
									'condition': '=',
									'value': 'first',
								},
							],
						}
					],
					'where': [
						{
							'label': 'employee_id',
							'condition': '=',
							'value': $scope.payroll_entry.employee.id,
						},
					],
					'first': true,
				}

				var previousPayrollEntry = function(){
					Helper.post('/payroll-entry/enlist', previous_payroll_entry_query)
						.success(function(data){
							$scope.previous_payroll_entry = data;
						})
						.error(function(){
							Helper.failed()
								.then(function(){
									previousPayrollEntry();
								})
						})
				}

				previousPayrollEntry();
			}
		}

		$scope.setMaxRegularHours = function(){
			var days_worked = $scope.payroll_entry.days_absent ? $scope.payroll_entry.regular_working_days - $scope.payroll_entry.days_absent : $scope.payroll_entry.regular_working_days;

			$scope.max_regular_work_hours = days_worked * $scope.payroll_process.payroll.working_hours_per_day;

			$scope.max_rest_day_work_hours = ($scope.max_regular_working_days - $scope.payroll_entry.regulor_working_days - $scope.holidays.length) * $scope.payroll_process.payroll.working_hours_per_day;
			
			$scope.payroll_entry.absent = $scope.payroll_entry.days_absent ? $scope.payroll_entry.days_absent * $scope.daily_rate : 0;
		}

		$scope.calculateTax = function(){
			var withholding_tax = $filter('filter')($scope.payroll_entry.government_contributions, 'Withholding Tax')[0];
			
			if($scope.payroll_entry.employee.minimum_wage_earner)
			{
				withholding_tax.amount = 0;

				return;
			}

			var withholding_tax_query = {}

			withholding_tax_query.where = [
				{
					'label': 'tax_code_id',
					'condition': '=',
					'value': $scope.payroll_entry.employee.tax_code_id,
				},
			];

			withholding_tax_query.orderBy = {
				'label': 'salary',
				'order': 'desc',
			}

			withholding_tax_query.first = true;

			if($scope.payroll_process.payroll_period.cut_off == 'first')
			{
				withholding_tax_query.where.push({
					'label': 'pay_frequency',
					'condition': '=',
					'value': $scope.payroll_process.payroll.pay_frequency,
				});

				withholding_tax_query.where.push({
					'label': 'salary',
					'condition': '<=',
					'value': $scope.payroll_entry.taxable_income,
				});
			}
			else if($scope.payroll_process.payroll_period.cut_off == 'second')
			{
				var first_cut_off_withholding_tax = $filter('filter')($scope.previous_payroll_entry.government_contributions, 'Withholding Tax') ? $filter('filter')($scope.previous_payroll_entry.government_contributions, 'Withholding Tax')[0] : null;

				var taxable_income = $scope.previous_payroll_entry ? $scope.previous_payroll_entry.taxable_income + $scope.payroll_entry.taxable_income : $scope.payroll_entry.taxable_income;

				withholding_tax_query.where.push({
					'label': 'pay_frequency',
					'condition': '=',
					'value': 'monthly',
				});

				withholding_tax_query.where.push({
					'label': 'salary',
					'condition': '<=',
					'value': taxable_income,
				});
			}

			var getTax = function(){
				Helper.post('/tax/enlist', withholding_tax_query)
					.success(function(data){
						withholding_tax.amount = first_cut_off_withholding_tax ? (data.tax + (taxable_income - data.salary) * data.excess) - first_cut_off_withholding_tax.pivot.amount : data.tax + ($scope.payroll_entry.taxable_income - data.salary) * data.excess;
						$scope.withholding_tax = withholding_tax.amount;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								getTax();
							});
					});
			}

			getTax();
		}

		$scope.governmentContributions = function(){
			if($scope.payroll_entry.regular_working_hours)
			{
				$scope.payroll_entry.taxable_income = $scope.payroll_entry.regular_working_hours_pay - $scope.payroll_entry.tardy - $scope.payroll_entry.absent + $scope.payroll_entry.night_differential_pay + $scope.payroll_entry.overtime_pay + $scope.payroll_entry.overtime_night_differential_pay + $scope.payroll_entry.rest_day_pay + $scope.payroll_entry.rest_day_overtime_pay + $scope.payroll_entry.rest_day_night_differential_pay + $scope.payroll_entry.rest_day_overtime_night_differential_pay + $scope.payroll_entry.regular_holiday_pay + $scope.payroll_entry.regular_holiday_overtime_pay + $scope.payroll_entry.regular_holiday_night_differential_pay + $scope.payroll_entry.regular_holiday_overtime_night_differential_pay + $scope.payroll_entry.regular_holiday_rest_day_pay + $scope.payroll_entry.regular_holiday_rest_day_overtime_pay + $scope.payroll_entry.regular_holiday_rest_day_night_differential_pay + $scope.payroll_entry.regular_holiday_rest_day_overtime_night_differential_pay + $scope.payroll_entry.special_holiday_pay + $scope.payroll_entry.special_holiday_overtime_pay + $scope.payroll_entry.special_holiday_night_differential_pay + $scope.payroll_entry.special_holiday_overtime_night_differential_pay + $scope.payroll_entry.special_holiday_rest_day_pay + $scope.payroll_entry.special_holiday_rest_day_overtime_pay + $scope.payroll_entry.special_holiday_rest_day_night_differential_pay + $scope.payroll_entry.special_holiday_rest_day_overtime_night_differential_pay;			
				var taxable_income = $scope.payroll_entry.regular_working_hours_pay - $scope.payroll_entry.tardy - $scope.payroll_entry.absent + $scope.payroll_entry.night_differential_pay + $scope.payroll_entry.overtime_pay + $scope.payroll_entry.overtime_night_differential_pay + $scope.payroll_entry.rest_day_pay + $scope.payroll_entry.rest_day_overtime_pay + $scope.payroll_entry.rest_day_night_differential_pay + $scope.payroll_entry.rest_day_overtime_night_differential_pay + $scope.payroll_entry.regular_holiday_pay + $scope.payroll_entry.regular_holiday_overtime_pay + $scope.payroll_entry.regular_holiday_night_differential_pay + $scope.payroll_entry.regular_holiday_overtime_night_differential_pay + $scope.payroll_entry.regular_holiday_rest_day_pay + $scope.payroll_entry.regular_holiday_rest_day_overtime_pay + $scope.payroll_entry.regular_holiday_rest_day_night_differential_pay + $scope.payroll_entry.regular_holiday_rest_day_overtime_night_differential_pay + $scope.payroll_entry.special_holiday_pay + $scope.payroll_entry.special_holiday_overtime_pay + $scope.payroll_entry.special_holiday_night_differential_pay + $scope.payroll_entry.special_holiday_overtime_night_differential_pay + $scope.payroll_entry.special_holiday_rest_day_pay + $scope.payroll_entry.special_holiday_rest_day_overtime_pay + $scope.payroll_entry.special_holiday_rest_day_night_differential_pay + $scope.payroll_entry.special_holiday_rest_day_overtime_night_differential_pay;
				$scope.government_contribution_deduction = 0;


				var sss = $filter('filter')($scope.payroll_entry.government_contributions, 'SSS')[0];
				var philhealth = $filter('filter')($scope.payroll_entry.government_contributions, 'Philhealth')[0];
				var pagibig = $filter('filter')($scope.payroll_entry.government_contributions, 'Pagibig')[0];
				var withholding_tax = $filter('filter')($scope.payroll_entry.government_contributions, 'Withholding Tax')[0];

				if(sss)
				{
					if($scope.previous_payroll_entry)
					{
						var first_cut_off_sss = $filter('filter')($scope.previous_payroll_entry.government_contributions, 'SSS') ? $filter('filter')($scope.previous_payroll_entry.government_contributions, 'SSS')[0] : null;
					}

					var sss_query = {}

					sss_query.where = [
						{
							'label': 'from',
							'condition': '<=',
							'value': $scope.previous_payroll_entry ? $scope.previous_payroll_entry.taxable_income + taxable_income : taxable_income,
						},
					];

					sss_query.orderBy = {
						'label': 'from',
						'order': 'desc',
					}

					sss_query.first = true;

					var getSSS = function(){
						Helper.post('/sss/enlist', sss_query)
							.success(function(data){
								sss.amount = first_cut_off_sss ? data.EE - first_cut_off_sss.amount : data.EE;
								$scope.payroll_entry.taxable_income -= sss.amount;
								$scope.government_contribution_deduction += sss.amount;

								if(withholding_tax){
									$scope.calculateTax();
								}
							})
							.error(function(){
								Helper.failed()
									.then(function(){
										getSSS();
									});
							})
					}

					getSSS();
				}

				if(pagibig)
				{
					if($scope.previous_payroll_entry)
					{
						var first_cut_off_pagibig = $filter('filter')($scope.previous_payroll_entry.government_contributions, 'Pagibig') ? $filter('filter')($scope.previous_payroll_entry.government_contributions, 'Pagibig')[0] : null;
					}

					pagibig.amount = first_cut_off_pagibig ? 100 - first_cut_off_pagibig.amount : 100;
					$scope.payroll_entry.taxable_income -= pagibig.amount;
					$scope.government_contribution_deduction += pagibig.amount;


					if(withholding_tax){
						$scope.calculateTax();
					}
				}

				if(philhealth)
				{
					if($scope.previous_payroll_entry)
					{
						var first_cut_off_philhealth = $filter('filter')($scope.previous_payroll_entry.government_contributions, 'Philhealth') ? $filter('filter')($scope.previous_payroll_entry.government_contributions, 'Philhealth')[0] : null;
					}

					var philhealth_query = {}

					philhealth_query.where = [
						{
							'label': 'from',
							'condition': '<=',
							'value': $scope.previous_payroll_entry ? $scope.previous_payroll_entry.taxable_income + taxable_income : taxable_income,
						},
					];

					philhealth_query.orderBy = {
						'label': 'from',
						'order': 'desc',
					}

					philhealth_query.first = true;

					Helper.post('/philhealth/enlist', philhealth_query)
						.success(function(data){
							philhealth.amount = first_cut_off_philhealth ? data.employee_share - first_cut_off_philhealth.amount : data.employee_share;
							$scope.payroll_entry.taxable_income -= philhealth.amount;
							$scope.government_contribution_deduction += philhealth.amount;
							if(withholding_tax){
								$scope.calculateTax();
							}
						})
						.error(function(){
							Helper.error();
						})
				}

				if(withholding_tax){
					$scope.calculateTax();
				}
			}
		}

		// Calculating
		$scope.regularWorkingHoursPay = function(){
			if($scope.payroll_process.payroll.time_interpretation.name == 'Monthly')
			{
				$scope.payroll_entry.regular_working_hours_pay = $scope.payroll_entry.regular_working_hours ? $scope.payroll_entry.employee.basic_salary / $scope.basic_pay_factor : null;
			}
			else if($scope.payroll_process.payroll.time_interpretation.name == 'Daily')
			{
				$scope.payroll_entry.regular_working_hours_pay = $scope.payroll_entry.regular_working_hours ? $scope.payroll_entry.regular_working_hours * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_working_hours : null;
			}

			$scope.payroll_entry.hours_tardy = $scope.max_regular_work_hours - $scope.payroll_entry.regular_working_hours;
			$scope.payroll_entry.tardy = $scope.payroll_entry.hours_tardy * $scope.hourly_rate;

			$scope.governmentContributions();
		}

		$scope.overtimePay = function(){
			$scope.payroll_entry.overtime_pay = $scope.payroll_entry.overtime ? $scope.payroll_entry.overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.overtime : null;
			$scope.governmentContributions();
		}

		$scope.nightDifferentialPay = function(){
			$scope.payroll_entry.night_differential_pay = $scope.payroll_entry.night_differential ? $scope.payroll_entry.night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.night_differential : null;
			$scope.governmentContributions();
		}

		$scope.overtimeNightDifferentialPay = function(){
			$scope.payroll_entry.overtime_night_differential_pay = $scope.payroll_entry.overtime_night_differential ? $scope.hourly_rate * $scope.payroll_entry.overtime_night_differential * $scope.payroll_process.payroll.time_interpretation.overtime_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayPay = function(){
			$scope.payroll_entry.regular_holiday_pay = 	$scope.payroll_entry.regular_holiday ? $scope.payroll_entry.regular_holiday * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rate : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayOvertimePay = function(){
			$scope.payroll_entry.regular_holiday_overtime_pay = $scope.payroll_entry.regular_holiday_overtime ? $scope.payroll_entry.regular_holiday_overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_overtime : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayNightDifferentialPay = function(){
			$scope.payroll_entry.regular_holiday_night_differential_pay = $scope.payroll_entry.regular_holiday_night_differential ? $scope.payroll_entry.regular_holiday_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayOvertimeNightDifferentialPay = function(){
			$scope.payroll_entry.regular_holiday_overtime_night_differential_pay = $scope.payroll_entry.regular_holiday_overtime_night_differential ? $scope.payroll_entry.regular_holiday_overtime_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_overtime_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayPay = function(){
			$scope.payroll_entry.special_holiday_pay = 	$scope.payroll_entry.special_holiday ? $scope.payroll_entry.special_holiday * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_rate : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayOvertimePay = function(){
			$scope.payroll_entry.special_holiday_overtime_pay = $scope.payroll_entry.special_holiday_overtime ? $scope.payroll_entry.special_holiday_overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_overtime : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayNightDifferentialPay = function(){
			$scope.payroll_entry.special_holiday_night_differential_pay = $scope.payroll_entry.special_holiday_night_differential ? $scope.payroll_entry.special_holiday_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayOvertimeNightDifferentialPay = function(){
			$scope.payroll_entry.special_holiday_overtime_night_differential_pay = $scope.payroll_entry.special_holiday_overtime_night_differential ? $scope.payroll_entry.special_holiday_overtime_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_overtime_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.restDayPay = function(){
			$scope.payroll_entry.rest_day_pay = $scope.payroll_entry.rest_day ? $scope.payroll_entry.rest_day * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.rest_day_rate : null;
			$scope.governmentContributions();
		}

		$scope.restDayOvertimePay = function(){
			$scope.payroll_entry.rest_day_overtime_pay = $scope.payroll_entry.rest_day_overtime ? $scope.payroll_entry.rest_day_overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.rest_day_overtime : null;
			$scope.governmentContributions();
		}

		$scope.restDayNightDifferentialPay = function(){
			$scope.payroll_entry.rest_day_night_differential_pay = $scope.payroll_entry.rest_day_night_differential ? $scope.payroll_entry.rest_day_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.rest_day_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.restDayOvertimeNightDifferentialPay = function(){
			$scope.payroll_entry.rest_day_overtime_night_differential_pay = $scope.payroll_entry.rest_day_overtime_night_differential ? $scope.payroll_entry.rest_day_overtime_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.rest_day_overtime_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayRestDayPay = function(){
			$scope.payroll_entry.regular_holiday_rest_day_pay = $scope.payroll_entry.regular_holiday_rest_day ? $scope.payroll_entry.regular_holiday_rest_day * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rest_day_rate : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayRestDayOvertimePay = function(){
			$scope.payroll_entry.regular_holiday_rest_day_overtime_pay = $scope.payroll_entry.regular_holiday_rest_day_overtime ? $scope.payroll_entry.regular_holiday_rest_day_overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rest_day_overtime : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayRestDayNightDifferentialPay = function(){
			$scope.payroll_entry.regular_holiday_rest_day_night_differential_pay = $scope.payroll_entry.regular_holiday_rest_day_night_differential ? $scope.payroll_entry.regular_holiday_rest_day_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rest_day_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.regularHolidayRestDayOvertimeNightDifferentialPay = function(){
			$scope.payroll_entry.regular_holiday_rest_day_overtime_night_differential_pay = $scope.payroll_entry.regular_holiday_rest_day_overtime_night_differential ? $scope.payroll_entry.regular_holiday_rest_day_overtime_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.regular_holiday_rest_day_overtime_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayRestDayPay = function(){
			$scope.payroll_entry.special_holiday_rest_day_pay = $scope.payroll_entry.special_holiday_rest_day ? $scope.payroll_entry.special_holiday_rest_day * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_rest_day_rate : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayRestDayOvertimePay = function(){
			$scope.payroll_entry.special_holiday_rest_day_overtime_pay = $scope.payroll_entry.special_holiday_rest_day_overtime ? $scope.payroll_entry.special_holiday_rest_day_overtime * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_rest_day_overtime : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayRestDayNightDifferentialPay = function(){
			$scope.payroll_entry.special_holiday_rest_day_night_differential_pay = $scope.payroll_entry.special_holiday_rest_day_night_differential ? $scope.payroll_entry.special_holiday_rest_day_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_rest_day_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.specialHolidayRestDayOvertimeNightDifferentialPay = function(){
			$scope.payroll_entry.special_holiday_rest_day_overtime_night_differential_pay = $scope.payroll_entry.special_holiday_rest_day_overtime_night_differential ? $scope.payroll_entry.special_holiday_rest_day_overtime_night_differential * $scope.hourly_rate * $scope.payroll_process.payroll.time_interpretation.special_holiday_rest_day_overtime_night_differential : null;
			$scope.governmentContributions();
		}

		$scope.getHolidays = function(){
			$scope.payroll_entry.employee = null;

			var holiday_query = {
				'whereMonth': 
				{
					'label':'date',
					'value': new Date($scope.payroll_process.payroll_period.start_cut_off).getMonth() + 1,
				},
				'whereBetweenDay': 
				{
					'label': 'date',
					'start': new Date($scope.payroll_process.payroll_period.start_cut_off).getDate(),
					'end': new Date($scope.payroll_process.payroll_period.end_cut_off).getDate(),
				},
			}

			holiday_query.whereHas = [];

			if($scope.form.branch_id)
			{
				holiday_query.whereHas.push(
					{
						'relation': 'branches',
						'where': {
							'label': 'branch_id',
							'condition': '=',
							'value': $scope.form.branch_id,
						}
					}
				)
			}

			if($scope.form.cost_center_id)
			{
				holiday_query.whereHas.push(
					{
						'relation': 'cost_centers',
						'where': {
							'label': 'cost_center_id',
							'condition': '=',
							'value': $scope.form.cost_center_id,
						}
					}
				)
			}

			Helper.post('/holiday/enlist', holiday_query)
				.success(function(data){
					$scope.regular_holidays = [];
					$scope.special_holidays = [];

					if(data.length)
					{
						angular.forEach(data, function(item){
							item.date = new Date(item.date);

							if(item.type == 'Regular Holiday'){
								$scope.regular_holidays.push(item)
							}
							else if(item.type == 'Special Non-Working Holiday')
							{
								$scope.special_holidays.push(item)
							}
						});
					}							

					$scope.holidays = data;

					$scope.max_regular_holiday_regular_hours = $scope.regular_holidays ? $scope.regular_holidays.length * $scope.payroll_process.payroll.working_hours_per_day : 0;
					$scope.max_special_holiday_regular_hours = $scope.regular_holidays ? $scope.special_holidays.length * $scope.payroll_process.payroll.working_hours_per_day : 0;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							getHolidays();
						})
				});
		}

		$scope.init = function(){
			var branches = function(){
				Helper.get('/branch')
					.success(function(data){
						$scope.branches = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								branches();
							})
					})
			}

			var costCenters = function(){
				Helper.get('/cost-center')
					.success(function(data){
						$scope.cost_centers = data;
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								costCenters();
							})
					})			
			}

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
						'relation': 'payroll.government_contributions',
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

			var payrollProcess = function(){
				Helper.post('/payroll-process/enlist', payroll_process_query)
					.success(function(data){
						data.payroll_period.start_cut_off = new Date(data.payroll_period.start_cut_off);
						data.payroll_period.end_cut_off = new Date(data.payroll_period.end_cut_off);
						data.payroll_period.payout = new Date(data.payroll_period.payout);

						var timeDiff = Math.abs(data.payroll_period.end_cut_off.getTime() - data.payroll_period.start_cut_off.getTime());
						$scope.max_regular_working_days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

						angular.forEach(data.payroll.government_contributions, function(item){
							if((data.payroll_period.cut_off == 'first' && item.first_cut_off) || (data.payroll_period.cut_off == 'second' && item.second_cut_off))
							{
								$scope.payroll_entry.government_contributions.push(item);
							}
						});

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
								{
									'relation': 'time_interpretation',
									'withTrashed': false,
								},
							],
							'where': [
								{
									'label': 'batch_id',
									'condition': '=',
									'value': $scope.payroll_process.batch_id,
								},
								{
									'label': 'time_interpretation_id',
									'condition': '=',
									'value': $scope.payroll_process.payroll.time_interpretation_id,
								},
							],
						}

						if(payrollEntryID)
						{
							employee_query.where.push(
								{
									'label':'id',
									'condition': '=',
									'value': payrollEntryID,	
								}
							);
						}
						else{
							employee_query.whereDoesntHave = [
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
							]
						}

						var employees = function(){						
							Helper.post('/employee/enlist', employee_query)
								.success(function(data){
									$scope.employees = data;
								})
								.error(function(){
									Helper.failed()
										.then(function(){
											employees();
										})
								})
						}

						employees();
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								payrollProcess();
							});
					})
			}

			branches();
			costCenters();
			payrollProcess();

		}();
	}]);
payroll
	.controller('payrollProcessContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		var payrollProcessID = $stateParams.payrollProcessID;

		var query = {
			'with': [
				{
					'relation': 'payroll',
					'withTrashed': true,
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
					'value' : payrollProcessID,
				}
			],
			'first' : true,
		}

		Helper.post('/payroll-process/enlist', query)
			.success(function(data){
				if(!data)
				{
					return $state.go('page-not-found');
				}

				$scope.payroll_process = data;

				$scope.toolbar.parentState = data.payroll.name;
				$scope.toolbar.childState = new Date(data.payroll_period.start_cut_off).toDateString() + ' - ' + new Date(data.payroll_period.end_cut_off).toDateString();

				if($scope.payroll_process.locked && !$scope.payroll_process.processed)
				{
					$scope.subheader.menu.push(
						{
							'label': 'Process Payroll',
							'icon': 'mdi-comment-processing',
							action: function(){

							},
						}
					);
				}
				else if(!$scope.payroll_process.locked && !$scope.payroll_process.processed){
					$scope.subheader.menu.push(
						{
							'label': 'Lock Payroll',
							'icon': 'mdi-lock',
							action: function(){
								var dialog = {}

								dialog.title = 'Lock Payroll'
								dialog.message = 'Adding or editing payroll entries will be disabled upon locking this payroll process.'
								dialog.ok = 'Lock',
								dialog.cancel = 'Cancel',

								Helper.confirm(dialog)
									.then(function(){
										Helper.preload();
										Helper.post('/payroll-process/lock', $scope.payroll_process)
											.success(function(){
												Helper.stop();
												Helper.notify('Payroll process locked.');
												$state.go($state.current, {}, {reload:true});
											})
											.error(function(){
												Helper.error();
											})
									}, function(){
										return;
									})
							},
						},
						{
							'label': 'Process Payroll',
							'icon': 'mdi-comment-processing',
							action: function(){
							
							},
						}
					);	
				}

				$scope.isLoading = true;
				$scope.$broadcast('close');

				$scope.init($scope.request);

			})

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		$scope.subheader.menu = []
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Payroll Entry';

		$scope.fab.action = function(){
			$state.go('main.payroll-entry', {'payrollProcessID': payrollProcessID});
		}

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.viewPayrollEntry = function(data){
			var config = data;

			if($scope.payroll_process.locked || $scope.payroll_process.processed)
			{
				data.view_only = true;
			}

			Helper.set(data);

			var dialog = {
				'template': '/app/components/payroll/templates/dialogs/payroll-entry-dialog.template.html',
				'controller': 'payrollEntryDialogController',
			}

			Helper.customDialog(dialog)
				.then(function(){

				}, function(){

				});
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/payroll-entry/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = $scope.payroll_process.locked || $scope.payroll_process.processed ? false : true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/payroll-entry/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.paginate = 20;

		$scope.request.with = [
			{
				'relation':'employee',
				'withTrashed': false,
			},
		];

		$scope.request.where = [
			{
				'label': 'payroll_process_id',
				'condition': '=',
				'value': payrollProcessID,
			},
		];	
	}]);
payroll
	.controller('thirteenthMonthPayProcessContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		var thirteenthMonthPayProcessID = $stateParams.thirteenthMonthPayProcessID;

		var query = {
			'with': [
				{
					'relation': 'batch',
					'withTrashed': true,
				},
			],
			'where': [
				{
					'label': 'id',
					'condition': '=',
					'value' : thirteenthMonthPayProcessID,
				}
			],
			'first' : true,
		}

		Helper.post('/thirteenth-month-pay-process/enlist', query)
			.success(function(data){
				if(!data)
				{
					return $state.go('page-not-found');
				}

				$scope.thirteenth_month_pay_process = data;

				$scope.toolbar.parentState = data.batch.name;
				$scope.toolbar.childState = new Date(data.start).toDateString() + ' - ' + new Date(data.end).toDateString();

				if($scope.thirteenth_month_pay_process.locked && !$scope.thirteenth_month_pay_process.processed)
				{
					$scope.subheader.menu.push(
						{
							'label': 'Process Thirteenth Month Pay',
							'icon': 'mdi-comment-processing',
							action: function(){

							},
						}
					);
				}
				else if(!$scope.thirteenth_month_pay_process.locked && !$scope.thirteenth_month_pay_process.processed){
					$scope.subheader.menu.push(
						{
							'label': 'Lock Thirteenth Month Pay',
							'icon': 'mdi-lock',
							action: function(){
								var dialog = {}

								dialog.title = 'Lock Thirteenth Month Pay'
								dialog.message = 'Adding or editing payroll entries will be disabled upon locking this payroll process.'
								dialog.ok = 'Lock',
								dialog.cancel = 'Cancel',

								Helper.confirm(dialog)
									.then(function(){
										Helper.preload();
										Helper.post('/thirteenth-month-pay-process/lock', $scope.thirteenth_month_pay_process)
											.success(function(){
												Helper.stop();
												Helper.notify('Thirteenth month pay process locked.');
												$state.go($state.current, {}, {reload:true});
											})
											.error(function(){
												Helper.error();
											})
									}, function(){
										return;
									})
							},
						},
						{
							'label': 'Process Thirteenth Month Pay',
							'icon': 'mdi-comment-processing',
							action: function(){
							
							},
						}
					);	
				}

				$scope.isLoading = true;
				$scope.$broadcast('close');

				$scope.init($scope.request);

			})

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}
		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		$scope.subheader.menu = []
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Thirteenth Month Pay Entry';

		$scope.fab.action = function(){
			var dialog = {
				'template': '/app/components/payroll/templates/dialogs/thirteenth-month-pay-entry-form-dialog.template.html',
				'controller': 'thirteenthMonthPayEntryDialogController',
			}

			$scope.thirteenth_month_pay_process.action = 'create';

			Helper.set($scope.thirteenth_month_pay_process);

			Helper.customDialog(dialog)
				.then(function(){
					Helper.notify('Thirteenth month pay entry created.');
				})
		}

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.viewThirteenthMonthPayEntry = function(data){
			var config = data;

			if($scope.thirteenth_month_pay_process.locked || $scope.thirteenth_month_pay_process.processed)
			{
				data.view_only = true;
			}

			Helper.set(data);

			var dialog = {
				'template': '/app/components/payroll/templates/dialogs/thirteenth-month-pay-entry-dialog.template.html',
				'controller': 'thirteenthMonthPayEntryDialogController',
			}

			Helper.customDialog(dialog)
				.then(function(){

				}, function(){

				});
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/thirteenth-month-pay-entry/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = $scope.thirteenth_month_pay_process.locked || $scope.thirteenth_month_pay_process.processed ? false : true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/thirteenth-month-pay-entry/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.paginate = 20;

		$scope.request.with = [
			{
				'relation':'employee',
				'withTrashed': false,
			},
		];

		$scope.request.where = [
			{
				'label': 'thirteenth_month_pay_process_id',
				'condition': '=',
				'value': thirteenthMonthPayProcessID,
			},
		];
	}]);
payroll
	.controller('payrollEntryDialogController', ['$scope', '$state', '$stateParams' 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.config = Helper.fetch();

		var query = {
			'with': [
				{
					'relation': 'employee.tax_code',
					'withTrashed': false,
				},
				{
					'relation': 'employee.position',
					'withTrashed': false,
				},
				{
					'relation': 'allowances.allowance_type',
					'withTrashed': false,
				},
				{
					'relation': 'deductions.deduction',
					'withTrashed': false,
				},
				{
					'relation': 'government_contributions',
					'withTrashed': false,
				},
				{
					'relation': 'payroll_process',
					'withTrashed': false,	
				}
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

		Helper.post('/payroll-entry/enlist', query)
			.success(function(data){
				$scope.payroll_entry = data;
			})
			.error(function(){
				Helper.error();
			});

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.edit = function(){
			Helper.stop();
			$state.go('main.payroll-entry', {'payrollProcessID': $scope.payroll_entry.payroll_process_id, 'payrollEntryID': $scope.payroll_entry.id});
		}

		$scope.delete = function(){
			var confirm = {
				'title': 'Delete Entry',
				'message': 'This payroll entry will be deleted permanently.',
				'ok': 'Delete',
				'cancel': 'Cancel',
			}

			Helper.confirm(confirm)
				.then(function(){
					Helper.preload();

					Helper.delete('/payroll-entry/' + $scope.payroll_entry.id)
						.success(function(){
							Helper.stop();
							Helper.notify('Payroll entry deleted.');
							$state.go($state.current, {'payrollProcessID': $stateParams.payrollProcessID}, {reload: true});
						})
						.error(function(){
							Helper.error();
						});

				}, function(){
					return;
				})
		}
	}]);
payroll
	.controller('payrollProcessDialogController', ['$scope', 'Helper', function($scope, Helper){
		$scope.config = Helper.fetch();

		$scope.payroll_process = {};

		if($scope.config.action == 'create')
		{
			$scope.fetchPayrollPeriod = function(){
				if($scope.payroll_process.batch_id)
				{
					var query = {
						'where': [
							{
								'label': 'payroll_id',
								'condition': '=',
								'value': $scope.payroll_process.payroll_id,
							},
						],
						'whereDoesntHave': [
							{
								'relation':'payroll_process',
								'where': [
									{
										'label': 'batch_id',
										'condition': '=',
										'value': $scope.payroll_process.batch_id,
									},
								],
							},
						],
						'orderBy': [
							{
								'column': 'start_cut_off',
								'order': 'desc',
							}
						],
					}

					Helper.post('/payroll-period/enlist', query)
						.success(function(data){
							angular.forEach(data, function(item){
								item.start_cut_off = new Date(item.start_cut_off);
								item.end_cut_off = new Date(item.end_cut_off);
							});

							$scope.payroll_periods = data;
						})
				}
			}
		}

		else if($scope.config.action == 'edit')
		{
			$scope.fetchPayrollPeriod = function(){
				if($scope.payroll_process.batch_id)
				{
					var query = {
						'where': [
							{
								'label': 'payroll_id',
								'condition': '=',
								'value': $scope.payroll_process.payroll_id,
							},
						],
						'whereDoesntHave': [
							{
								'relation':'payroll_process',
								'where': [
									{
										'label': 'batch_id',
										'condition': '=',
										'value': $scope.payroll_process.batch_id,
									},
								],
							},
						],
						'orWhere':[
							{
								'label': 'id',
								'condition': '=',
								'value': $scope.payroll_process.id,
							},
						],
						'orderBy': [
							{
								'column': 'start_cut_off',
								'order': 'desc',
							}
						],
					}

					Helper.post('/payroll-period/enlist', query)
						.success(function(data){
							angular.forEach(data, function(item){
								item.start_cut_off = new Date(item.start_cut_off);
								item.end_cut_off = new Date(item.end_cut_off);
							});

							$scope.payroll_periods = data;
						})
				}
			}

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

			Helper.post('/payroll-process/enlist', query)
				.success(function(data){
					$scope.payroll_process = data;
					$scope.fetchPayrollPeriod();
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

		$scope.checkDuplicate = function(){
			Helper.post('/payroll-process/check-duplicate', $scope.payroll_process)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.payrollProcessForm.$invalid){
				angular.forEach($scope.payrollProcessForm.$error, function(field){
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
					Helper.post('/payroll-process', $scope.payroll_process)
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
				if($scope.config.action == 'edit')
				{
					Helper.put('/payroll-process/' + $scope.config.id, $scope.payroll_process)
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

		Helper.get('/payroll')
			.success(function(data){
				$scope.payrolls = data;
			})

		Helper.get('/batch')
			.success(function(data){
				$scope.batches = data;
			})
	}]);
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
payroll
	.controller('payrollSubheaderController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Payroll Process
			{
				'label':'Payroll Processes',
				'url': '/payroll-process/enlist',
				'request' : {
					'with' : [
						{
							'relation':'batch',
							'withTrashed': false,
						},
						{
							'relation':'payroll',
							'withTrashed': false,
						},
						{
							'relation':'payroll_period',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'payrollProcessDialogController',
					'template':'/app/components/payroll/templates/dialogs/payroll-process-form-dialog.template.html',
					'message': 'Payroll process saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll-process',
					'label': 'Payroll process',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/payroll-process';
							data.label = 'Payroll process';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'payrollProcessDialogController';
							dialog.template = '/app/components/payroll/templates/dialogs/payroll-process-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Payroll process updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + new Date(data.payroll_period.start_cut_off).toLocaleDateString() + ' - ' + new Date(data.payroll_period.end_cut_off).toLocaleDateString() + ' payroll process?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/payroll-process/' + data.id)
										.success(function(){
											Helper.notify('Payroll process deleted.');
											$scope.$emit('refresh');
										})
										.error(function(){
											Helper.error();
										});
								}, function(){
									return;
								})
						},
					},
				],
				view: function(data){
					$state.go('main.payroll-process', {payrollProcessID: data.id});
				},
				action: function(current){
					setInit(current);
				},
			},
			// Thirteenth Month Pay Process
			{
				'label':'Thirteenth Month Pay Processes',
				'url': '/thirteenth-month-pay-process/enlist',
				'request' : {
					'with' : [
						{
							'relation':'batch',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'thirteenthMonthPayProcessDialogController',
					'template':'/app/components/payroll/templates/dialogs/thirteenth-month-pay-process-form-dialog.template.html',
					'message': 'Thirteenth month pay process saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/thirteenth-month-pay-process',
					'label': 'Thirteenth month pay process',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/thirteenth-month-pay-process';
							data.label = 'Thirteenth month pay process';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'thirteenthMonthPayProcessDialogController';
							dialog.template = '/app/components/payroll/templates/dialogs/thirteenth-month-pay-process-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Thirteenth month pay process updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + new Date(data.start).toLocaleDateString() + ' - ' + new Date(data.end).toLocaleDateString() + ' thirteenth month pay process?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/thirteenth-month-pay-process/' + data.id)
										.success(function(){
											Helper.notify('Thirteenth month pay process deleted.');
											$scope.$emit('refresh');
										})
										.error(function(){
											Helper.error();
										});
								}, function(){
									return;
								})
						},
					},
				],
				view: function(data){
					$state.go('main.thirteenth-month-pay-process', {thirteenthMonthPayProcessID: data.id});
				},
				action: function(current){
					setInit(current);
				},
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);
payroll
	.controller('payrollEntryToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Payroll Entry';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.hideSearchIcon = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
			$scope.showInactive = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
payroll
	.controller('payrollProcessToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
payroll
	.controller('payrollToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Payroll';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.type.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.type.page = 1;
				$scope.type.no_matches = false;
				$scope.type.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
payroll
	.controller('thirteenthMonthPayProcessToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
//# sourceMappingURL=payroll.js.map
