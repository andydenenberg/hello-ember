HelloEmber.Stock  = DS.Model.extend({
  symbol: DS.attr('string'),
  quantity: DS.attr('number'),
  purchase_price: DS.attr('number')
});
