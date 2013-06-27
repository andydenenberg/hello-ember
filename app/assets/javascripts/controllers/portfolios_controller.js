HelloEmber.PortfoliosController = Ember.ArrayController.extend({
	activePortfolioId: null,
	content: null,

  count: function() {
	return this.content.length > 0 
  }.property(),

  display_list: function() {
	return (this.activePortfolioId === null) && (this.content.get('length') > 0) 
  }.property('activePortfolioId','content.@each'),

	  sortProperties: ['portfolio_value'],
	  sortAscending: true,
	  activeContactId: null,

  sort: function() {
	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

  total_value: function() {
	var total = 0 ;
//	contacts.then(function(contacts){
		console.log('in total calc')
			this.content.forEach(function(contact){
				total += contact.get('portfolio_value') ;			
			});
//	});	
	return total // Ember.inspect( this.count )
	}.property('content.@each.portfolio_value'),

  
  delete_portfolio: function(portfolio) {
    if (window.confirm("Are you sure you want to delete this portfolio and its stocks?")) {
		portfolio.get('stocks').forEach(function(stock) {
			stock.deleteRecord() ;
		});
		portfolio.deleteRecord() ;
		this.store.commit();
	}
  }
	
});