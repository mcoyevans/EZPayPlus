hris
	.controller('hrisContentContainerController', ['$scope', '$state', '$mdMedia', 'Helper', function($scope, $state, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		/*
		 * Object for subheader
		 *
		*/
		$scope.subheader = {};
		$scope.subheader.show = true;

		$scope.subheader.toggleActive = function(){
			$scope.showInactive = !$scope.showInactive;
		}

		$scope.subheader.sortBy = function(filter){
			filter.sortReverse = !filter.sortReverse;			
			$scope.sortType = filter.type;
			$scope.sortReverse = filter.sortReverse;
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';
		$scope.fab.label = 'Employee';
		$scope.fab.action = function(){
			$state.go('main.manage-employee');
		}

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.request.search = null;
			$scope.refresh();
			$scope.$broadcast('close');
		});

		$scope.view = function(data){
			Helper.set(data);

			var dialog = {
				'template': '/app/components/hris/templates/dialogs/employee-information-dialog.template.html',
				'controller': 'employeeInformationDialogController',
				'fullscreen': true
			}

			Helper.customDialog(dialog)
				.then(function(data){
					var confirm = {}

					confirm.title = 'Delete';
					confirm.message = 'Are you sure you want to delete this employee?';
					confirm.ok = 'Delete';
					confirm.cancel = 'Cancel';

					if(data){
						Helper.confirm(confirm)
							.then(function(){
								Helper.preload();
								Helper.delete('/employee/' + data)
									.success(function(){
										Helper.stop();
										$scope.refresh();
										Helper.notify('Employee deleted.')
									})
									.error(function(){
										Helper.error();
									})
							})
					}
				});
		}

		$scope.request = {}
		$scope.request.paginate = 20;
		$scope.request.withTrashed = true;

		$scope.init = function(){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/employee/enlist', $scope.request)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							// pushItem(item);
						});
					}

					$scope.model.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.model.busy || ($scope.model.page > $scope.model.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.model.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post('/employee/enlist' + '?page=' + $scope.model.page, $scope.request)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									// pushItem(item);
									$scope.model.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.model.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init();
		};

		$scope.init();
	}]);