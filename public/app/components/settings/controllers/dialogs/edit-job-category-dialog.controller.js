settings
	.controller('editJobCategoryDialogController', ['$scope', 'Helper', function($scope, Helper){
		var job_category = Helper.fetch();

		Helper.get('/job-category/' + job_category.id)
			.success(function(data){
				$scope.job_category = data;
			})

		$scope.duplicate = false;

		$scope.busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/job-category/check-duplicate', $scope.job_category)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.jobCategoryForm.$invalid){
				angular.forEach($scope.jobCategoryForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/job-category/' + job_category.id, $scope.job_category)
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