adminModule
	.controller('profileSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
		$scope.toolbar = {};

		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Profile';

		$scope.toolbar.hideSearchIcon = true;

		$scope.fab = {}

		$scope.fab.icon = 'mdi-pencil';
		$scope.fab.label = 'Edit';

		$scope.fab.dialog = {};
		
		$scope.fab.dialog.controller = 'editProfileDialogController';
		$scope.fab.dialog.template = '/app/components/admin/templates/dialogs/edit-profile-dialog.template.html';

		$scope.fab.action = function(){
			Helper.customDialog($scope.fab.dialog)
				.then(function(){
					Helper.preload();
					Helper.notify('Changes saved.')
						.then(function(){
							$scope.init(true);
						})
				}, function(){
					return;
				});
		}

		$scope.fab.show = true;

		$scope.init = function(refresh)
		{
			var query = {};
			query.with = ['city', 'province', 'country'];

			Helper.post('/company/enlist', query)
				.success(function(data){
					$scope.company = data;

					if(refresh)
					{
						Helper.stop();
					}
				})
				.error(function(){
					Helper.error();
				});
		}

		$scope.init();
	}]);