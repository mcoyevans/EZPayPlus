adminModule
	.controller('mainViewController', ['$scope', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', function($scope, $state, $mdDialog, $mdSidenav, $mdToast, Helper){
		$scope.toggleSidenav = function(menuID){
			$mdSidenav(menuID).toggle();
		}

		$scope.menu = {};

		$scope.menu.static = [
			{
				'state': 'main',
				'icon': 'mdi-view-dashboard',
				'label': 'Dashboard',
			},
			{
				'state': 'main.hris',
				'icon': 'mdi-account-multiple',
				'label': 'HRIS',
			},
			{
				'state': 'main.payroll',
				'icon': 'mdi-currency-usd',
				'label': 'Payroll',
			},
			{
				'state': 'main.notifications',
				'icon': 'mdi-bell',
				'label': 'Notifications',
			},
		];

		$scope.menu.section = [
			{
				'name':'Settings',
				'icon':'mdi-settings',
			},
		];

		$scope.menu.pages = [
			[
				{
					'label': 'Admin',
					action: function(){
						$state.go('main.admin-settings');
					},
				},
				{
					'label': 'HRIS',
					action: function(){
						$state.go('main.hris-settings');
					},
				},
				{
					'label': 'Payroll',
					action: function(){
						$state.go('main.payroll-settings');
					},
				},
				{
					'label': 'Profile',
					action: function(){
						$state.go('main.profile-settings');
					}, 
				},
				{
					'label': 'Time Keeping',
					action: function(){
						$state.go('main.time-keeping-settings');
					},
				},
			]
		];

		// set section as active
		$scope.setActive = function(index){
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').toggleClass('active'));
		 	angular.element($('[aria-label="'+ 'section-' + index + '"]').closest('li').siblings().removeClass('active'));
		};
		
		$scope.logout = function(){
			Helper.post('/user/logout')
				.success(function(){
					window.location.href = '/';
				});
		}

		$scope.changePassword = function()
		{
			$mdDialog.show({
		      controller: 'changePasswordDialogController',
		      templateUrl: '/app/shared/templates/dialogs/change-password-dialog.template.html',
		      parent: angular.element(document.body),
		      fullscreen: true,
		    })
		    .then(function(){
		    	Helper.notify('Password changed.')
		    });
		}

		Helper.post('/user/check')
			.success(function(data){
				$scope.user = data;
			})

		$scope.$on('fetchAuthenticatedUser', function(){
			console.log($scope.user);
		});
	}]);