HelloEmber.Portfolio  = DS.Model.extend({
//  sample: 100,
  cash: DS.attr('number'),
  name: DS.attr('string'),
  stocks: DS.hasMany('HelloEmber.Stock'),

  state: function() {	
	state = this.get("stateManager.currentState.name") ;
	return state
   }.property('isDirty').cacheable(),

  stocks_only: function() {
	return this.get('stocks').filterProperty('stock_option', "Stock")
	}.property('stocks').cacheable(),

  stocks_exist: function() {
	return this.get('stocks_only').get('length') > 0
  }.property('stocks_only').cacheable(),

  options_only: function() {
	var options = this.get('stocks').filter(function(stock) {
			return (stock.get('stock_option').indexOf('Option') !== -1 && stock.get('id') != null );
			});
	return options
  }.property('stocks').cacheable(),

  options_exist: function() {
	return this.get('options_only').get('length') > 0
  }.property('options_only').cacheable(),

	daily_dividends: function() {
		return this.get('stocks_only').reduce(function(accum, stock) { 
	                      return accum + stock.get('daily_dividend') * stock.get('quantity') }, 0)
					}.property('stocks.@each.daily_dividend').cacheable(),

//	var cost = 0 ;
//	this.get('stocks_only').forEach(function(stock){
//			cost += stock.get('daily_dividend') * stock.get('quantity') ;				
//		});
//	return cost
//	}.property('stocks.@each.daily_dividend').cacheable(),	

  	stocks_cost: function() {
		return this.get('stocks_only').reduce(function(accum, stock) { 
	                      return accum + stock.get('position_cost') }, 0)
					}.property('stocks.@each.position_cost').cacheable(),

//	cost = 0 ;
//	this.get('stocks_only').forEach(function(stock){
//			cost += stock.get('position_cost') ;				
//		});
//	return cost
// 	}.property('stocks.@each.position_cost').cacheable(),

  	stocks_value: function() {
		return this.get('stocks_only').reduce(function(accum, stock) { 
	                      return accum + stock.get('position_value') }, 0)
					}.property('stocks.@each.position_value').cacheable(),

//	cost = 0 ;
//	this.get('stocks_only').forEach(function(stock){
//			cost += stock.get('position_value') ;				
//		});
//	return cost
// 	}.property('stocks.@each.position_value').cacheable(),

  	stocks_daily: function() {
		return this.get('stocks_only').reduce(function(accum, stock) { 
	                      return accum + stock.get('daily_change') * stock.get('quantity') }, 0)
					}.property('stocks.@each.daily_change').cacheable(),

//   var total = 0 ;
//   		this.get('stocks_only').forEach(function(stock){
//   			summ = stock.get('daily_change') * stock.get('quantity') ;				
//   			total += summ ;			
//   		});
//   return total 
//   }.property('stocks.@each.daily_change').cacheable(),

  	options_cost: function() {
		return this.get('options_only').reduce(function(accum, option) { 
	                      return accum + option.get('position_cost') }, 0)
					}.property('stocks.@each.position_cost').cacheable(),

//	cost = 0 ;
//	this.get('options_only').forEach(function(stock){
//			cost += stock.get('position_cost') ;				
//		});
//	return cost
// 	}.property('stocks.@each.position_cost').cacheable(),


  	options_value: function() {
		return this.get('options_only').reduce(function(accum, option) { 
	                      return accum + option.get('position_value') }, 0)
					}.property('stocks.@each.position_value').cacheable(),


//   cost = 0 ;
//   this.get('options_only').forEach(function(stock){
//   		cost += stock.get('position_value') ;				
//   	});
//   return cost
//	}.property('stocks.@each.position_value').cacheable(),

  	options_daily: function() {
		return this.get('options_only').reduce(function(accum, option) { 
	                      return accum + option.get('daily_change') * option.get('quantity') * 100 }, 0)
					}.property('stocks.@each.daily_change').cacheable(),

//   var total = 0 ;
//   		this.get('options_only').forEach(function(stock){
//   			summ = stock.get('daily_change') * stock.get('quantity') * 100 ;				
//   			total += summ ;			
//   		});
//   return total 
//   }.property('stocks.@each.daily_change').cacheable(),

  	portfolio_value: function() {
		var secs = this.get('stocks').reduce(function(accum, stock) { 
	                      return accum + stock.get('position_value') }, 0)
		return secs + this.get('cash') ;
					}.property('stocks.@each.position_value').cacheable(),

//	cost = 0 ;
//	this.get('stocks').forEach(function(stock){
//			cost += stock.get('position_value') ;
//		});
//	return cost + this.get('cash')
// 	}.property('stocks.@each.position_value').cacheable(),

  	portfolio_daily: function() {	
		return this.get('stocks').reduce(function(accum, stock) { 
			var summ = stock.get('daily_change') * stock.get('quantity') ;
			if (!stock.get('stock_or_option')) { summ = summ * 100 } ;
            return accum + summ }, 0)
		}.property('stocks.@each.daily_change').cacheable(),
	
//	var total = 0 ;
//			this.get('stocks').forEach(function(stock){
//				summ = stock.get('daily_change') * stock.get('quantity') ;				
//				if (!stock.get('stock_or_option')) { summ = summ * 100 } ;
//				total += summ ;			
//			});
//	return total 
//	}.property('stocks.@each.daily_change').cacheable(),


//  display_list: function() {
//	return this.get('stocks').get('length') > 0
//  }.property('stocks.@each'),

	didLoad: function() {
    console.log('portfolio:didLoad model:', this.toJSON());
  },

});
