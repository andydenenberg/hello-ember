HelloEmber.HomeController = Ember.ArrayController.extend({
	content: [  ],
	needs: ['Graph', 'Portfolios'],
	timer_count: 60,
	
	load_graph: function(){
		var PortfoliosController = this.get('controllers.Portfolios')
		var content = this.get('content')
		var now = new Date();
		var h = now.getHours();
		var ap = (h > 12) ? 'PM' : 'AM'
		if (ap == 'PM') { h = h - 12 }
		var m = now.getMinutes() + '' ; // convert to string
	    while (m.length < 2) m = "0" + m; 
	    
		var new_time = h + ':' + m + ap ;
		
//		var tv = PortfoliosController.get('total_value') ;
		tv = HelloEmber.Portfolio.find().reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('portfolio_value') }, 0) ;
		content.push([new_time, tv ]) ;
		this.set('content', content) ;
		var GraphController = this.get('controllers.Graph');
//		GraphController.set('portfolio_names', [ this.portfolio_select ] ) ;
		GraphController.load_data( 'total_combined_value', 'Total Combined Value', '08:00AM', '04:00PM', '60 minutes', [this.content] );
	},	

	timer_update: function() {
		var timer_count = this.timer_count - 1 ;
		console.log(timer_count) ;
		if (timer_count <= 0 ) {
			this.load_graph() ;
			timer_count = 60 ;
		}
		this.set('timer_count', timer_count ) ;
	}.observes("clock.second"),

});