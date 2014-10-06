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
  cache_auto: true,
  repo_delay: 300,  // every 5 minutes
  repo_count: 25,
  repo_auto: true,
	
  real_time: true,

  consolidating: 'Consolidate',
  refresh_repo_status: '', 
  refresh_cache_status: '',
  daily_dividend_date: null,

  currentPath: null,

  ready: function() {
// get the token the locally stored token (if existing) and authenticate with server
// if valid will retrieve and store the user email in logged_in_user:
	get_user() ;
    console.log('HelloEmber ready!');
  },

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

