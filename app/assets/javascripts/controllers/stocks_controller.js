HelloEmber.StocksController = Em.ArrayController.extend({
  activeStockId: null,

  sort_criteria: 'position_value',
  sort_order: 'asc',

  by_symbol: 'symbol',
  by_value: 'value',
  by_change: 'change',

  col_symbol: 'symbol',
  col_value: 'value',
  col_change: 'change',

  display_list: function() {
	// hide stocks listing if one is selected of if list is blank
	return (this.activeStockId === null) && (this.content.get('length') > 0) 	
  }.property('activeStockId','content.@each'),

  sort: function(criteria) {
	this.set('sort_criteria', criteria);	
	direction = this.get('sort_order') ;
	if (direction == 'asc') { this.set('sort_order', 'desc') ;	}
	else { this.set('sort_order', 'asc') ; };    
  },

  sorted_with_ids: function() {
	var sorted = this.content.filter(function(stock) {
	  return stock.get('id') != null;
	});
    var so = this.get('sort_order') ;
	if (this.get('sort_criteria') == 'symbol') {
		sorted = sorted.sort(function(a,b) {
			if ( so == 'asc') {			
				 if (b.get('symbol') > a.get('symbol')) //sort string ascending
				  return -1 
				 if (b.get('symbol') < a.get('symbol'))
				  return 1 }
			else {
				 if (a.get('symbol') > b.get('symbol')) //sort string descending
				  return -1 
				 if (a.get('symbol') < b.get('symbol'))
				  return 1 }
		});
	}
	else if (this.get('sort_criteria') == 'value') {
		sorted = sorted.sort(function(a,b) {
			// change position of a and b to change sort order
			if (so == 'asc') {
			    return b.get('position_value') - a.get('position_value');  }
			else {
				return a.get('position_value') - b.get('position_value');  }
		});
	}
	else {
		//To sort numbers only
		sorted = sorted.sort(function(a,b) {
			// change position of a and b to change sort order
			if (so == 'asc') {
			    return b.get('position_daily') - a.get('position_daily');  }
			else {
				return a.get('position_daily') - b.get('position_daily');  }
		});
	}	
	return sorted
	}.property("content.@each.stock",'sort_order','sort_criteria').cacheable(),
	
//  with_ids: function(){        
//    var stocks = this.content.filter(function(stock) {
//	  return stock.get('id') != null;
//	});
//	return stocks
//  }.property("content.@each.stock").cacheable(),

  total_cash: function() {
	var cash = 0 ;
	var ports = HelloEmber.Portfolio.find()
		ports.forEach(function(portfolio){
		cash += portfolio.get('cash') 	});
	return cash 
	}.property().cacheable(),

  total_cost: function() {
	var total = 0 ;
//	contacts.then(function(contacts){
			this.get('sorted_with_ids').forEach(function(stock){
				total += stock.get('position_cost') ;			
			});
//	});	
	return total // Ember.inspect( this.count )
	}.property('with_ids.@each.position_cost'),

  total_value: function() {
	var total = 0 ;
			this.get('sorted_with_ids').forEach(function(stock){
				total += stock.get('position_value') ;			
			});
	return total // Ember.inspect( this.count )
	}.property('with_ids.@each.position_value'),

  total_change: function() {
	var total = 0 ;
			this.get('sorted_with_ids').forEach(function(stock){
				total += stock.get('daily_change') * stock.get('quantity');			
			});
	return total // Ember.inspect( this.count )
	}.property('with_ids.@each.daily_change'),

// methods
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
  }

});