settings
	.controller('adminSettingsContentContainerController', ['$scope', 'Helper', function($scope, Helper){
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

			$scope.init(current);
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
			$scope.refresh();
		});

		$scope.listItemAction = function(data){
			if(!data.deleted_at)
			{
				data.current = $scope.subheader.current;

				// if the tab is in user groups and the data clicked has users under him
				if(data.current.label == 'User Groups' && data.users.length)
				{
					// disable the delete button
					data.current.menu[1].show = false;
				}
				// otherwise
				else if(data.current.label == 'User Groups' && !data.users.length)
				{
					// enable the delete button
					data.current.menu[1].show = true;
				}

				Helper.set(data);

				var dialog = {};
				dialog.controller = 'listItemActionsDialogController';
				dialog.template = '/app/shared/templates/dialogs/list-item-actions-dialog.template.html';

				Helper.customDialog(dialog);
			}
		}

		/* Formats every data in the paginated call */
		var pushItem = function(data){
			data.created_at = new Date(data.created_at);

			var item = {};

			item.display = data.name;
			item.description = data.description;
			item.gl_account = data.gl_account;

			$scope.toolbar.items.push(item);
		}

		$scope.init = function(query, refresh){
			$scope.type = {};
			$scope.type.items = [];
			$scope.toolbar.items = [];

			$scope.$broadcast('close');

			// 2 is default so the next page to be loaded will be page 2 
			$scope.type.page = 2;

			Helper.post(query.url, query.request)
				.success(function(data){
					$scope.type.details = data;
					$scope.type.items = data.data;
					$scope.type.show = true;

					$scope.fab.label = query.label;
					$scope.fab.action = function(){
						Helper.customDialog(query.fab)
							.then(function(){
								Helper.notify(query.fab.message);
								$scope.refresh();
							}, function(){
								return;
							});
					}
					$scope.fab.show = true;

					if(data.data.length){
						// iterate over each record and set the format
						angular.forEach(data.data, function(item){
							pushItem(item);
						});
					}

					$scope.type.paginateLoad = function(){
						// kills the function if ajax is busy or pagination reaches last page
						if($scope.type.busy || ($scope.type.page > $scope.type.details.last_page)){
							$scope.isLoading = false;
							return;
						}
						/**
						 * Executes pagination call
						 *
						*/
						// sets to true to disable pagination call if still busy.
						$scope.type.busy = true;
						$scope.isLoading = true;
						// Calls the next page of pagination.
						Helper.post(query.url + '?page=' + $scope.type.page, query.request)
							.success(function(data){
								// increment the page to set up next page for next AJAX Call
								$scope.type.page++;

								// iterate over each data then splice it to the data array
								angular.forEach(data.data, function(item, key){
									pushItem(item);
									$scope.type.items.push(item);
								});

								// Enables again the pagination call for next call.
								$scope.type.busy = false;
								$scope.isLoading = false;
							});
					}
				});
		}

		$scope.refresh = function(){
			$scope.isLoading = true;
  			$scope.type.show = false;

  			$scope.init($scope.subheader.current);
		};
	}]);