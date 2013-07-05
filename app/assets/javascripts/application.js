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

// for more details see: http://emberjs.com/guides/application/

HelloEmber = Ember.Application.create({
  LOG_TRANSITIONS: true,
  update_delay: 10000,
  update_auto: false,

  ready: function() {
    console.log('HelloEmber ready!');
  },

});

HelloEmber.ApplicationController = Ember.ObjectController.extend({
  toggle_update_auto: function() {
	update_auto = HelloEmber.get('update_auto') ;
	update_auto = update_auto ? false : true ;
	HelloEmber.set('update_auto', update_auto) ;		
  }
})
//= require_tree .

function flash_message(message,severity) {
	$("#flash").attr("class","alert alert-" + severity);			
	$("#flash span").text(message)
	.show().parent().fadeIn()
	.delay(2000).fadeOut('slow', function() { 
	    $("#flash span").text('') 
	});	
};

HelloEmber.Clock = Ember.Object.extend({
  second: null,
  minute: null,
  hour:   null,

  init: function() {
    this.tick();
	
  },

  get_latest_price: function() {
	if (HelloEmber.update_auto) {
			stocks = HelloEmber.Stock.find().filter(function(stock) {
			  return stock.get('id') != null;
			});
		//	stocks = HelloEmber.Stock.find().filterProperty('email', this.username) ;	
		   stocks.forEach(function(stock){			
		   	$.ajax({  
		 		url: "/stocks/" + stock.get('id') + "/current_price/",  
		 		dataType: "json",  
		 		success: function(data) { 		
		    		//stock.set('latest_price', stock.get('latest_price') + 10 );
		   		console.log('updating', data.symbol, data.price, data.change) ;
		   		stock.set('latest_price', data.price );
		   		stock.set('latest_time', data.time );
		   		stock.set('daily_change', data.change );
		   		}  
		   	});			
		   });	
		return stocks.length	
	}
  },

  tick: function() {
    var now = new Date()

	var poll = this.get_latest_price() ;
	console.log('Polled: ', poll) ;

    this.setProperties({	
      second: now.getSeconds(),
      minute: now.getMinutes(),
      hour:   now.getHours()
    });

    var self = this;
    setTimeout(function(){ self.tick(); }, HelloEmber.update_delay)
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
