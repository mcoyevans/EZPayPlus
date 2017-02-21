payroll
	.controller('payrollEntryDialogController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
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

		// $scope.edit = function(){
		// 	Helper.stop();
		// 	$state.go('main.payroll-entry', {'payrollProcessID': $scope.payroll_entry.payroll_process_id, 'payrollEntryID': $scope.payroll_entry.id});
		// }

		// $scope.delete = function(){
		// 	var confirm = {
		// 		'title': 'Delete Entry',
		// 		'message': 'This payroll entry will be deleted permanently.'
		// 		'ok': 'Delete',
		// 		'cancel': 'Cancel',
		// 	}

		// 	Helper.confirm(confirm)
		// 		.then(function(){
					
		// 		}, function(){
		// 			return;
		// 		})
		// }
	}]);