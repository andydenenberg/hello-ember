HelloEmber.Stock  = DS.Model.extend({
  symbol: DS.attr('string'),
  quantity: DS.attr('number'),
  purchase_price: DS.attr('number'),
  portfolio: DS.belongsTo('HelloEmber.Portfolio'),
//  created_date: DS.attr('string'), // javascript ready from rails serializer
  purchase_date: DS.attr('string'), 
  latest_price: null,
  latest_time: null,
  daily_change: null,

  state: function() {	
	state = this.get("stateManager.currentState.name") ;
	return state
  }.property('isDirty').cacheable(),

  position_cost: function() {
	return this.get('quantity') * this.get('purchase_price')
  }.property('quantity', 'purchase_price').cacheable(),

  position_value: function() {
	return this.get('quantity') * this.get('latest_price')
  }.property('quantity', 'latest_price').cacheable(),

  days_held: function() {
	var date1 = new Date( this.get('purchase_date') );
	var date2 = new Date( ) ;
	var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 	
	return diffDays
  }.property().cacheable()


});
