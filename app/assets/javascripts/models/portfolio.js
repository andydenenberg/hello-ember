HelloEmber.Portfolio  = DS.Model.extend({
  name: DS.attr('string'),
  stocks: DS.hasMany('HelloEmber.Stock'),
});
