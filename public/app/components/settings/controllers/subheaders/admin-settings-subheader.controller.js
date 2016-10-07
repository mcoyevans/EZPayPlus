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
				action: function(current){
					setInit(current);
				},
			},
			{
				'label':'House Banks',
				'url': '/house_bank/enlist',
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