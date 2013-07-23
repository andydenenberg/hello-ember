HelloEmber.Adapter = DS.RESTAdapter.extend({
  bulkCommit: false,
//  url: 'http://localhost:3000'
  ajax: function(url, type, hash) {
	  hash         = hash || {};
	  hash.headers = hash.headers || {};
	  hash.headers['token'] = localStorage.login_token
	  return this._super(url, type, hash);
  }
});

HelloEmber.Adapter.map('HelloEmber.Portfolio', {
  stocks: {embedded: 'always'}
});

HelloEmber.Store = DS.Store.extend({
  revision: 13,
  adapter:  HelloEmber.Adapter.create()
});
