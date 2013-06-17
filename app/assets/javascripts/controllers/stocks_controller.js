HelloEmber.StocksController = Em.ArrayController.extend({
	test: function() {
//		this.content.then(function(stocks){
			this.content.forEach(function(stock){
				console.log('stock:', stock)
			});
//		});	
		return 'dsfdsaf'
	}.property('content.@each.stock')
});