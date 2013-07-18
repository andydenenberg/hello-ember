HelloEmber.ApplicationView = Em.View.extend({
	toggle_cache_auto_class: function(){ 
		var btn = 'btn btn-success'
		if ( !HelloEmber.cache_auto ) {
		btn = 'btn'	
		}
	    return btn
	}.property('HelloEmber.cache_auto').cacheable(),

	toggle_repo_auto_class: function(){ 
		var btn = 'btn btn-success'
		if ( !HelloEmber.repo_auto ) {
		btn = 'btn'	
		}
	    return btn
	}.property('HelloEmber.repo_auto').cacheable()
	
});
