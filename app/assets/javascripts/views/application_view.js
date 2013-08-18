HelloEmber.ApplicationView = Em.View.extend({
	consolidate_button_class: function(){ 
		var btn = 'btn'
		if ( HelloEmber.consolidating == 'Consolidating') { btn = 'btn btn-info' }
	    return btn
	}.property('HelloEmber.consolidating').cacheable(),

	login_button_class: function(){ 
		var btn = 'btn btn-success'
		if ( HelloEmber.logged_in_state ) { btn = 'btn'	}
	    return btn
	}.property('HelloEmber.logged_in_state').cacheable(),

	toggle_cache_auto_class: function(){ 
		var btn = 'btn btn-success'
		if ( !HelloEmber.cache_auto ) { btn = 'btn'	}
	    return btn
	}.property('HelloEmber.cache_auto').cacheable(),

	toggle_repo_auto_class: function(){ 
		var btn = 'btn btn-success'
		if ( !HelloEmber.repo_auto ) { btn = 'btn'	}
	    return btn
	}.property('HelloEmber.repo_auto').cacheable()
	
});
