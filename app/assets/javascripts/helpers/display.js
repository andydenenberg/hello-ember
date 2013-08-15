Ember.Handlebars.registerBoundHelper('text_cache_auto', function(value, options) {	
		flag = 'Cache <i class="icon-off"></i> ' 
		if (value) { flag = 'Cache <i class="icon-repeat"></i> ' }	    
  return new Handlebars.SafeString(flag );
});

Ember.Handlebars.registerBoundHelper('text_repo_auto', function(value, options) {	
		flag = 'Repo <i class="icon-off"></i> ' 
		if (value) { flag = 'Repo <i class="icon-repeat"></i> ' }	    
  return new Handlebars.SafeString(flag );
});