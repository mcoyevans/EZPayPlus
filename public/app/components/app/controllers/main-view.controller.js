app
	.controller('mainViewController', ['$scope', '$filter', '$state', '$mdDialog', '$mdSidenav', '$mdToast', 'Helper', 'FileUploader', function($scope, $filter, $state, $mdDialog, $mdSidenav, $mdToast, Helper, FileUploader){
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

		$scope.menu.section = [];
		$scope.menu.pages = [];

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
				var hris = $filter('filter')(data.group.modules, {name: 'HRIS'}, true);
				var payroll = $filter('filter')(data.group.modules, {name: 'Payroll'}, true);
				var bookkeeping = $filter('filter')(data.group.modules, {name: 'Bookkeeping'}, true);
				var settings = $filter('filter')(data.group.modules, {name: 'Settings'}, true);
				
				if(hris)
				{
					$scope.menu.static.push({
						'state': 'main.hris',
						'icon': 'mdi-account-multiple',
						'label': 'HRIS'
					});
				}

				if(payroll)
				{
					$scope.menu.static.push({
						'state': 'main.payroll',
						'icon': 'mdi-currency-usd',
						'label': 'Payroll'
					});
				}

				if(bookkeeping)
				{
					$scope.menu.section.push({
						'icon': 'mdi-book-multiple-variant',
						'name': 'Bookkeeping',
					});

					$scope.menu.pages.push([
						{
							'label': 'Business Partners',
							action: function(){
								$state.go('main.business-partners');
							},
						},
						{
							'label': 'Financials',
							action: function(){
								$state.go('main.financials');
							},
						},
						{
							'label': 'Inventory',
							action: function(){
								$state.go('main.inventory');
							},
						},
						{
							'label': 'Sales',
							action: function(){
								$state.go('main.sales');
							},
						},
						{
							'label': 'Purchasing',
							action: function(){
								$state.go('main.purchasing');
							},
						},
						{
							'label': 'Banking',
							action: function(){
								$state.go('main.purchasing');
							},
						},
					]);
				}

				if(settings)
				{
					$scope.menu.section.push({
						'icon': 'mdi-settings',
						'name': 'Settings',
					});

					$scope.menu.pages.push([
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
					]);
				}

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