HelloEmber.Portfolio.Route = Ember.Route.extend({
setupController: function(controller, model) {
	
	this.controller.set('content', model ) ;
	

  // highlight this contact as active
  this.controllerFor('contacts').set('activeContactId', model.get('id'));
}

});
