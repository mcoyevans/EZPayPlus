settings
	.controller('adminSettingsToolbarController', ['$scope', function($scope){
		$scope.toolbar.parentState = 'Settings';
		$scope.toolbar.childState = 'Admin';

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
			$scope.type.busy = true;
			$scope.searchBar = true;
		};

		/**
		 * Hides the search bar.
		 *
		*/
		$scope.hideSearchBar = function(){
			$scope.type.busy = false;
			$scope.searchBar = false;
			$scope.toolbar.searchText = '';
			$scope.toolbar.searchItem = '';
			/* Cancels the paginate when the user sent a query */
			if($scope.searched){
				$scope.type.page = 1;
				$scope.type.no_matches = false;
				$scope.type.items = [];
				$scope.searched = false;
			}
		};
		
		$scope.searchUserInput = function(){
			$scope.type.busy = true;
			$scope.isLoading = true;
  			$scope.type.show = false;
  			
  			$scope.query = {};
  			$scope.query.searchText = $scope.toolbar.searchText;
  			$scope.query.withTrashed = true;

  			if($scope.subheader.currentNavItem == 'Designers'){
  				$scope.query.where = [
  					{
  						'label': 'role',
  						'condition': '=',
  						'value': 'designer',
  					}
  				];
  			}
  			else if($scope.subheader.currentNavItem == 'Quality Control'){
  				$scope.query.where = [
  					{
  						'label': 'role',
  						'condition': '=',
  						'value': 'quality_control',
  					}
  				];	
  			}

  			Setting.search($scope.subheader.currentNavItem, $scope.query)
  				.success(function(data){
  					$scope.toolbar.items = [];
  					if(data.length){
	  					angular.forEach(data, function(item){
	  						pushItem(item);
	  					});
	  					$scope.type.items = data;
  					}
  					else{
  						$scope.type.items = [];	
	  					$scope.type.no_matches = true;
  					}
  					$scope.searched = true;
  					$scope.type.show = true;
  					$scope.isLoading = false;
  				})
				.error(function(data){
					Preloader.error();
				});
		};
	}]);