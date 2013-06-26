HelloEmber.Portfolio  = DS.Model.extend({
  name: DS.attr('string'),
  stocks: DS.hasMany('HelloEmber.Stock'),

  state: function() {	
	state = this.get("stateManager.currentState.name") ;
	return state
   }.property('isDirty').cacheable(),

  portfolio_value: function() {
	cost = 0 ;
	this.get('stocks').forEach(function(stock){
			cost += stock.get('quantity') * stock.get('purchase_price') ;				
		});
	return cost
 	}.property('stocks.@each').cacheable(),

});
