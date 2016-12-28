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
			// 13th Month Pay Process
			{
				'label':'Payroll Configuration',
				'url': '/payroll/enlist',
				'request' : {
					'with': [
						{
							'relation': 'government_contributions',
							'withTrashed': false
						},
						{
							'relation': 'time_interpretation',
							'withTrashed': false
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'payrollConfigurationDialogController',
					'template':'/app/components/settings/templates/dialogs/payroll-configuration-dialog.template.html',
					'message': 'Payroll configuration saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll',
					'label': 'Payroll Configuration',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/payroll';
							data.label = 'Payroll Configuration';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'payrollConfigurationDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/payroll-configuration-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Payroll configuration updated.');
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
							dialog.message = 'Delete ' + data.name + ' payroll configuration?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/payroll/' + data.id)
										.success(function(){
											Helper.notify('Payroll configuration deleted.');
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
				action: function(current){
					setInit(current);
				},
			},
			// Payroll Period
			{
				'label':'Payroll Period',
				'url': '/payroll-period/enlist',
				'request' : {
					'with': [
						{
							'relation': 'payroll',
							'withTrashed': true,
						}
					],
					'orderBy': [
						{
							'column': 'start_cut_off',
							'order': 'asc'
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'payrollPeriodDialogController',
					'template':'/app/components/settings/templates/dialogs/payroll-period-dialog.template.html',
					'message': 'Payroll period saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll',
					'label': 'Payroll Period',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/payroll-period';
							data.label = 'Payroll Period';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'payrollPeriodDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/payroll-period-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Payroll Period updated.');
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
							dialog.message = 'Delete ' + new Date(data.start_cut_off).toLocaleDateString() + ' to ' + new Date(data.end_cut_off).toLocaleDateString() + ' payroll period?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/payroll-period/' + data.id)
										.success(function(){
											Helper.notify('Payroll period deleted.');
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
				'sort': [
					{
						'label': 'Start Cut Off',
						'type': 'start_cut_off',
						'sortReverse': false,
					},
					{
						'label': 'End Cut Off',
						'type': 'end_cut_off',
						'sortReverse': false,
					},
					{
						'label': 'Payout',
						'type': 'payout',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
				action: function(current){
					setInit(current);
				},
			},
			// Holidays
			{
				'label':'Holidays',
				'url': '/holiday/enlist',
				'request' : {
					'withTrashed': true,
					'with': [
						{		
							'relation': 'branches',
							'withTrashed': true,
						},
						{		
							'relation': 'cost_centers',
							'withTrashed': true,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'holidayDialogController',
					'template':'/app/components/settings/templates/dialogs/holiday-dialog.template.html',
					'message': 'Holiday saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/payroll',
					'label': 'Holiday',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/holiday';
							data.label = 'Holiday';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'holidayDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/holiday-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Holiday updated.');
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
							dialog.message = 'Delete ' + data.description + ' holiday?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/holiday/' + data.id)
										.success(function(){
											Helper.notify('Holiday deleted.');
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
				'sort': [
					{
						'label': 'Description',
						'type': 'description',
						'sortReverse': false,
					},
					{
						'label': 'Date',
						'type': 'date',
						'sortReverse': false,
					},
					{
						'label': 'Recently added',
						'type': 'created_at',
						'sortReverse': false,
					},
				],
				action: function(current){
					setInit(current);
				},
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);