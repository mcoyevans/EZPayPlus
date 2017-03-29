payroll
	.controller('payrollProcessContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		var payrollProcessID = $stateParams.payrollProcessID;

		var query = {
			'with': [
				{
					'relation': 'payroll',
					'withTrashed': true,
				},
				{
					'relation': 'payroll_period',
					'withTrashed': false,
				},
			],
			'where': [
				{
					'label': 'id',
					'condition': '=',
					'value' : payrollProcessID,
				}
			],
			'first' : true,
		}

		Helper.post('/payroll-process/enlist', query)
			.success(function(data){
				if(!data)
				{
					return $state.go('page-not-found');
				}

				$scope.payroll_process = data;

				$scope.toolbar.parentState = data.payroll.name;
				$scope.toolbar.childState = new Date(data.payroll_period.start_cut_off).toDateString() + ' - ' + new Date(data.payroll_period.end_cut_off).toDateString();

				if($scope.payroll_process.locked && !$scope.payroll_process.processed)
				{
					$scope.subheader.menu.push(
						{
							'label': 'Process Payroll',
							'icon': 'mdi-comment-processing',
							action: function(){

							},
						}
					);
				}
				else if(!$scope.payroll_process.locked && !$scope.payroll_process.processed){
					$scope.subheader.menu.push(
						{
							'label': 'Lock Payroll',
							'icon': 'mdi-lock',
							action: function(){
								var dialog = {}

								dialog.title = 'Lock Payroll'
								dialog.message = 'Adding or editing payroll entries will be disabled upon locking this payroll process.'
								dialog.ok = 'Lock',
								dialog.cancel = 'Cancel',

								Helper.confirm(dialog)
									.then(function(){
										Helper.preload();
										Helper.post('/payroll-process/lock', $scope.payroll_process)
											.success(function(){
												Helper.stop();
												Helper.notify('Payroll process locked.');
												$state.go($state.current, {}, {reload:true});
											})
											.error(function(){
												Helper.error();
											})
									}, function(){
										return;
									})
							},
						},
						{
							'label': 'Process Payroll',
							'icon': 'mdi-comment-processing',
							action: function(){
							
							},
						}
					);	
				}

				$scope.isLoading = true;
				$scope.$broadcast('close');

				$scope.init($scope.request);

			})

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

		$scope.subheader.menu = []
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		$scope.fab.label = 'Payroll Entry';

		$scope.fab.action = function(){
			$state.go('main.payroll-entry', {'payrollProcessID': payrollProcessID});
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
			$scope.$broadcast('close');
			$scope.refresh();
		});

		$scope.viewPayrollEntry = function(data){
			var config = data;

			if($scope.payroll_process.locked || $scope.payroll_process.processed)
			{
				data.view_only = true;
			}

			Helper.set(data);

			var dialog = {
				'template': '/app/components/payroll/templates/dialogs/payroll-entry-dialog.template.html',
				'controller': 'payrollEntryDialogController',
			}

			Helper.customDialog(dialog)
				.then(function(){

				}, function(){

				});
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			
		}

		$scope.init = function(query){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post('/payroll-entry/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = $scope.payroll_process.locked || $scope.payroll_process.processed ? false : true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
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
						Helper.post('/payroll-entry/enlist' + '?page=' + $scope.model.page, query)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.model.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
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

  			$scope.init($scope.request);
		};

		$scope.request = {};

		$scope.request.paginate = 20;

		$scope.request.with = [
			{
				'relation':'employee',
				'withTrashed': false,
			},
		];

		$scope.request.where = [
			{
				'label': 'payroll_process_id',
				'condition': '=',
				'value': payrollProcessID,
			},
		];	
	}]);