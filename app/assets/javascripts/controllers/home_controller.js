HelloEmber.HomeController = Ember.ArrayController.extend({
	needs: ['Graph', 'Portfolios'],
	series: [  ],
	tv_count: 0,
	
  	count: function() {
	return this.series.length  
  		}.property('series'),
	
	timer_count: 15,
	most_recent: 0,
	
	load_graph: function(){
		this.update_content() ;
		var GraphController = this.get('controllers.Graph');
		GraphController.load_data( 'total_combined_value', 'Total Combined Value', '08:00AM', '04:00PM', '60 minutes', [this.series] );
	},	
	
	update_content: function() {
		var PortfoliosController = this.get('controllers.Portfolios')

		var now = new Date();
		var h = now.getHours();
		var ap = (h > 11) ? 'PM' : 'AM'
		if (ap == 'PM') { h = h - 12 }
		var m = now.getMinutes() + '' ; // convert to string
	    while (m.length < 2) m = "0" + m; 	    
		var new_time = h + ':' + m + ap ;

		var series = this.get('series')
		this.set('most_recent', HelloEmber.Portfolio.find().reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('portfolio_value') }, 0) );
		series.push([new_time, this.get('most_recent') ]) ;
		this.set('series', series) ;
		this.set('tv_count', this.series.length) ;
	},

	timer_update: function() {
		var timer_count = this.timer_count - 1 ;
		if (timer_count <= 0 ) {
			this.update_content() ;
			timer_count = 60 ;
		}
		this.set('timer_count', timer_count ) ;
	}.observes("clock.second"),

});