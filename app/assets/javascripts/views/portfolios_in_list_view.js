HelloEmber.PortfolioInListView = Em.View.extend({
  templateName: 'portfolio_in_list',
  tagName: 'li',
  classNameBindings: 'isActive:active',

  isActive: function() {
    return this.get('content.id') === this.get('controller.activePortfolioId');
  }.property('controller.activePortfolioId')
});

HelloEmber.PortfolioHeaderView = Em.View.extend({
  templateName: 'portfolio_in_list_header',
  tagName: 'li',
  classNameBindings: 'isActive:active',

  isActive: function() {
    return this.get('controller.activePortfolioId') == null ;
  }.property('controller.activePortfolioId')
});

