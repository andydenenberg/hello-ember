HelloEmber.ApplicationView = Em.View.extend({
	toggle_update_class: function(){ 
		var btn = 'btn btn-success'
		if ( !HelloEmber.update_auto ) {
		btn = 'btn'	
		}
	    return btn
	}.property('HelloEmber.update_auto').cacheable()
	
});
