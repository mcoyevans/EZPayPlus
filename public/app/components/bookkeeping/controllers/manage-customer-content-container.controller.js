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