app
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
				angular.forEach(data.group.modules, function(module){
					if(module.name == 'HRIS')
					{
						var hris = {
							'state': 'main.hris',
							'icon': 'mdi-account-multiple',
							'label': 'HRIS',
						}

						$scope.menu.static.push(hris);
					}
					else if(module.name == 'Payroll')
					{
						var payroll = {
							'state': 'main.payroll',
							'icon': 'mdi-currency-usd',
							'label': 'Payroll',
						}

						$scope.menu.static.push(payroll);
					}
					else if(module.name == 'Timekeeping')
					{
						var payroll = {
							'state': 'main.timekeeping',
							'icon': 'mdi-calendar-clock',
							'label': 'Timekeeping',
						}

						$scope.menu.static.push(payroll);
					}
					else if(module.name == 'Settings')
					{
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
					}
				});

				$scope.user = data;

				Helper.setAuthUser(data);
			})

		$scope.$on('closeSidenav', function(){
			$mdSidenav('left').close();
		});
	}]);