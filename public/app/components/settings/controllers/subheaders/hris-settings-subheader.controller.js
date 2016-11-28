settings
	.controller('hrisSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Branches
			{
				'label':'Branches',
				'url': '/branch/enlist',
				'request': {
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'controller':'createBranchDialogController',
					'template':'/app/components/settings/templates/dialogs/branch-form-dialog.template.html',
					'message': 'Branch saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editBranchDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/branch-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Branch updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' branch?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/branch/' + data.id)
										.success(function(){
											Helper.notify('Branch deleted.');
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
						'label': 'GL Account',
						'type': 'gl_account',
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
			// Cost Centers
			{
				'label':'Cost Centers',
				'url': '/cost-center/enlist',
				'request': {
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'controller':'createCostCenterDialogController',
					'template':'/app/components/settings/templates/dialogs/cost-center-form-dialog.template.html',
					'message': 'Cost center saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editCostCenterDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/cost-center-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Cost center updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete ' + data.name + ' cost center?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/cost-center/' + data.id)
										.success(function(){
											Helper.notify('Cost center deleted.');
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
						'label': 'GL Account',
						'type': 'gl_account',
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
			// Departments
			// {
			// 	'label':'Departments',
			// 	'url': '/department/enlist',
			// 	'request': {
			// 		'with': [
			// 			{
			// 				'relation':'positions',
			// 				'withTrashed':false,
			// 			},
			// 		],
			// 		'withTrashed': true,
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'fullscreen' : true,
			// 		'controller':'nameDescriptionDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
			// 		'message': 'Department saved.',
			// 		'action' : 'create',
			// 		'url': '/department',
			// 		'label': 'Department',
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show': true,
			// 			action: function(data){
			// 				data.action = 'edit';
			// 				data.url = '/department';
			// 				data.label = 'Department';

			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'nameDescriptionDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Department updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show': true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' department?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/department/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Department deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
			// Positions
			{
				'label':'Positions',
				'url': '/position/enlist',
				'request': {
					'withTrashed': true,
					'with': [
						{
							'relation' : 'department',
							'withTrashed': false,
						},
						{
							'relation' : 'job_category',
							'withTrashed': false,
						},
						{
							'relation' : 'labor_type',
							'withTrashed': false,
						},
						{
							'relation' : 'deployments',
							'withTrashed': false,	
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'positionDialogController',
					'template':'/app/components/settings/templates/dialogs/position-form-dialog.template.html',
					'message': 'Position saved.',
					'action' : 'create',
					'url': '/position',

				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/position';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'positionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/position-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Position updated.');
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
							dialog.message = 'Delete ' + data.name + ' position?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/position/' + data.id)
										.success(function(){
											Helper.notify('Position deleted.');
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
			},
			// Job Categories
			/*{
				'label':'Job Categories',
				'url': '/job-category/enlist',
				'request' : {
					'with': [
						{
							'relation':'positions',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Job category saved.',
					'action' : 'create',
					'url': '/job-category',
					'label': 'Job category',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/job-category';
							data.label = 'Job category';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Job category updated.');
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
							dialog.message = 'Delete ' + data.name + ' job category?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/job-category/' + data.id)
										.success(function(){
											Helper.notify('Job category deleted.');
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
			},*/
			// Labor Types
			/*{
				'label':'Labor Types',
				'url': '/labor-type/enlist',
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
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Labor type saved.',
					'action' : 'create',
					'fullscreen' : true,
					'url': '/labor-type',
					'label': 'Labor type',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/labor-type';
							data.label = 'Labor type';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Labor type updated.');
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
							dialog.message = 'Delete ' + data.name + ' labor type?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/labor-type/' + data.id)
										.success(function(){
											Helper.notify('Labor type deleted.');
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
			},*/
			// Leaves
			/*{
				'label':'Leaves',
				'url': '/leave-type/enlist',
				'request': {
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'leaveTypeDialogController',
					'template':'/app/components/settings/templates/dialogs/leave-type-form-dialog.template.html',
					'message': 'Leave saved.',
					'action' : 'create',
					'url': '/leave-type',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/leave-type';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'leaveTypeDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/leave-type-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Leave updated.');
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
							dialog.message = 'Delete ' + data.name + ' leave?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/leave-type/' + data.id)
										.success(function(){
											Helper.notify('Leave deleted.');
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
			},*/
			// Allowances
			{
				'label':'Allowances',
				'url': '/allowance-type/enlist',
				'request' : {
					'withTrashed': true,
					'with' : [
						{
							'relation':'employees',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Allowance type saved.',
					'action' : 'create',
					'url': '/allowance-type',
					'label': 'Allowance',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/allowance-type';
							data.label = 'Allowance';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Allowance type updated.');
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
							dialog.message = 'Delete ' + data.name + ' allowance?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/allowance-type/' + data.id)
										.success(function(){
											Helper.notify('Allowance type deleted.');
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
			// Deductions
			{
				'label':'Deductions',
				'url': '/deduction-type/enlist',
				'request' : {
					'withTrashed': true,
					'with' : [
						{
							'relation':'employees',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'fullscreen' : true,
					'controller':'nameDescriptionDialogController',
					'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
					'message': 'Deduction type saved.',
					'action' : 'create',
					'url': '/deduction-type',
					'label': 'Deduction',
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							data.action = 'edit';
							data.url = '/deduction-type';
							data.label = 'Deduction';

							Helper.set(data);

							var dialog = {};
							dialog.controller = 'nameDescriptionDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Deduction type updated.');
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
							dialog.message = 'Delete ' + data.name + ' deduction?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/deduction-type/' + data.id)
										.success(function(){
											Helper.notify('Deduction type deleted.');
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
			// Sanctions
			// {
			// 	'label':'Sanctions',
			// 	'url': '/sanction-type/enlist',
			// 	'request' : {		
			// 		'with': [
			// 			{
			// 				'relation':'sanction_levels',
			// 				'withTrashed': false,
			// 			},
			// 		],
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'fullscreen' : true,
			// 		'controller':'nameDescriptionDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/name-description-form-dialog.template.html',
			// 		'message': 'Sanction type saved.',
			// 		'action' : 'create',
			// 		'url': '/sanction-type',
			// 		'label': 'Sanction',
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show': true,
			// 			action: function(data){
			// 				data.action = 'edit';
			// 				data.url = '/sanction-type';
			// 				data.label = 'Sanction';

			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'nameDescriptionDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/name-description-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Sanction type updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show': true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' sanction type?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/sanction-type/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Sanction type deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
			// Sanction Levels
			// {
			// 	'label':'Sanction Levels',
			// 	'url': '/sanction-level/enlist',
			// 	'request' : {		
			// 		'with': [
			// 			{
			// 				'relation':'sanction_type',
			// 				'withTrashed': false,
			// 			},
			// 		],
			// 		'paginate':20,
			// 	},
			// 	'fab': {
			// 		'fullscreen' : true,
			// 		'controller':'sanctionLevelDialogController',
			// 		'template':'/app/components/settings/templates/dialogs/sanction-level-form-dialog.template.html',
			// 		'message': 'Sanction level saved.',
			// 		'action' : 'create',
			// 		'url': '/sanction-level',
			// 		'label': 'Sanction',
			// 	},
			// 	'menu': [
			// 		{
			// 			'label': 'Edit',
			// 			'icon': 'mdi-pencil',
			// 			'show': true,
			// 			action: function(data){
			// 				data.action = 'edit';
			// 				data.url = '/sanction-level';
			// 				data.label = 'Sanction';

			// 				Helper.set(data);

			// 				var dialog = {};
			// 				dialog.controller = 'sanctionLevelDialogController';
			// 				dialog.template = '/app/components/settings/templates/dialogs/sanction-level-form-dialog.template.html';

			// 				Helper.customDialog(dialog)
			// 					.then(function(){
			// 						Helper.notify('Sanction level updated.');
			// 						$scope.$emit('refresh');
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 		{
			// 			'label': 'Delete',
			// 			'icon': 'mdi-delete',
			// 			'show': true,
			// 			action: function(data){
			// 				var dialog = {};
			// 				dialog.title = 'Delete';
			// 				dialog.message = 'Delete ' + data.name + ' sanction level?'
			// 				dialog.ok = 'Delete';
			// 				dialog.cancel = 'Cancel';

			// 				Helper.confirm(dialog)
			// 					.then(function(){
			// 						Helper.delete('/sanction-level/' + data.id)
			// 							.success(function(){
			// 								Helper.notify('Sanction level deleted.');
			// 								$scope.$emit('refresh');
			// 							})
			// 							.error(function(){
			// 								Helper.error();
			// 							});
			// 					}, function(){
			// 						return;
			// 					})
			// 			},
			// 		},
			// 	],
			// 	'sort': [
			// 		{
			// 			'label': 'Name',
			// 			'type': 'name',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Description',
			// 			'type': 'description',
			// 			'sortReverse': false,
			// 		},
			// 		{
			// 			'label': 'Recently added',
			// 			'type': 'created_at',
			// 			'sortReverse': false,
			// 		},
			// 	],
			// 	action: function(current){
			// 		setInit(current);
			// 	},
			// },
		];

		setInit($scope.subheader.navs[0]);
	}]);