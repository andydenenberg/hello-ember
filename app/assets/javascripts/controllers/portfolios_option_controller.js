HelloEmber.PortfoliosOptionController = Em.ObjectController.extend({	
	new_stock_symbol: null,
	new_stock_price: null,
	new_stock_price_change: null,
	new_stock_quantity: null,
	new_stock_total_cost: null,
	max_quantity: function() {
		var max = null
		if (this.get('new_stock_price') != null) {
			max = 'Max: ' + numberWithCommas(Number(this.get('cash') / this.get('new_stock_price')).toFixed(0)) + ' shares ' ;			
		}
		return max ;
	}.property('new_stock_price').cacheable(),
	
	new_stock_total_cost: function() {
		if ( (this.get('new_stock_quantity') != null) && (this.get('new_stock_price') != null ) ) 
		{ return numberWithCommas(Number(this.get('new_stock_quantity') * this.get('new_stock_price') ) );}
		else  { return null }		
	}.property('new_stock_quantity','new_stock_price'),
	
	get_price: function() {
		this.set('new_stock_symbol', this.get('new_stock_symbol').toUpperCase());
		var quote = current_quote( this.get('new_stock_symbol'), this );
	},
	
	purchase: function() {
		
			var portfolio = this.get('content');
		    var transaction = portfolio.get('store').transaction();
		    transaction.add(portfolio);
			var purchase_date = new Date();
			    var curr_date =  '' + purchase_date.getDate();
				if (curr_date.length < 2) { curr_date = '0' + curr_date } ;
			    var curr_month = '' + (purchase_date.getMonth() + 1) ; //Months are zero based
				if (curr_month.length < 2) { curr_month = '0' + curr_month } ;
			    var curr_year = purchase_date.getFullYear();
			    var pdate = curr_month + '/' + curr_date + "/" + curr_year ;
			var position = transaction.createRecord(HelloEmber.Stock, 
				{ 'symbol' : this.get('new_stock_symbol'),
				  'quantity' : this.get('new_stock_quantity'),
				  'purchase_price' : this.get('new_stock_price'),
				  'purchase_date' : pdate,
				  'portfolio' : portfolio, 
				  'stock_option' : 'Stock'
				});
			var cash = portfolio.get('cash') - Number(this.get('new_stock_quantity') * this.get('new_stock_price') ) ;
			portfolio.set('cash', cash ) ;
			this.transaction = transaction ;
						
		    this.transaction.commit();
		    this.transaction = null;
			flash_message('Position was successfully created.', 'success') ;	
			this.transitionToRoute('portfolio', this.content);
    },		
	
	cancel: function() {
		flash_message('Position creation canceled.', 'warning') ;	
	  	return this.transitionToRoute('portfolio', this.content );
		
	}
});
