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
					$state.go('main.thirteenth-month-pay-process', {payrollProcessID: data.id});
				},
				action: function(current){
					setInit(current);
				},
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);