HelloEmber.Stock  = DS.Model.extend({
  symbol: DS.attr('string'),
  quantity: DS.attr('number'),
  purchase_price: DS.attr('number'),
  portfolio: DS.belongsTo('HelloEmber.Portfolio'),
  created_date: DS.attr('string'), // javascript ready from rails serializer
  latest_price: null,

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


});
