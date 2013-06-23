HelloEmber.Stock  = DS.Model.extend({
  symbol: DS.attr('string'),
  quantity: DS.attr('number'),
  purchase_price: DS.attr('number'),
  portfolio: DS.belongsTo('HelloEmber.Portfolio'),

  pid: function() {
	return this.get('portfolio').id
  }.property('portfolio'),

  state: function() {	
	state = this.get("stateManager.currentState.name") ;
	return state
   }.property('isDirty').cacheable(),

});
