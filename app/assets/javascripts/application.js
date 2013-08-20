// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require handlebars
//= require ember
//= require ember-data
//= require_self
//= require jquery.jqplot.js
//= require_tree .
//= require hello_ember

// for more details see: http://emberjs.com/guides/application/

HelloEmber = Ember.Application.create({
  LOG_TRANSITIONS: true,
  logged_in_state: localStorage.logged_in_state,
  logged_in_user: 'locating user info...',

  cache_delay: 60,  // every 60 seconds
  cache_count: 20,
  cache_auto: false,
  repo_delay: 300,  // every 5 minutes
  repo_count: 25,
  repo_auto: false,
	
  real_time: true,

  consolidating: 'Consolidate',
  refresh_repo_status: '', 
  refresh_cache_status: '',
  daily_dividend_date: null,

  ready: function() {
	get_user() ;
    console.log('HelloEmber ready!');
//	HelloEmber.Stock.find() ;
//	HelloEmber.Portfolio.find() ;	
  },

});

HelloEmber.ApplicationController = Ember.ObjectController.extend({
  needs: ['Cons'],

  dividend_date: null,

  refresh_daily_dividend: function() {	
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
        {
            request.setRequestHeader("token", localStorage.login_token);
        },
		dataType: "json",  
		success: function(data) { 
	   		console.log(data.response, data.duration, ' seconds ') ;
			}  
	});
  },
    	
  consolidate: function() {		
		HelloEmber.set('consolidating', 'Consolidating') ;
		Ember.run.later(this, function(){
			HelloEmber.set('consolidating', 'Consolidate' ) ;
		}, 1500);
		
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
					if (stock.get('id') == last_stock) {
						HelloEmber.set('refresh_cache_status', '') ;
					}
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
	
	
//  cache_update: function() {
//
//	this.consolidate();
//
//    this.refresh_cache();
//  },

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
	        {
	            request.setRequestHeader("token", localStorage.login_token);
	        },
			dataType: "json",  
			success: function(data) { 
				HelloEmber.set('refresh_repo_status', '') ;
		   		console.log('Cache refreshed:', data.duration, ' seconds ', data.count, 'updated') ;
				}  
		});		
	}
	
});

HelloEmber.security_type = ["Stock", "Call Option", "Put Option"];

function get_user() {
   	$.ajax({  
 		url: "/get_user",  
        beforeSend: function (request)
        { request.setRequestHeader("token", localStorage.login_token) },
 		dataType: "json",  
 		success: function(data) { HelloEmber.set('logged_in_user', data.email) }  
   	});				
};

function flash_message(message,severity) {
	$("#flash").attr("class","alert alert-" + severity);			
	$("#flash span").text(message)
	.show().parent().fadeIn()
	.delay(2000).fadeOut('slow', function() { 
	    $("#flash span").text('') 
	});	
};

function current_option(symbol, expiration, strike, controller) {
	$.ajax({  
 		url: "/stocks/option_price?symbol=" + symbol + '&expiration=' + expiration + '&strike=' + strike,  
 		dataType: "json",  
 		success: function(data) { 
		controller.set('new_stock_price', data.price) ;
		controller.set('new_stock_price_change', 'Daily Change: $' + data.change + ' at ' + data.time ); 
   		}  
   	});				
}

function current_quote(symbol, controller) {
	$.ajax({  
 		url: "/stocks/stock_price?symbol=" + symbol,  
 		dataType: "json",  
 		success: function(data) { 
		controller.set('new_stock_price', data.price) ;
		controller.set('new_stock_price_change', 'Daily Change: $' + data.change + ' at ' + data.time ); 
   		}  
   	});				
}


HelloEmber.Clock = Ember.Object.extend({
  second: null,
  minute: null,
  hour:   null,

  init: function() {
    this.tick();
  },

  tick: function() {
    var now = new Date()
    this.setProperties({	
      second: now.getSeconds(),
      minute: now.getMinutes(),
      hour:   now.getHours()
    });

    var self = this;
    setTimeout(function(){ self.tick(); }, 1000)
  }
});

Ember.Application.initializer({
  name: "clock",
  initialize: function(container, application) {
    container.optionsForType('clock', { singleton: true });
    container.register('clock:main', application.Clock);
    container.typeInjection('controller', 'clock', 'clock:main');
  }
});

// don't break ObjectController
Ember.ControllerMixin.reopen({ clock: null });

// Defer App readiness until it should be advanced for either
// testing or production.
HelloEmber.deferReadiness();

