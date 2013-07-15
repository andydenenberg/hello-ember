HelloEmber.Portfolio  = DS.Model.extend({
  sample: 100,
  cash: DS.attr('number'),
  name: DS.attr('string'),
  stocks: DS.hasMany('HelloEmber.Stock'),

  state: function() {	
	state = this.get("stateManager.currentState.name") ;
	return state
   }.property('isDirty').cacheable(),

  portfolio_value: function() {
	cost = 0 ;
	this.get('stocks').forEach(function(stock){
			cost += stock.get('position_value') ;
			//cost += stock.get('quantity') * stock.get('latest_price') ;				
		});
	return cost + this.get('cash')
 	}.property('stocks.@each.position_value').cacheable(),

// portfolio_daily: function() {
//   cost = 0 ;
//   this.get('stocks').forEach(function(stock){
//   		cost += stock.get('quantity') * stock.get('daily_change') ;				
//   	});
//   return cost
//	}.property('stocks.@each.position_value').cacheable(),

  	portfolio_daily: function() {
	var total = 0 ;
			this.get('stocks').forEach(function(stock){
				summ = stock.get('daily_change') * stock.get('quantity') ;				
				if (!stock.get('stock_or_option')) { summ = summ * 100 } ;
				total += summ ;			
			});
	return total 
	}.property('stocks.@each.daily_change'),


  display_list: function() {
	return this.get('stocks').get('length') > 0
  }.property('stocks.@each'),

	didLoad: function() {
    console.log('portfolio:didLoad model:', this.toJSON());
  },

});
