HelloEmber.StocksController = Em.ArrayController.extend({
  needs: ['Portfolios'],
  activeStockId: null,

// individual sort criteria
	sort_criteria: 'position_value',
	sort_order: 'asc',

	by_symbol: 'symbol',
	by_value: 'position_value',
	by_change: 'position_daily',

// consolidated sort criteria
	ConSortProperties: ['position_daily'],
	ConSortAscending: false,

  display_list: function() {
	// hide stocks listing if one is selected of if list is blank
	return (this.activeStockId === null) && (this.content.get('length') > 0) 	
  }.property('activeStockId','content.@each'),


// methods

	consolidated_sort: function(criteria) {
		this.set('ConSortProperties', [criteria]);	
		direction = this.get('ConSortAscending') ;
		if (direction == true) { this.set('ConSortAscending', false) ;	}
		else { this.set('ConSortAscending', true) ; };
	},


	sort: function(criteria) {
		this.set('sort_criteria', criteria);	
		direction = this.get('sort_order') ;
		if (direction == 'asc') { this.set('sort_order', 'desc') ;	}
		else { this.set('sort_order', 'asc') ; };    
	},

  add_stock: function() {
	// method for testing - not used in program 
	var portfolio = HelloEmber.Portfolio.find(1) ;	
    this.transaction = this.get('store').transaction();
    this.transaction.createRecord(HelloEmber.Stock, {symbol: 'CSCO', quantity: 100, purchase_price: 12.67, portfolio: portfolio } );
    this.transaction.commit();
    this.transaction = null;	
  },

  delete_stock: function(stock) {
    if (window.confirm("Are you sure you want to delete this stock?")) {
		stock.deleteRecord() ;
		this.store.commit();
	}
  },


	consolidated_stocks: function() {		
		var cons = HelloEmber.Con.find() ;
		return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, { 
			sortProperties: this.get('ConSortProperties'),
			sortAscending: this.get('ConSortAscending'),
		    content: cons });
    }.property("content.@each.stock.latest_price",'ConSortProperties','ConSortAscending').cacheable(),

	options: function() {
		var sorted = this.content.filter(function(stock) {
		  	return (stock.get('id') != null) && (stock.get('stock_option') == 'Call Option') ; });
		var criteria = this.get('sort_criteria') ;
		   var order = this.get('sort_order') ;
			sorted = sorted.sort(function(a,b) {
				var first = a.get(criteria) ;
				var last = b.get(criteria) ;
				if ( order == 'asc') {	//sort string ascending
					 if (last > first) return -1 
					 if (last < first) return 1 }
				else {
					 if (first > last) return -1 
					 if (first < last) return 1 }
			});
		return sorted
	}.property("content.@each.stock",'sort_order','sort_criteria').cacheable(),

	sorted_with_ids: function() {
		var sorted = this.content.filter(function(stock) {
		  	return stock.get('id') != null; });
		var criteria = this.get('sort_criteria') ;
		   var order = this.get('sort_order') ;
			sorted = sorted.sort(function(a,b) {
				var first = a.get(criteria) ;
				var last = b.get(criteria) ;
				if ( order == 'asc') {	//sort string ascending
					 if (last > first) return -1 
					 if (last < first) return 1 }
				else {
					 if (first > last) return -1 
					 if (first < last) return 1 }
			});
		return sorted
	}.property("content.@each.stock",'sort_order','sort_criteria').cacheable(),
	
   	total_cash: function() {
   		return HelloEmber.Portfolio.find().reduce(function(accum, portfolio) { 
                         return accum + portfolio.get('cash') }, 0)
   				}.property('controllers.Portfolios.total_cash').cacheable(),

	total_cost: function() {
		return this.get('sorted_with_ids').reduce(function(accum, stock) { 
	                      return accum + stock.get('position_cost') }, 0)
					}.property('sorted_with_ids.@each.position_cost').cacheable(),

	total_value: function() {
		return this.get('sorted_with_ids').reduce(function(accum, stock) { 
	                      return accum + stock.get('position_value') }, 0)
					}.property('sorted_with_ids.@each.position_value').cacheable(),

	total_change: function() {
		return this.get('sorted_with_ids').reduce(function(accum, stock) { 
						summ = stock.get('daily_change') * stock.get('quantity') ;				
						if (!stock.get('stock_or_option')) { summ = summ * 100 } ;
						return accum + summ }, 0)			
					}.property('sorted_with_ids.@each.daily_change').cacheable(),
	
// another way to calculate totals without .reduce
	//  with_ids: function(){        
	//    var stocks = this.content.filter(function(stock) {
	//	  return stock.get('id') != null;
	//	});
	//	return stocks
	//  }.property("content.@each.stock").cacheable(),

	//    consolidated: function(){
	//  	var cons = {} ;    
	//  	var stks = this.content.filter(function(stock) {
	//  	  	return (stock.get('id') != null) && (stock.get('stock_option') == 'Stock') });
	//      var stocks = stks.forEach(function(stock) {
	//  		if (cons[stock.get('symbol')] != null) {
	//  			cons[stock.get('symbol')].quantity += stock.get('quantity') ;			
	//  			cons[stock.get('symbol')].value = stock.get('latest_price') * cons[stock.get('symbol')].quantity ;
	//  			cons[stock.get('symbol')].change = stock.get('daily_change') * cons[stock.get('symbol')].quantity ;			
	//  			cons[stock.get('symbol')].accounts += 1 ;
	//  			cons[stock.get('symbol')].portfolios.push( stock.get('portfolio').get('name') ) ;
	//  		}
	//  		else {
	//  			var newStock = Ember.Object.create({
	//  			  symbol: stock.get('symbol'),
	//  			  quantity: stock.get('quantity'),
	//  			  value: stock.get('latest_price') * stock.get('quantity'),
	//  			  change: stock.get('daily_change') * stock.get('quantity'),
	//  			  stock: stock,
	//  			  accounts: 1,
	//  			  portfolios: [ stock.get('portfolio').get('name') ]
	//  			});			
	//  			cons[stock.get('symbol')] = newStock ;			
	//  		}
	//  	});
	//  	var a = this.get('cons') ;
	//  //	debugger;
	//  	var arr = [];
	//  	for(key in cons) { 
	//  		arr.push( cons[key] ); 
	//  	};
	//  	return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, { 
	//  		sortProperties: this.get('sortProperties'),
	//  		sortAscending: this.get('sortAscending'),
	//  	    content: Ember.A(arr) });	
	//  //  }.property("sorted_with_ids").cacheable(),
	//      }.property("content.@each.stock",'sortProperties','sortAscending').cacheable(),



	//	sorted_consolidated: function() {
	//	  var criteria = 'latest_price' ;
	//	  var order = 'desc' ; // this.get('sort_order') ;
	//	  var arr = this.get('consolidated') ;
	//	  debugger ;
	//			sorted = this.get('consolidated').sort(function(a,b) {
	//				var first = a.get('quantity') * a.stock.get(criteria);
	//				var last = b.get('quantity') * b.stock.get(criteria) ;
	//				if ( order == 'asc') {	//sort string ascending
	//					 if (last > first) return -1 
	//					 if (last < first) return 1 }
	//				else {
	//					 if (first > last) return -1 
	//					 if (first < last) return 1 }
	//			});
	//		return sorted
	//		}.property("content.@each.stock").cacheable(),




});