settings
	.controller('timekeepingSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Departments
			{
				'label':'Shift Schedule',
				'url': '/shift-schedule/enlist',
				'request': {
					'withTrashed': false,
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'shiftScheduleDialogController',
					'template':'/app/components/settings/templates/dialogs/shift-schedule-form-dialog.template.html',
					'message': 'Shift schedule saved.',
					'action' : 'create',
					'url': '/shift-schedule',
					'label': 'Shift Schedule',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/shift-schedule';
							data.label = 'Shift Schedule';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'shiftScheduleDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/shift-schedule-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Shift schedule updated.');
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
							dialog.message = 'Delete this shift schedule?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/shift-schedule/' + data.id)
										.success(function(){
											Helper.notify('Shift schedule deleted.');
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
						'label': 'Date Start',
						'type': 'date_start',
						'sortReverse': false,
					},
					{
						'label': 'Date End',
						'type': 'date_end',
						'sortReverse': false,
					},
					{
						'label': 'Shift Start',
						'type': 'shift_start',
						'sortReverse': false,
					},
					{
						'label': 'Shift End',
						'type': 'shift_end',
						'sortReverse': false,
					},
					{
						'label': 'Hours Break',
						'type': 'hours_break',
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
			// Biometrics
			{
				'label':'Biometrics',
				'url': '/biometric/enlist',
				'request' : {
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Biometric machine saved.',
					'action' : 'create',
					'url': '/biometric',
					'label': 'Biometric',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/biometric';
							data.label = 'Biometric';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Biometric machine updated.');
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
							dialog.message = 'Delete ' + data.name + ' biometric machine?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/biometric/' + data.id)
										.success(function(){
											Helper.notify('Biometric machine deleted.');
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
						'label': 'Name',
						'type': 'name',
						'sortReverse': false,
					},
					{
						'label': 'Description',
						'type': 'description',
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
		];

		setInit($scope.subheader.navs[0]);
	}]);