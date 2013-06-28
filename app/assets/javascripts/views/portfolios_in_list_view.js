HelloEmber.PortfolioInListView = Em.View.extend({
  templateName: 'portfolio_in_list',
  tagName: 'li',
  classNameBindings: 'isActive:active',

  isActive: function() {
    return this.get('content.id') === this.get('controller.activePortfolioId');
  }.property('controller.activePortfolioId')
});
