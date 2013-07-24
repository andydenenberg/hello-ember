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
//= require hello_ember
//= require_tree .

// for more details see: http://emberjs.com/guides/application/

HelloEmber = Ember.Application.create({
  LOG_TRANSITIONS: true,
  logged_in_state: localStorage.logged_in_state,

  cache_delay: 60,  // every 60 seconds
  cache_count: 60,
  cache_auto: false,
  repo_delay: 300,  // every 5 minutes
  repo_count: 300,
  repo_auto: false,
	
  real_time: true,

  ready: function() {
    console.log('HelloEmber ready!');
  },

});

HelloEmber.ApplicationController = Ember.ObjectController.extend({
	
  cache_update: function() {
    refresh_cache();
  },

  repo_update: function() {
    refresh_repo();
  },

  toggle_cache_auto: function() {
	cache_auto = HelloEmber.get('cache_auto') ;
	cache_auto = cache_auto ? false : true ;
	HelloEmber.set('cache_auto', cache_auto) ;		
  },
  toggle_repo_auto: function() {
	repo_auto = HelloEmber.get('repo_auto') ;
	repo_auto = repo_auto ? false : true ;
	HelloEmber.set('repo_auto', repo_auto) ;		
  }

})

HelloEmber.security_type = ["Stock", "Call Option", "Put Option"];

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

function refresh_cache()  {	
	    options = HelloEmber.Stock.find().filter(function(stock) {
				return (stock.get('stock_option') == 'Call Option' && stock.get('id') != null );
		});
		stocks = HelloEmber.Stock.find().filter(function(stock) {
				return (stock.get('stock_option') == 'Stock' && stock.get('id') != null );
		});
	//	stocks = HelloEmber.Stock.find().filterProperty('email', this.username) ;			
	   stocks.forEach(function(stock){	
		   	$.ajax({  
		 		url: "/stocks/" + stock.get('id') + "/current_price?real_time=" + HelloEmber.real_time,  
		        beforeSend: function (request)
		        {
		            request.setRequestHeader("token", localStorage.login_token);
		        },
		 		dataType: "json",  
		 		success: function(data) { 		
			   		console.log('updating stock:', stock.get('id'), data.symbol, data.price, data.change) ;
			   		stock.set('latest_price', data.price );
			   		stock.set('latest_time', data.time );
			   		stock.set('daily_change', data.change );
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
	return stocks.length	
}

function refresh_repo() {
	$.ajax({  
		url: "/stocks/update_prices?real_time=" + HelloEmber.real_time,  
        beforeSend: function (request)
        {
            request.setRequestHeader("token", localStorage.login_token);
        },
		dataType: "json",  
		success: function(data) { 		
	   		console.log('Cache refreshed:', data.duration, ' seconds ', data.count, 'updated') ;
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

//  if updating, block the timer from firing again

	HelloEmber.set('cache_count', HelloEmber.cache_count - 10) ;
	if (HelloEmber.cache_count <= 0 ) {
		HelloEmber.set('cache_count', HelloEmber.cache_delay ) ;
		if (HelloEmber.cache_auto ) {
				var poll = refresh_cache() ;
	    }
	}
	
	HelloEmber.set('repo_count', HelloEmber.repo_count - 10) ;
	if (HelloEmber.repo_count <= 0 ) {
		HelloEmber.set('repo_count', HelloEmber.repo_delay );
		if (HelloEmber.repo_auto) {
				refresh_repo() ;
		}
	}
   	
    this.setProperties({	
      second: now.getSeconds(),
      minute: now.getMinutes(),
      hour:   now.getHours()
    });

    var self = this;
    setTimeout(function(){ self.tick(); }, 10000)
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

