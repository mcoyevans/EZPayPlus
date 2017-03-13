var app = angular.module('app', [
	'sharedModule',
	'hris',
	'payroll',
	'timekeeping',
	'bookkeeping',
	'settings',
]);
app
	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('main', {
				url: '/',
				views: {
					'': {
						templateUrl: '/app/shared/views/main.view.html',
						controller: 'mainViewController',
					},
					'content-container@main': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'dashboardContentContainerController',
					},
					'toolbar@main': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					// 'subheader@main': {
					// 	templateUrl: '/app/shared/templates/subheaders/dashboard-subheader.template.html',
					// },
					'content@main':{
						templateUrl: '/app/components/app/templates/content/dashboard-content.template.html',
					}
				}
			})
			.state('main.hris', {
				url: 'hris',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/2')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'hrisContentContainerController',
					},
					'toolbar@main.hris': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'hrisToolbarController',
					},
					'left-sidenav@main.hris': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.hris': {
						templateUrl: '/app/components/hris/templates/subheaders/hris-subheader.template.html',
						controller: 'hrisSubheaderController',
					},
					'content@main.hris':{
						templateUrl: '/app/components/hris/templates/content/hris-content.template.html',
					}
				}
			})
			.state('main.payroll', {
				url: 'payroll',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'payrollContentContainerController',
					},
					'toolbar@main.payroll': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollToolbarController',
					},
					'left-sidenav@main.payroll': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.payroll': {
						templateUrl: '/app/components/payroll/templates/subheaders/payroll-subheader.template.html',
						controller: 'payrollSubheaderController',
					},
					'content@main.payroll':{
						templateUrl: '/app/components/payroll/templates/content/payroll-content.template.html',
					}
				}
			})
			.state('main.payroll-process', {
				url: 'payroll-process/{payrollProcessID}',
				params: {payrollProcessID:null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'payrollProcessContentContainerController',
					},
					'toolbar@main.payroll-process': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollProcessToolbarController',
					},
					'left-sidenav@main.payroll-process': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.payroll-process': {
						templateUrl: '/app/components/payroll/templates/subheaders/payroll-process-subheader.template.html',
					},
					'content@main.payroll-process':{
						templateUrl: '/app/components/payroll/templates/content/payroll-process-content.template.html',
					}
				}
			})
			.state('main.payroll-entry', {
				url: 'payroll-process/{payrollProcessID}/payroll-entry/{payrollEntryID}',
				params: {'payrollEntryID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/3')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'payrollEntryContentContainerController',
					},
					'toolbar@main.payroll-entry': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollEntryToolbarController',
					},
					'left-sidenav@main.payroll-entry': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.payroll-entry':{
						templateUrl: '/app/components/payroll/templates/content/payroll-entry-content.template.html',
					}
				}
			})
			.state('main.manage-employee', {
				url: 'employee/{employeeID}',
				params: {'employeeID':null},
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/2')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'manageEmployeeContentContainerController',
					},
					'toolbar@main.manage-employee': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'manageEmployeeToolbarController',
					},
					'left-sidenav@main.manage-employee': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.manage-employee':{
						templateUrl: '/app/components/hris/templates/content/manage-employee-content.template.html',
					}
				}
			})
			.state('main.admin-settings', {
				url: 'settings/admin',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'adminSettingsContentContainerController',
					},
					'toolbar@main.admin-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'adminSettingsToolbarController',
					},
					'left-sidenav@main.admin-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.admin-settings': {
						templateUrl: '/app/components/settings/templates/subheaders/admin-settings-subheader.template.html',
						controller: 'adminSettingsSubheaderController',
					},
					'content@main.admin-settings':{
						templateUrl: '/app/components/settings/templates/content/admin-settings-content.template.html',
					}
				}
			})
			.state('main.hris-settings', {
				url: 'settings/hris',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'hrisSettingsContentContainerController',
					},
					'toolbar@main.hris-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'hrisSettingsToolbarController',
					},
					'left-sidenav@main.hris-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.hris-settings': {
						templateUrl: '/app/components/settings/templates/subheaders/hris-settings-subheader.template.html',
						controller: 'hrisSettingsSubheaderController',
					},
					'content@main.hris-settings':{
						templateUrl: '/app/components/settings/templates/content/hris-settings-content.template.html',
					}
				}
			})
			.state('main.payroll-settings', {
				url: 'settings/payroll',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'payrollSettingsContentContainerController',
					},
					'toolbar@main.payroll-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
						controller: 'payrollSettingsToolbarController',
					},
					'left-sidenav@main.payroll-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'subheader@main.payroll-settings': {
						templateUrl: '/app/components/settings/templates/subheaders/payroll-settings-subheader.template.html',
						controller: 'payrollSettingsSubheaderController',
					},
					'content@main.payroll-settings':{
						templateUrl: '/app/components/settings/templates/content/payroll-settings-content.template.html',
					}
				}
			})
			// .state('main.timekeeping-settings', {
			// 	url: 'settings/timekeeping',
			// 	resolve:{
			// 		authorization: ['Helper', '$state', function(Helper, $state){
			// 			Helper.get('/module/4')
			// 				.success(function(data){
			// 					return;
			// 				})
			// 				.error(function(){
			// 					return $state.go('page-not-found');
			// 				});
			// 		}],
			// 	},
			// 	views: {
			// 		'content-container': {
			// 			templateUrl: '/app/shared/views/content-container.view.html',
			// 			controller: 'timekeepingSettingsContentContainerController',
			// 		},
			// 		'toolbar@main.timekeeping-settings': {
			// 			templateUrl: '/app/shared/templates/toolbar.template.html',
			// 			controller: 'timekeepingSettingsToolbarController',
			// 		},
			// 		'left-sidenav@main.timekeeping-settings': {
			// 			templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
			// 		},
			// 		'subheader@main.timekeeping-settings': {
			// 			templateUrl: '/app/components/settings/templates/subheaders/timekeeping-settings-subheader.template.html',
			// 			controller: 'timekeepingSettingsSubheaderController',
			// 		},
			// 		'content@main.timekeeping-settings':{
			// 			templateUrl: '/app/components/settings/templates/content/timekeeping-settings-content.template.html',
			// 		}
			// 	}
			// })
			.state('main.profile-settings', {
				url: 'settings/profile',
				resolve:{
					authorization: ['Helper', '$state', function(Helper, $state){
						Helper.get('/module/1')
							.success(function(data){
								return;
							})
							.error(function(){
								return $state.go('page-not-found');
							});
					}],
				},
				views: {
					'content-container': {
						templateUrl: '/app/shared/views/content-container.view.html',
						controller: 'profileSettingsContentContainerController',
					},
					'toolbar@main.profile-settings': {
						templateUrl: '/app/shared/templates/toolbar.template.html',
					},
					'left-sidenav@main.profile-settings': {
						templateUrl: '/app/shared/templates/sidenavs/main-left-sidenav.template.html',
					},
					'content@main.profile-settings':{
						templateUrl: '/app/shared/templates/content/profile-settings-content.template.html',
					}
				}
			})
	}]);
