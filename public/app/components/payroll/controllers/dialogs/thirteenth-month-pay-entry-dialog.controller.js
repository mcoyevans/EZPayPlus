payroll
	.controller('thirteenthMonthPayEntryDialogController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.config = Helper.fetch();

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

			Helper.post('/thirteenth-month-pay-entry/enlist', query)
				.success(function(data){
					$scope.thirteenth_month_pay_entry = data;

					payrollEntries();
				})
				.error(function(){
					Helper.error();
				});
		}

		var payrollEntries = function(){
			var query = {
				'with': [
					{
						'relation': 'payroll_process.payroll_period',
						'withTrashed': false,
						'whereBetween': {
							'label': 'start_cut_off',
							'start': new Date($scope.thirteenth_month_pay_entry.thirteenth_month_pay_process.start).toDateString(),
							'end': new Date($scope.thirteenth_month_pay_entry.thirteenth_month_pay_process.end).toDateString(),
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
						item.payroll_process.payroll_period.start_cut_off = new Date(item.payroll_process.payroll_period.start_cut_off);
						item.payroll_process.payroll_period.end_cut_off = new Date(item.payroll_process.payroll_period.end_cut_off);
						item.payroll_process.payroll_period.payout = new Date(item.payroll_process.payroll_period.payout);
					});
				})
				.error(function(){
					Helper.error();
				})
		}

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.edit = function(){
			Helper.stop();
			$state.go('main.thirteenth-month-pay-entry', {'thirteenthMonthPayProcessID': $stateParams.thirteenthMonthPayProcessID, 'thirteenthMonthPayEntryID': $scope.thirteenth_month_pay_entry.id});
		}

		$scope.delete = function(){
			var confirm = {
				'title': 'Delete Entry',
				'message': 'This thirteenth month pay entry will be deleted permanently.',
				'ok': 'Delete',
				'cancel': 'Cancel',
			}

			Helper.confirm(confirm)
				.then(function(){
					Helper.preload();

					Helper.delete('/thirteenth-month-pay-entry/' + $scope.thirteenth_month_pay_entry.id)
						.success(function(){
							Helper.stop();
							Helper.notify('Thirteenth month pay entry deleted.');
							$state.go($state.current, {'thirteenthMonthPayProcessID': $stateParams.thirteenthMonthPayProcessID}, {reload: true});
						})
						.error(function(){
							Helper.error();
						});

				}, function(){
					return;
				})
		}

		thirteenthMonthPayEntry();
	}]);