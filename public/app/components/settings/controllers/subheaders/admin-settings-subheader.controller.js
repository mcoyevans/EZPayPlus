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
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editBranchDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/branch-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete Branch';
							dialog.message = 'Delete ' + data.name + ' branch?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/branch/' + data.id)
										.success(function(){
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
				},
				action: function(current){
					setInit(current);
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						action: function(data){
							Helper.set(data);

							var dialog = {};
							dialog.controller = 'editHouseBankDialogController';
							dialog.template = '/app/components/settings/templates/dialogs/house-bank-form-dialog.template.html';

							Helper.customDialog(dialog)
								.then(function(){
									$scope.$emit('refresh');
								}, function(){
									return;
								})
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete House Bank';
							dialog.message = 'Delete ' + data.name + ' house bank?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/house-bank/' + data.id)
										.success(function(){
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
			},
			{
				'label':'User Groups',
				'url': '/group/enlist',
				'request' : {
					'withTrashed': false,
					'paginate':20,
				},
				'fab': {
					'controller':'createGroupDialogController',
					'template':'/app/components/settings/templates/dialogs/group-form-dialog.template.html',
				},
				action: function(current){
					setInit(current);
				},
			},
			{
				'label':'Users',
				'url': '/user/enlist',
				'request' : {
					'withTrashed': false,
					'with' : [
						{
							'relation':'group',
							'withTrashed': false,
						}
					],
					'paginate':20,
				},
				'fab': {
					'controller':'createUserDialogController',
					'template':'/app/components/settings/templates/dialogs/user-form-dialog.template.html',
				},
				action: function(current){
					setInit(current);
				},
			},
		];

		setInit($scope.subheader.navs[0]);
	}]);