var bookkeeping = angular.module('bookkeeping', []);
bookkeeping
	.controller('businessPartnersContentContainerController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		$scope.$emit('closeSidenav');
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
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};
		
		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-plus';

		/* Action originates from subheader */
		$scope.$on('setInit', function(){
			var current = Helper.fetch();

			$scope.subheader.current = current;
			$scope.isLoading = true;
			$scope.init(current);
			$scope.$broadcast('close');
			$scope.showInactive = false;

			$scope.view = function(data){
				$scope.subheader.current.view(data);
			}

			$scope.edit = function(data){
				$scope.subheader.current.menu[0].action(data);
			}

			$scope.delete = function(data){
				$scope.subheader.current.menu[1].action(data);
			}
		});

		/* Action originates from toolbar */
		$scope.$on('search', function(){
			$scope.subheader.current.request.search = $scope.toolbar.searchText;
			$scope.refresh();
			$scope.showInactive = true;
		});

		/* Listens for any request for refresh */
		$scope.$on('refresh', function(){
			$scope.subheader.current.request.search = null;
			$scope.$broadcast('close');
			$scope.refresh();
		});

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			// 
		}

		$scope.init = function(query, refresh){
			$scope.model = {};
			$scope.model.items = [];
			$scope.toolbar.items = [];

			// 2 is default so the next page to be loaded will be page 2 
			$scope.model.page = 2;

			Helper.post(query.url, query.request)
				.success(function(data){
					$scope.model.details = data;
					$scope.model.items = data.data;
					$scope.model.show = true;

					$scope.fab.label = query.label;
					
					$scope.fab.show = true;

					$scope.fab.action = function(){
						$state.go(query.fab.state)
					}

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
						Helper.post(query.url + '?page=' + $scope.model.page, query.request)
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
							})
							.error(function(){
								Helper.failed()
									.then(function(){
										$scope.model.paginateLoad();
									});
							});
					}
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.init(query, refresh);
						})
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.model.show = false;

  			$scope.init($scope.subheader.current);
		};
	}]);
bookkeeping
	.controller('manageCustomerContentContainerController', ['$scope', '$filter', '$state', '$stateParams', '$mdMedia', 'Helper', function($scope, $filter, $state, $stateParams, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}

		$scope.form = {}

		$scope.customer = {};

		$scope.customerTypes = ['Individual', 'Corporation'];

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.toolbar.hideSearchIcon = true;

		$scope.checkDuplicate = function(){
			Helper.post('/customer/check-duplicate', $scope.customer)
				.success(function(data){
					$scope.duplicate = data;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.checkDuplicate();
						})
				})
		}

		$scope.checkCity = function(){
			var query = {};
			query.search = $scope.customer.city;
			query.strict_search = true;

			Helper.post('/city/enlist', query)
				.success(function(data){
					$scope.cities = data;
					$scope.showError = data.length ? false : true;

					if($scope.customer.province_id)
					{
						$scope.checkProvince();
					}
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.checkCity();
						})
				})
		}

		$scope.fetchProvinces = function(){
			Helper.post('/province/enlist', $scope.customer)
				.success(function(data){
					$scope.provinces = data;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.fetchProvinces();
						})
				})
		}

		$scope.checkProvince = function(){
			var query = {};
			query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': $scope.customer.province_id
				}
			];
			query.city = $scope.customer.city;
			query.result = 'first';

			Helper.post('/province/enlist', query)
				.success(function(data){
					$scope.noMatches = data.cities.length ? false : true;
				})
				.error(function(){
					Helper.failed()
						.then(function(){
							$scope.checkProvince();
						})
				})
		}

		$scope.formatTIN = function(tin){
			if($scope.form.customerForm.TIN.$valid)
			{
				var first = tin.slice(0,3);
				var second = tin.slice(3,6);
				var third = tin.slice(6,9);

				$scope.customer.tin = first + '-' + second + '-' + third;
			}
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.customerForm.$invalid){
				angular.forEach($scope.form.customerForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});


				Helper.alert('Oops!', 'Kindly check form for errors.');

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;

				Helper.preload();

				if(!$stateParams.customerID)
				{
					Helper.post('/customer', $scope.customer)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.business-partners');
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
				else
				{
					Helper.put('/customer/' + $stateParams.customerID, $scope.customer)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.business-partners');
						})
						.error(function(){
							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
			}
		}

		$scope.init = function(){
			var request = {};

			request.orderBy = [
				{
					'label': 'created_at',
					'sort' : 'desc'
				}
			]

			request.first = true;
			request.withTrashed = true;

			if($stateParams.customerID)
			{
				var request = {}

				request.where = [
					{
						'label': 'id',
						'condition': '=',
						'value': $stateParams.customerID,
					},
				]

				request.withTrashed = true;

				request.first = true;

				$scope.customer_fetch = function(){
					Helper.post('/customer/enlist', request)
						.success(function(data){
							$scope.customer = data;

							$scope.tin = data.tin.replace(/-/g, '');
							
							$scope.toolbar.childState = data.last_name + ', ' + data.first_name;

							$scope.show = true;
						})
						.error(function(){
							Helper.failed()
								.then(function(){
									$scope.customer_fetch();
								});
						});
				}
			}
			else{
				$scope.toolbar.childState = 'Customer';
				$scope.show = true;
			}
		}();
	}]);
