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