
HelloEmber.Router.map(function() {
  this.route('home') ;
  this.route("about");
  this.route("login");
//  this.route("login", { path: "/login" });
  this.resource('stocks', function() {
	this.route('new');
	this.route('edit', { path: '/:stock_id/edit' });
//	this.route('delete', { path: '/:stock_id/delete' });
    this.resource('stock', {path: ':stock_id'});
  });
  this.resource('portfolios', function() {
	this.route('new');
	this.route('position', { path: '/:portfolio_id/position' } );
	this.route('option', { path: '/:portfolio_id/option' } );
//	this.route('edit', { path: '/:portfolio_id/edit' });
//	this.route('delete', { path: '/:portfolio_id/delete' });
    this.resource('portfolio', {path: ':portfolio_id'});
  });

});


