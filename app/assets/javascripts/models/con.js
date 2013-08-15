HelloEmber.Con  = DS.Model.extend({
  symbol: DS.attr('string'),
  stock_option: null,
  quantity: 0,
  accounts: 0,
  portfolios: [ ],
  latest_price: 0,
  daily_change: 0,

  position_value: function() {
	return this.get('quantity') * this.get('latest_price')
  }.property('quantity', 'latest_price').cacheable(),

  position_daily: function() {
	return this.get('quantity') * this.get('daily_change')
  }.property('quantity', 'daily_change').cacheable(),

});