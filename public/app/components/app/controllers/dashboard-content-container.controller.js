app
	.controller('dashboardContentContainerController', ['$scope', function($scope){
		$scope.events = [
			{
				'icon': 'mdi-view-dashboard',
				'title': 'Dashboard',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-account-multiple',
				'title': 'Human Resource Information System',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-currency-usd',
				'title': 'Payroll',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-check',
				'title': 'Awesome title',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
			{
				'icon': 'mdi-check',
				'title': 'Awesome title',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			},
		];

		$scope.toolbar = {}

		$scope.toolbar.childState = 'Dashboard';

		$scope.addNewEvent = function(){
			$scope.events.push({
				'icon': 'mdi-check',
				'title': 'Awesome title',
				'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem repudiandae sequi iure dolor vel nobis praesentium adipisci qui tempore illo non commodi, itaque quis consectetur totam assumenda, est fugiat quisquam!'
			});
		}
	}]);