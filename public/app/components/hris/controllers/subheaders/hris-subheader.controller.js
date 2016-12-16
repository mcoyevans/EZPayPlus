hris
	.controller('hrisSubheaderController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.subheader.menu = [
			{
				'label': 'Edit',
				'icon': 'mdi-pencil',
				'show':true,
				action: function(data){
					$state.go('main.manage-employee-information', {'employeeID':data.id});
				},
			},
			{
				'label': 'Delete',
				'icon': 'mdi-delete',
				'show':true,
				action: function(data){
					var dialog = {};
					dialog.title = 'Delete';
					dialog.message = 'Delete ' + data.first_name + '?'
					dialog.ok = 'Delete';
					dialog.cancel = 'Cancel';

					Helper.confirm(dialog)
						.then(function(){
							Helper.delete('/employee/' + data.id)
								.success(function(){
									Helper.notify('Employee deleted.');
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
		]

		$scope.subheader.sort = [
			{
				'label': 'Employee Number',
				'type': 'employee_number',
				'sortReverse': false,
			},
			{
				'label': 'First Name',
				'type': 'first_name',
				'sortReverse': false,
			},
			{
				'label': 'Last Name',
				'type': 'last_name',
				'sortReverse': false,
			},
			{
				'label': 'Age',
				'type': 'age',
				'sortReverse': false,
			},
			{
				'label': 'Birthdate',
				'type': 'birthdate',
				'sortReverse': false,
			},
		]
	}]);