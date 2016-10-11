settings
	.controller('editGroupDialogController', ['$scope', 'Helper', function($scope, Helper){
		var group = Helper.fetch();
		$scope.duplicate = false;

		$scope.busy = false;

		var query = {};
		query.where = [
			{
				'label':'id',
				'condition':'=',
				'value': group.id,
			}
		];
		query.first = true;

		Helper.get('/module')
			.success(function(data){
				$scope.modules = data;

				$scope.count = $scope.modules.length;
				Helper.post('/group/enlist', query)
					.success(function(data){
						$scope.group = data;
						$scope.group.modules = [];

						angular.forEach($scope.modules, function(item, key){
							$scope.group.modules.push(null);

							var query = {};
							query.with = [
								{
									'relation':'module',
									'withTrashed': false,
								},
							];
							query.where = [
								{
									'label': 'group_id',
									'condition': '=',
									'value': group.id,
								},
								{
									'label': 'module_id',
									'condition': '=',
									'value': item.id,
								},
							];
							query.first = true;

							Helper.post('/group-module/enlist', query)
								.success(function(data){
									$scope.count--;
									if(data)
									{
										$scope.group.modules.splice(key, 1, data.module);
									}
								});
						});
					});
			});
		

		$scope.cancel = function(){
			Helper.cancel();
		}		

		$scope.checkDuplicate = function(){
			Helper.post('/group/check-duplicate', $scope.group)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.submit = function(){
			if($scope.groupForm.$invalid){
				angular.forEach($scope.groupForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			if(!$scope.duplicate)
			{
				$scope.busy = true;
				
				Helper.put('/group/' + group.id, $scope.group)
					.success(function(duplicate){
						if(duplicate){
							$scope.busy = false;
							return;
						}

						Helper.stop();
					})
					.error(function(){
						Helper.error();
					});
			}
		}
	}]);