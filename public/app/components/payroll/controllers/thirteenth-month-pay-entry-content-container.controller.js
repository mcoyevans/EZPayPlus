payroll
	.controller('thirteenthMonthPayEntryContentContainerController' , ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		var thirteenthMonthPayEntryID = $stateParams.thirteenthMonthPayEntryID;
		var thirteenthMonthPayProcessID = $stateParams.thirteenthMonthPayProcessID;

		$scope.form = {}

		if(thirteenthMonthPayEntryID)
		{
			var thirteenthMonthPayEntry = function(){
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
							'relation': 'thirteenth_month_pay_process',
							'withTrashed': false,	
						},
					],
					'where': [
						{
							'label': 'id',
							'condition': '=',
							'value': thirteenthMonthPayEntryID,
						},
					],
					'first': true,
				}

				Helper.post('/thirteenth-month-pay-entry/enlist', query)
					.success(function(data){
						$scope.thirteenth_month_pay_entry = data;

						$scope.edit = true;

						$scope.fetchPartialAmount();
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								thirteenthMonthPayEntryID;
							})
					})
			}

			thirteenthMonthPayEntry();
		}
		else if(!thirteenthMonthPayEntryID)
		{
			$scope.thirteenth_month_pay_entry = {}

			$scope.thirteenth_month_pay_entry.thirteenth_month_pay_process_id = thirteenthMonthPayProcessID;
		}

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.partial_amount = 0;
 
		$scope.fetchPartialAmount = function(){
			$scope.thirteenth_month_pay_entry.employee_id = $scope.thirteenth_month_pay_entry.employee.id;

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

		$scope.calculateTaxableAmount = function(){
			if($scope.thirteenth_month_pay_entry.net_pay > $scope.thirteenth_month_pay_process.tax_ceiling)
			{
				$scope.thirteenth_month_pay_entry.taxable_amount = $scope.thirteenth_month_pay_entry.net_pay - $scope.thirteenth_month_pay_process.tax_ceiling;
			}
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

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {}

		$scope.toolbar.parentState = 'Thirteenth Month Pay Entry';
		$scope.toolbar.hideSearchIcon = true;


		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';

		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.thirteenthMonthPayEntryForm.$invalid){
				angular.forEach($scope.form.thirteenthMonthPayEntryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}

			Helper.preload();

			$scope.busy = true;

			if(!$scope.duplicate || $scope.busy)
			{
				if(!thirteenthMonthPayEntryID)
				{
					Helper.post('/thirteenth-month-pay-entry', $scope.thirteenth_month_pay_entry)
						.success(function(data){
							$scope.busy = false;
							Helper.stop();

							if(data){
								Helper.alert('Duplicate Entry', 'Thirteenth month pay entry already exists.');
								return;
							}

							Helper.notify('Thirteenth month pay entry created.');
							$state.go('main.thirteenth-month-pay-process', {'thirteenthMonthPayProcessID': thirteenthMonthPayProcessID});

						})
						.error(function(){
							$scope.busy = false;
							Helper.error();
						})
				}
				else{
					Helper.put('/thirteenth-month-pay-entry/' + thirteenthMonthPayEntryID, $scope.thirteenth_month_pay_entry)
						.success(function(data){
							$scope.busy = false;
							Helper.stop();

							if(data){
								Helper.alert('Duplicate Entry', 'Thirteenth month pay entry already exists.');
								return;
							}

							Helper.notify('Changes saved.');
							$state.go('main.thirteenth-month-pay-process', {'thirteenthMonthPayProcessID': thirteenthMonthPayProcessID});

						})
						.error(function(){
							$scope.busy = false;
							Helper.error();
						})
				}
			}
		}


		$scope.init = function(){
			var thirteenthMonthPayProcess = function(){			
				var query = {
					'where': [
						{
							'label': 'id',
							'condition': '=',
							'value': thirteenthMonthPayProcessID,
						},
					],
					'first': true,
				}

				Helper.post('/thirteenth-month-pay-process/enlist', query)
					.success(function(data){
						$scope.thirteenth_month_pay_process = data;

						$scope.thirteenth_month_pay_process.start = new Date($scope.thirteenth_month_pay_process.start);
						$scope.thirteenth_month_pay_process.end = new Date($scope.thirteenth_month_pay_process.end);

						$scope.toolbar.childState = new Date($scope.thirteenth_month_pay_process.start).toDateString() + ' ' + new Date($scope.thirteenth_month_pay_process.end).toDateString();

						employees();
					})
					.error(function(){
						Helper.failed()
							.then(function(){
								thirteenthMonthPayProcess();
							});
					})
			}

			var employees = function(){
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
						Helper.failed()
							.then(function(){
								employees();
							});
					})
			}

			thirteenthMonthPayProcess();
		}

		$scope.init();
	}]);