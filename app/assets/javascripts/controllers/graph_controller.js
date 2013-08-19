function rnd(value) {
	var i=0;
	var mults = [1,1000,1000000]
	for(; value >= 1000 ; ++i) value/=1000;
	var mag = Math.round(value) ;
	return mag * mults[i] 	
};

function startAndEndOfGraph(date) {
  // If no date object supplied, use current date
  // Copy date so don't modify supplied date
  	var now = date? new Date(date) : new Date();
  // set time to some convenient value
  	now.setHours(0,0,0,0);

  // Get current Week
	var today = now ;
	var day_of_week = today.getDay() ;
	var date_of_month = today.getDate() ;
	var monday_date = date_of_month - day_of_week + 1;
	var friday_date = monday_date + 4 ;
	var friday = new Date(now) ;
	var monday = new Date(now) ;
	monday.setDate(monday_date) ;
	friday.setDate(friday_date) ;
	var Current_Week = [ monday, friday ] ;
	
  // Get start of current Month
	var date = new Date(now), y = date.getFullYear(), m = date.getMonth();
	var firstMonth = new Date(y, m, 1);
	var lastMonth = new Date(y, m + 1, 0);
	var Current_Month = [ firstMonth, lastMonth ];
	
  // Get Current Quarter
	//[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]
//	var quarter = [0, 3, 6, 9]	
	var date = new Date(now);	
	var month = Math.floor((date.getMonth() + 1) / 3) * 3 ;
	var date = new Date(now), year = date.getFullYear();
	var firstQuarter = new Date(year, month, 1);
	var lastQuarter = new Date(year, month + 3, 0);
	var Current_Quarter = [ firstQuarter, lastQuarter ];
	
  // Get start of current Year
	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	var firstYear = new Date(y, 0, 1);
	var lastYear = new Date(y, 11, 31);
	var Current_Year = [ firstYear, lastYear ];

  // Return array of date objects
  return [ Current_Week, Current_Month, Current_Quarter, Current_Year ];
};

var ajaxDataRenderer = function(url) {
  var ret = null;
  $.ajax({
    // have to use synchronous here, else the function 
    // will return before the data is fetched
    async: false,
    url: url,
    dataType:"json",
       beforeSend: function (request)
     	{ request.setRequestHeader("token", localStorage.login_token) },
    success: function(data) {
      ret = data;
    }
  });
  return ret;
};

var tickFormatter = function (format, val) { 
return '$' + numberWithCommas(Number(val).toFixed(2)) ;
};

HelloEmber.GraphController = Em.ObjectController.extend({
	needs: ['Portfolios'],
	
	jsonurl: "/portfolios/graph_data",
	graph_id: 'theegraph',
	title: 'Title',
	y_min: null,
	y_max: null,
	y_axis_label: '',
	x_min: null,
	x_max: null,
	x_tick_interval: '1 day',
	
	portfolio_names: [ ],
	
	load_data: function( portfolio_select, date_range ) {
		
		var data = ajaxDataRenderer(this.jsonurl) ;
	
		
	var PortfoliosController = this.get('controllers.Portfolios');
	var dates = PortfoliosController.get('dates');
	var portfolios = this.get('portfolio_names');
	var portfolio_index = portfolios.indexOf(portfolio_select) ;
	
	var graph_data ;
	
	if ( portfolio_index == 0 ) {
		graph_data = [ data[0] ] ;
	}
	else {
		graph_data = [ data[1][portfolio_index-1] ]
	}
	
	var index = dates.indexOf(date_range);
    var ranges = startAndEndOfGraph()[index] ;
	// set the start and end date of x-axis
	this.set('x_min',ranges[0]);
	this.set('x_max',ranges[1]);
	if (index == 1) { this.set('x_tick_interval', '1 week') }	
	if (index == 2) { this.set('x_tick_interval', '1 month') }	
	if (index == 3) { this.set('x_tick_interval', '2 months') }	
	
	
	var series_min = graph_data[0].reduce(function(min, obj) { 
	                      return obj[1] < min ? obj[1] : min; 
	                   }, Infinity) ;
	var series_max = graph_data[0].reduce(function(max, obj) { 
	                      return obj[1] > max ? obj[1] : max; 
	                   }, 0) ;
	
	this.set('y_min', rnd(series_min * 0.8 , 2) );
	this.set('y_max', rnd(series_max * 1.2 , 2) );

	  var options = {
//		dataRenderer: ajaxDataRenderer,        		
		title: {
			text: portfolio_select, // this.title,
			textAlign: 'center',
			fontSize: '18pt',
			textColor: 'black'
	    },
	   	axesDefaults: {
	       	tickOptions: {
	         		fontSize: '10pt'
	       	}
	   	},		
		seriesDefaults: {
			lineWidth: 1.5,
			showMarker: false,
			shadow: false
		},
		axes: {
		xaxis: {
			renderer:$.jqplot.DateAxisRenderer,
			tickOptions:{
				formatString:'%b %#d, %Y'
		       },
			min: this.x_min, 
			max: this.x_max,
			tickInterval: this.x_tick_interval,
		},
		yaxis: {
			tickOptions: {
		  		formatter: tickFormatter
		 	},
			label: this.y_axis_label,
	        labelOptions: {
	            fontFamily: 'Georgia, Serif',
	            fontSize: '12pt'
	        },
			show: true,
			showTicks: true,
			min: this.y_min,
			max: this.y_max,
			tickInterval: 1000000
	        
		}
		},
		legend:{
			show:true, 
			location: 'e',
			rendererOptions:{numberRows: 1, placement: "outside"}
		},
		highlighter: {
	        show: true,
	        sizeAdjust: 7.5
      	},      
		series:[
			{ showMarker:true,
//			 pointLabels: { show:true, location: 'ne' } // do not show marker, but do show point label
          	},
			{label: 'One' },
//			{label: 'Rivernorth' },
//			{label: 'K' },
//			{label: 'R' },
//			{label: 'DHC' },
//			{label: 'AandR' },
//			{label: 'SLAT1' },
//			{label: 'SLAT2' },
//			{label: 'HP' },
//			{label: 'Another' },
		],
		grid: {
			backgroundColor: '#CCFFFF',
			drawGridLines: true,
			shadow: false
		}
	  };
      
	  var plot2 = $.jqplot(this.graph_id, graph_data, options ).redraw();
	
	}
	
});