app
	.controller('dashboardContentContainerController', ['$scope', function($scope){
		$scope.events = [
			{
				'icon': 'mdi-view-dashboard',
				'title': 'Dashboard',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-account-multiple',
				'title': 'Human Resource Information System',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-currency-usd',
				'title': 'Payroll',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-check',
				'title': 'Awesome title',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-check',
				'title': 'Awesome title',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
		];

		$scope.toolbar = {}

		$scope.toolbar.childState = 'Dashboard';

		$scope.addNewEvent = function(){
			$scope.events.push({
				'icon': 'mdi-check',
				'title': 'Awesome title',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			});
		}
	}]);
app
	.controller('mainViewController', ['$scope', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', 'FileUploader', function($scope, $state, $mdDialog, $mdSidenav, $mdToast, Helper, FileUploader){
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

		var uploader = {};

		uploader.filter = {
            name: 'photoFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        uploader.sizeFilter = {
		    'name': 'enforceMaxFileSize',
		    'fn': function (item) {
		        return item.size <= 2000000;
		    }
        }

        uploader.error = function(item /*{File|FileLikeObject}*/, filter, options) {
            $scope.fileError = true;
            $scope.photoUploader.queue = [];
        };

        uploader.headers = { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')};

		$scope.clickUpload = function(){
		    angular.element('#upload').trigger('click');
		};

		$scope.markAllAsRead = function(){
			Helper.post('/user/mark-all-as-read')
				.success(function(){
					$scope.user.unread_notifications = [];
				})
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
					else if(module.name == 'Bookkeeping')
					{
						var bookkeeping = {
							'state': 'main.bookkeeping',
							'icon': 'mdi-book-multiple-variant',
							'label': 'Bookkeeping',
						}

						$scope.menu.static.push(bookkeeping);
					}
					// else if(module.name == 'Timekeeping')
					// {
					// 	var payroll = {
					// 		'state': 'main.timekeeping',
					// 		'icon': 'mdi-calendar-clock',
					// 		'label': 'Timekeeping',
					// 	}

					// 	$scope.menu.static.push(payroll);
					// }
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
								// {
								// 	'label': 'Timekeeping',
								// 	action: function(){
								// 		$state.go('main.timekeeping-settings');
								// 	},
								// },
							]
						];
					}
				});

				$scope.user = data;

				$scope.currentTime = Date.now();

				Helper.setAuthUser(data);

				/* Photo Uploader */
				$scope.photoUploader = new FileUploader({
					url: '/user/upload-avatar/' + $scope.user.id,
					headers: uploader.headers,
					queueLimit : 1
				})

				// FILTERS
		        $scope.photoUploader.filters.push(uploader.filter);
		        $scope.photoUploader.filters.push(uploader.sizeFilter);
		        
				$scope.photoUploader.onWhenAddingFileFailed = uploader.error;
				$scope.photoUploader.onAfterAddingFile  = function(){
					$scope.fileError = false;
					if($scope.photoUploader.queue.length)
					{	
						$scope.photoUploader.uploadAll()
					}
				};

				$scope.photoUploader.onCompleteItem  = function(data, response){
					if($scope.user.avatar_path)
					{
						$scope.currentTime = Date.now();
						$scope.photoUploader.queue = [];
					}
					else{
						$state.go($state.current, {}, {reload:true});
					}
				}
			})

		$scope.$on('closeSidenav', function(){
			$mdSidenav('left').close();
		});
	}]);
//# sourceMappingURL=app.js.map
