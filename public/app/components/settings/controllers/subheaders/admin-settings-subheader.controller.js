settings
	.controller('adminSettingsSubheaderController', ['$scope', 'Helper', function($scope, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
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
			{
				'label':'House Banks',
				'url': '/house-bank/enlist',
				'request': {
					'withTrashed': true,
					'with': [
						{
							'relation' : 'currency',
							'withTrashed': false,
						},
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createHouseBankDialogController',
					'template':'/app/components/settings/templates/dialogs/house-bank-form-dialog.template.html',
					'message': 'House bank saved.'
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editHouseBankDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/house-bank-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('House bank updated.');
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
							dialog.message = 'Delete ' + data.name + ' house bank?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/house-bank/' + data.id)
										.success(function(){
											Helper.notify('House bank deleted.');
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
						'label': 'Bank Branch',
						'type': 'bank_branch',
						'sortReverse': false,
					},
					{
						'label': 'Bank Account Number',
						'type': 'bank_account_number',
						'sortReverse': false,
					},
					{
						'label': 'Bank Account Name',
						'type': 'bank_account_name',
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
			},
			{
				'label':'User Groups',
				'url': '/group/enlist',
				'request' : {
					'with': [
						{
							'relation':'modules',
							'withTrashed': false,
						},
						{
							'relation':'users',
							'withTrashed': false,	
						},
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createGroupDialogController',
					'template':'/app/components/settings/templates/dialogs/group-form-dialog.template.html',
					'message': 'User group saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editGroupDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/group-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('User group updated.');
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
							dialog.message = 'Delete ' + data.name + ' group?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/group/' + data.id)
										.success(function(){
											Helper.notify('User group deleted.');
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
			{
				'label':'Users',
				'url': '/user/enlist',
				'request' : {
					'withTrashed': true,
					'with' : [
						{
							'relation':'group',
							'withTrashed': false,
						}
					],
					'where': [
						{
							'label':'id',
							'condition':'!=',
							'value': 1,
						},
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createUserDialogController',
					'template':'/app/components/settings/templates/dialogs/user-form-dialog.template.html',
					'message': 'User saved.'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show':true,
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editUserDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/user-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									Helper.notify('User updated.');
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Disable Account',
						'icon': 'mdi-account-remove',
						'show':true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Disable account';
							dialog.message = 'Disable ' + data.name + '\'s account?'
							dialog.ok = 'Disable';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/user/' + data.id)
										.success(function(){
											Helper.notify('User account disabled.');
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
						'label': 'Email',
						'type': 'email',
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