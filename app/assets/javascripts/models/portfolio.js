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
			cost += stock.get('position_value') ;
			//cost += stock.get('quantity') * stock.get('latest_price') ;				
		});
	return cost
 	}.property('stocks.@each.position_value').cacheable(),

  display_list: function() {
	return this.get('stocks').get('length') > 0
  }.property('stocks.@each'),


});
