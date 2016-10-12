settings
	.controller('editUserDialogController', ['$scope', 'Helper', function($scope, Helper){
		var user = Helper.authUser();

		var dataUser = Helper.fetch();
		
		$scope.edit = true;

		$scope.duplicate = false;

		$scope.busy = false;

		Helper.get('/user/' + dataUser.id)
			.success(function(data){
				$scope.user = data;
			})

		Helper.post('/group/enlist')
			.success(function(data){
				$scope.groups = data;
			})

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/user/check-email', $scope.user)
				.success(function(data){
					$scope.duplicate = data ? true : false;
				})
		}

		$scope.submit = function(){
			$scope.error = false;
			if($scope.userForm.$invalid){
				angular.forEach($scope.userForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.put('/user/' + dataUser.id , $scope.user)
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