hris
	.controller('employeeInformationDialogController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		var employee = Helper.fetch();

		var request = {}

		request.with = [
			{
				'relation': 'allowance_types',
				'withTrashed': false,
			},
			{
				'relation': 'deduction_types',
				'withTrashed': false,
			},
			{
				'relation': 'batch',
				'withTrashed': true,
			},
			{
				'relation': 'branch',
				'withTrashed': true,
			},
			{
				'relation': 'cost_center',
				'withTrashed': true,
			},
			{
				'relation': 'position',
				'withTrashed': true,
			},
			{
				'relation': 'city',
				'withTrashed': false,
			},
			{
				'relation': 'province',
				'withTrashed': false,
			},
			{
				'relation': 'tax_code',
				'withTrashed': false,
			},
			{
				'relation': 'time_interpretation',
				'withTrashed': false,
			},
		]

		request.withTrashed = true;

		request.first = true;

		Helper.post('/employee/enlist', request)
			.success(function(data){
				$scope.employee = data;
				$scope.employee.birthdate = new Date(data.birthdate);
				$scope.employee.date_hired = new Date(data.date_hired);
			})
			.error(function(){
				Helper.error();
			});

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.edit = function(){
			Helper.cancel();
			$state.go('main.manage-employee', {'employeeID':$scope.employee.id});
		}

		$scope.delete = function(){
			Helper.stop($scope.employee.id);
		}		
	}]);