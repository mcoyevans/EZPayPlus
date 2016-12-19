settings
	.controller('payrollSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Time Interpretations
			{
				'label':'Time Interpretations',
				'url': '/time-interpretation/enlist',
				'request' : {
					'with' : [
						{
							'relation':'positions',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'timeInterpretationDialogController',
					'template':'/app/components/settings/templates/dialogs/time-interpretation-form-dialog.template.html',
					'message': 'Time interpretation saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/time-interpretation',
					'label': 'Time interpretation',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/time-interpretation';
							data.label = 'Time interpretation';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'timeInterpretationDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/time-interpretation-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Time interpretation updated.');
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
							dialog.message = 'Delete ' + data.name + ' time interpretation?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/time-interpretation/' + data.id)
										.success(function(){
											Helper.notify('Time interpretation deleted.');
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
			// Payroll Configuration
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
							dialog.message = 'Delete ' + data.name + ' holiday?'
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
				action: function(current){
					setInit(current);
				},
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);