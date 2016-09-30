adminModule
	.controller('editProfileDialogController', ['$scope', '$filter', 'Helper', function($scope, $filter, Helper){
		$scope.company = {};
		$scope.company.country_id = 177; //Philippines

		$scope.city = {};
		$scope.city.items = [];

		$scope.province = {};

		$scope.busy = false;

		var busy = false;

		$scope.city.getItems = function(query){
			var request = {
				'search' : query,
			}

			Helper.post('/city/enlist', request)
				.success(function(data){
					return data;
				});
		}

		$scope.province.getItems = function(query){
			var provinces = query ? $filter('filter')($scope.provinces, query) : $scope.cities;
			return provinces;
		}

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.submit = function(){
			if($scope.companyForm.$invalid){
				angular.forEach($scope.companyForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			
			$scope.busy = true;
			Helper.put('/company/1', $scope.company)
				.success(function(duplicate){
					Preloader.stop();
				})
				.error(function(){
					Preloader.error();
				});
		}

		$scope.init = function(){
			// Helper.get('city')
			// 	.success(function(data){
			// 		angular.forEach(data, function(item){
			// 			var toolbarItem = {};

			// 			toolbarItem.id = item.id;
			// 			toolbarItem.display = item.name;

			// 			$scope.city.items.push(toolbarItem);
			// 		})
			// 	})
			// 	.error(function(){
			// 		Preloader.error();					
			// 	})

			// Helper.get('province')
			// 	.success(function(data){
			// 		$scope.provinces = data;
			// 	})
			// 	.error(function(){
			// 		Preloader.error();					
			// 	})			
		}();
	}]);