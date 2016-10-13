settings
	.controller('hrisSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Departments
			{
				'label':'Departments',
				'url': '/department/enlist',
				'request': {
					'with': [
						{
							'relation':'positions',
							'withTrashed':false,
						},
					],
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'controller':'createDepartmentDialogController',
					'template':'/app/components/settings/templates/dialogs/department-form-dialog.template.html',
					'message': 'Department saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editDepartmentDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/department-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Department updated.');
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
							dialog.message = 'Delete ' + data.name + ' department?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/department/' + data.id)
										.success(function(){
											Helper.notify('Department deleted.');
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
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createPositionDialogController',
					'template':'/app/components/settings/templates/dialogs/position-form-dialog.template.html',
					'message': 'Position saved.'
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
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editPositionDialogController';
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
			{
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
					'controller':'createJobCategoryDialogController',
					'template':'/app/components/settings/templates/dialogs/job-category-form-dialog.template.html',
					'message': 'Job category saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editJobCategoryDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/job-category-form-dialog.template.html';

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
			},
			// Labor Types
			{
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
					'controller':'createLaborTypeDialogController',
					'template':'/app/components/settings/templates/dialogs/labor-type-form-dialog.template.html',
					'message': 'Labor type saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editLaborTypeDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/labor-type-form-dialog.template.html';

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
							dialog.message = 'Disable ' + data.name + ' labor type?'
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
			},
			// Leaves
			{
				'label':'Leaves',
				'url': '/department/enlist',
				'request': {
					'with': [
						{
							'relation':'positions',
							'withTrashed':false,
						},
					],
					'withTrashed': true,
					'paginate':20,
				},
				'fab': {
					'controller':'createDepartmentDialogController',
					'template':'/app/components/settings/templates/dialogs/department-form-dialog.template.html',
					'message': 'Department saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editDepartmentDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/department-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('Department updated.');
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
							dialog.message = 'Delete ' + data.name + ' department?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/department/' + data.id)
										.success(function(){
											Helper.notify('Department deleted.');
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
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createPositionDialogController',
					'template':'/app/components/settings/templates/dialogs/position-form-dialog.template.html',
					'message': 'Position saved.'
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
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editPositionDialogController';
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
			// Sanctions
			{
				'label':'Sanctions',
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
					'controller':'createJobCategoryDialogController',
					'template':'/app/components/settings/templates/dialogs/job-category-form-dialog.template.html',
					'message': 'Job category saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editJobCategoryDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/job-category-form-dialog.template.html';

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
			},
			// Sanction Levels
			{
				'label':'Sanction Levels',
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
					'controller':'createLaborTypeDialogController',
					'template':'/app/components/settings/templates/dialogs/labor-type-form-dialog.template.html',
					'message': 'Labor type saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editLaborTypeDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/labor-type-form-dialog.template.html';

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
							dialog.message = 'Disable ' + data.name + ' labor type?'
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
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);