settings
	.controller('editBranchDialogController', ['$scope', 'Helper', function($scope, Helper){
		var branch = Helper.fetch();

		Helper.get('/branch/' + branch.id)
			.success(function(data){
				$scope.branch = data;
			})
			.error(function(){
				Preloader.error();
			});

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/branch/check-duplicate', $scope.branch)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.branchForm.$invalid){
				angular.forEach($scope.branchForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/branch/' + $scope.branch.id, $scope.branch)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Helper.stop();
					})
					.error(function(){
						$scope.busy = false;
						$scope.error = true;
					});
			}
		}
	}]);