HelloEmber.Stock  = DS.Model.extend({
  symbol: DS.attr('string'),
  quantity: DS.attr('number'),

  purchase_price: DS.attr('number'),
  portfolio: DS.belongsTo('HelloEmber.Portfolio'),

  purchase_date: DS.attr('string'), 
  strike: DS.attr('number'),
  expiration_date: DS.attr('string'),
  stock_option: DS.attr('string'),

  stock_or_option: function() {
  	return this.get('stock_option') == 'Stock' ;
  }.property('stock_option').cacheable(),

  value_quantity: function() {
	value = this.get('quantity')
	if (this.get('stock_option') != 'Stock') { value = value * 100 }
	return value
  }.property('quantity').cacheable(),

  latest_price: null,
  latest_time: null,
  daily_change: null,
  daily_dividend: null,

  bid: null,
  ask: null,
  previous_close: null,

  state: function() {	
	state = this.get("stateManager.currentState.name") ;
	return state
  }.property('isDirty').cacheable(),

  position_cost: function() {
	value = this.get('value_quantity') * this.get('purchase_price')
	if (this.get('stock_option') == 1) { value = value * 100 }
	return value 
  }.property('value_quantity', 'purchase_price').cacheable(),

  position_daily: function() {
	value = this.get('value_quantity') * this.get('daily_change')
	if (this.get('stock_option') == 1) { value = value * 100 }
	return value
  }.property('value_quantity', 'daily_change').cacheable(),

  position_value: function() {
	value = this.get('value_quantity') * this.get('latest_price')
	if (this.get('stock_option') == 1) { value = value * 100 }
	return value
  }.property('value_quantity', 'latest_price').cacheable(),

  days_held: function() {
	var date1 = new Date( this.get('purchase_date') );
	var date2 = new Date( ) ;
	var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 	
	return diffDays
  }.property().cacheable()


});
