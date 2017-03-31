payroll
	.controller('thirteenthMonthPayProcessContentContainerController', ['$scope', '$state', '$stateParams', 'Helper', function($scope, $state, $stateParams, Helper){
		$scope.$emit('closeSidenav');

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		var thirteenthMonthPayProcessID = $stateParams.thirteenthMonthPayProcessID;

		var query = {
			'with': [
				{
					'relation': 'batch',
					'withTrashed': true,
				},
			],
			'where': [
				{
					'label': 'id',
					'condition': '=',
					'value' : thirteenthMonthPayProcessID,
				}
			],
			'first' : true,
		}

		Helper.post('/thirteenth-month-pay-process/enlist', query)
			.success(function(data){
				if(!data)
				{
					return $state.go('page-not-found');
				}

				$scope.thirteenth_month_pay_process = data;

				$scope.toolbar.parentState = data.batch.name;
				$scope.toolbar.childState = new Date(data.start).toDateString() + ' - ' + new Date(data.end).toDateString();

				if($scope.thirteenth_month_pay_process.locked && !$scope.thirteenth_month_pay_process.processed)
				{
					$scope.subheader.menu.push(
						{
							'label': 'Process Thirteenth Month Pay',
							'icon': 'mdi-comment-processing',
							action: function(){

							},
						}
					);
				}
				else if(!$scope.thirteenth_month_pay_process.locked && !$scope.thirteenth_month_pay_process.processed){
					$scope.subheader.menu.push(
						{
							'label': 'Lock Thirteenth Month Pay',
							'icon': 'mdi-lock',
							action: function(){
								var dialog = {}

								dialog.title = 'Lock Thirteenth Month Pay'
								dialog.message = 'Adding or editing payroll entries will be disabled upon locking this payroll process.'
								dialog.ok = 'Lock',
								dialog.cancel = 'Cancel',

								Helper.confirm(dialog)
									.then(function(){
										Helper.preload();
										Helper.post('/thirteenth-month-pay-process/lock', $scope.thirteenth_month_pay_process)
											.success(function(){
												Helper.stop();
												Helper.notify('Thirteenth month pay process locked.');
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
							'label': 'Process Thirteenth Month Pay',
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

		$scope.fab.label = 'Thirteenth Month Pay Entry';

		$scope.fab.action = function(){
			$state.go('main.thirteenth-month-pay-entry', {'thirteenthMonthPayProcessID': thirteenthMonthPayProcessID});
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

		$scope.viewThirteenthMonthPayEntry = function(data){
			var config = data;

			if($scope.thirteenth_month_pay_process.locked || $scope.thirteenth_month_pay_process.processed)
			{
				data.view_only = true;
			}

			Helper.set(data);

			var dialog = {
				'template': '/app/components/payroll/templates/dialogs/thirteenth-month-pay-entry-dialog.template.html',
				'controller': 'thirteenthMonthPayEntryDialogController',
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

			Helper.post('/thirteenth-month-pay-entry/enlist', query)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.show = $scope.thirteenth_month_pay_process.locked || $scope.thirteenth_month_pay_process.processed ? false : true;

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
						Helper.post('/thirteenth-month-pay-entry/enlist' + '?page=' + $scope.model.page, query)
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
				'label': 'thirteenth_month_pay_process_id',
				'condition': '=',
				'value': thirteenthMonthPayProcessID,
			},
		];
	}]);