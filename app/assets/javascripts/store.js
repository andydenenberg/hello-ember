HelloEmber.Adapter = DS.RESTAdapter.extend({
  bulkCommit: false,
//  url: 'http://localhost:3000'

});

HelloEmber.Adapter.map('HelloEmber.Portfolio', {
  stocks: {embedded: 'always'}
});

HelloEmber.Store = DS.Store.extend({
  revision: 13,
  adapter:  HelloEmber.Adapter.create()
});



