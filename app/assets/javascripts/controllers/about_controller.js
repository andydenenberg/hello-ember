HelloEmber.AboutController = Em.ObjectController.extend({
	needs: ['Graph'],
		
	load: function(){
		var GraphController = this.get('controllers.Graph');
	    GraphController.set('graph', 'theegraph');
	    GraphController.load();
	}
    
});

