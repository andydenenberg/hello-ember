HelloEmber.PortfoliosView = Em.View.extend({
	didInsertElement: function() {
	  	this.controller.load_graph();
        this.$('#flash').hide();
    }
});
