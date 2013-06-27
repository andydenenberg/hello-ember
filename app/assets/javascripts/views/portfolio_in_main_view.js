HelloEmber.PortfolioInMainView = Em.View.extend({
  templateName: 'portfolio_in_main',
  tagName: '', // could be tr or li
  classNameBindings: 'isActive:active',

  isActive: function() {
    return this.get('content.id') === this.get('controller.activePortfolioId');
  }.property('controller.activePortfolioId')
});
