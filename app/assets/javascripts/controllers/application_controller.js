HelloEmber.ApplicationController = Ember.ObjectController.extend({
  needs: ['Cons'],

  dividend_date: null,

  initialize_data: function() {
	this.refresh_cache();
	Ember.run.later(this, function(){ this.consolidate() }, 2000);
	Ember.run.later(this, function(){ this.refresh_cache() }, 4000);
  },

  refresh_daily_dividend: function() {	
// Setup the modal dialog with initial date of today
	  var today = new Date()
	  var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() ;
	  this.set('dividend_date', date) ;
	  $("#dividend_dateDialog").modal({show: true});
  },
	
  collect_dividends: function() {
	$("#dividend_dateDialog").modal('hide');
	$.ajax({  
		url: "/stocks/refresh_daily_dividend?date=" + this.get('dividend_date') ,  
        beforeSend: function (request)
        { request.setRequestHeader("token", localStorage.login_token) },
		dataType: "json",  
		success: function(data) { 
	   		console.log(data.response, data.duration, ' seconds ') ;
			}  
	});
  },
    	
  consolidate: function() {	
// Dashboard indicator set to show action	
		HelloEmber.set('consolidating', 'Consolidating') ;
		Ember.run.later(this, function(){ HelloEmber.set('consolidating', 'Consolidate' ) }, 1500);
		
		var portfolios = HelloEmber.Portfolio.find() ; // preload to get data for building cons
		var cons_content = [ ] ;
		var stks = HelloEmber.Stock.find().filter(function(stock) {
		  	return (stock.get('id') != null) && (stock.get('stock_option') == 'Stock') });
	    stks.forEach(function(stock) {						
			var exist = cons_content.filterProperty('symbol', stock.get('symbol') ) ;
			if (exist.length > 0 ) { 
				exist[0].set('quantity', exist[0].get('quantity') + stock.get('quantity') ) ;
				exist[0].set('accounts', exist[0].get('accounts') + 1 ) ;
				var ports = exist[0].get('portfolios') ;
				ports.push( stock.get('portfolio') ) ;
				exist[0].set('portfolios', ports );  }
			else {
			  	var abc = HelloEmber.Cons.create({
					  		symbol: stock.get('symbol'),
					  		quantity: stock.get('quantity'),
					  		accounts: 1,
					  		portfolios: [ stock.get('portfolio')  ]
					 }) ;
				cons_content.push( abc ) ;  }
		});	
		var ConsController = this.get('controllers.Cons');
		ConsController.set('content', cons_content ) ;				
  },


	refresh_cache: function() {
		HelloEmber.set('refresh_cache_status', 'Updating') ;
	    var options = HelloEmber.Stock.find().filter(function(stock) {
				return (stock.get('stock_option') == 'Call Option' && stock.get('id') != null );
		});
		var stocks = HelloEmber.Stock.find().filter(function(stock) {
				return (stock.get('stock_option') == 'Stock' && stock.get('id') != null );
		});

		// load cons so that it can be updated
		var cons = this.get('controllers.Cons').get('content') ;		
		
		var last_stock = stocks.get('lastObject') ;
		if (typeof last_stock != 'undefined') { last_stock = last_stock.get('id') };
		
	   stocks.forEach(function(stock){	
		   	$.ajax({  
		 		url: "/stocks/" + stock.get('id') + "/current_price?real_time=" + HelloEmber.real_time,  
		        beforeSend: function (request)
		        { request.setRequestHeader("token", localStorage.login_token) },
		 		dataType: "json",  
		 		success: function(data) { 	
					if (stock.get('id') == last_stock) { HelloEmber.set('refresh_cache_status', '') }
			   		console.log('updating stock:', stock.get('id'), data.symbol, data.price, data.change) ;
			   		stock.set('latest_price', data.price );
			   		stock.set('latest_time', data.time );
			   		stock.set('daily_change', data.change );
					stock.set('daily_dividend', data.daily_dividend);
					HelloEmber.set('daily_dividend_date', data.daily_dividend_date );
					var con = cons.filterProperty('symbol', data.symbol ) ;
						if (con.length > 0 ) { 
							con[0].set('daily_change', data.change);
							con[0].set('latest_price', data.price);  };
		   		}  
		   	});			
	   });	

	   options.forEach(function(option){	
		   	$.ajax({  
		 		url: "/stocks/" + option.get('id') + "/current_price/",  
		        beforeSend: function (request)
		        {
		            request.setRequestHeader("token", localStorage.login_token);
		        },
		 		dataType: "json",  
		 		success: function(data) { 		
			   		console.log('updating opton:', option.get('id'), option.get('symbol'), data.bid, data.ask, data.previous_close) ;
					quantity = option.get('quantity') ;

					option.set('bid', data.bid ) ;
					option.set('ask', data.ask ) ;
					option.set('previous_close', data.previous_close ) ;
					option.set('latest_time', data.time );

					if (quantity < 0) { option.set('latest_price', data.ask ) }
					else { option.set('latest_price', data.bid ) }
					option.set('daily_change', numberWithCommas(Number(option.get('latest_price') - data.previous_close).toFixed(2)) );
			   		}  
		   	});			
	   });
},

	timer_update: function() {
		HelloEmber.set('cache_count', HelloEmber.cache_count - 1) ;
		var cache = HelloEmber.get('cache_count') ;
		if (HelloEmber.cache_count <= 0 ) {
			HelloEmber.set('cache_count', HelloEmber.cache_delay ) ;
			if (HelloEmber.cache_auto ) {
				this.refresh_cache();
		    }
		}
		HelloEmber.set('repo_count', HelloEmber.repo_count - 1) ;
		if (HelloEmber.repo_count <= 0 ) {
			HelloEmber.set('repo_count', HelloEmber.repo_delay );
			if (HelloEmber.repo_auto) {
				this.refresh_repo() ;
			}
		}	
	}.observes("clock.second"),
	
	
  toggle_cache_auto: function() {
	cache_auto = HelloEmber.get('cache_auto') ;
	cache_auto = cache_auto ? false : true ;
	HelloEmber.set('cache_auto', cache_auto) ;		
  },
  toggle_repo_auto: function() {
	repo_auto = HelloEmber.get('repo_auto') ;
	repo_auto = repo_auto ? false : true ;
	HelloEmber.set('repo_auto', repo_auto) ;		
  },

  refresh_repo: function() {
	HelloEmber.set('refresh_repo_status', 'Updating') ;
		$.ajax({  
			url: "/stocks/update_prices?real_time=" + HelloEmber.real_time,  
	        beforeSend: function (request)
	        { request.setRequestHeader("token", localStorage.login_token) },
			dataType: "json",  
			success: function(data) { 
				HelloEmber.set('refresh_repo_status', '') ;
		   		console.log('Cache refreshed:', data.duration, ' seconds ', data.count, 'updated') ;
			}  
		});		
	}	
});