bookkeeping
	.controller('businessPartnersSubheaderController', ['$scope', '$state', 'Helper', function($scope, $state, Helper){
		var setInit = function(data){
			Helper.set(data);

			$scope.$emit('setInit');
		}

		$scope.subheader.navs = [
			// Customers
			{
				'label':'Customers',
				'url': '/customer/enlist',
				'request' : {
					'paginate':20,
				},
				'fab': {
					'state' : 'main.manage-customer'
				},
				'menu': [
					{
						'label': 'Edit',
						'icon': 'mdi-pencil',
						'show': true,
						action: function(data){
							Helper.set(data);

							$state.go('main.manage-customer', {customerID: data.id});
						},
					},
					{
						'label': 'Delete',
						'icon': 'mdi-delete',
						'show': true,
						action: function(data){
							var dialog = {};
							dialog.title = 'Delete';
							dialog.message = 'Delete this customer?'
							dialog.ok = 'Delete';
							dialog.cancel = 'Cancel';

							Helper.confirm(dialog)
								.then(function(){
									Helper.delete('/customer/' + data.id)
										.success(function(){
											Helper.notify('Customer deleted.');
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
				view: function(data){
					Helper.set(data);

					var dialog = {
						'template': '/app/components/bookkeeping/templates/dialogs/customer-dialog.template.html',
						'controller': 'customerDialogController',
						'fullscreen': true
					}

					Helper.customDialog(dialog);
				},
				action: function(current){
					setInit(current);
				},
			},
		];

		$scope.subheader.sort = [
			{
				'label': 'First Name',
				'type': 'first_name',
				'sortReverse': false,
			},
			{
				'label': 'Last Name',
				'type': 'last_name',
				'sortReverse': false,
			},
			{
				'label': 'Recently Added',
				'type': 'created_At',
				'sortReverse': false,
			},
		]

		setInit($scope.subheader.navs[0]);
	}]);
bookkeeping
	.controller('businessPartnersToolbarController', ['$scope', '$filter', function($scope, $filter){
		$scope.toolbar.childState = 'Business Partners';

		$scope.$on('close', function(){
			$scope.hideSearchBar();
		});

		$scope.toolbar.getItems = function(query){
			var results = query ? $filter('filter')($scope.toolbar.items, query) : $scope.toolbar.items;
			return results;
		}

		$scope.toolbar.searchAll = true;
		/**
		 * Reveals the search bar.
		 *
		*/
		$scope.showSearchBar = function(){
			$scope.model.busy = true;
			$scope.searchBar = true;
			$scope.showInactive = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.model.page = 1;
				$scope.model.no_matches = false;
				$scope.model.items = [];
				$scope.searched = false;
				$scope.$emit('refresh');
			}
		};

		$scope.searchUserInput = function(){
			$scope.$emit('search');
			$scope.searched = true;
		};
	}]);
//# sourceMappingURL=bookkeeping.js.map
