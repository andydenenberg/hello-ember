HelloEmber.AboutView = Ember.View.extend({
  templateName: 'about',

  didInsertElement : function() {
  	this.controller.load();
  }

});

