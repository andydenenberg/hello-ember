
HelloEmber.Router.map(function() {
  this.resource('stocks', function() {
	this.route('new');
	this.route('edit', { path: '/:stock_id/edit' });
	this.route('delete', { path: '/:stock_id/delete' });
    this.resource('stock', {path: ':stock_id'});
  });
  this.resource('portfolios');

});


