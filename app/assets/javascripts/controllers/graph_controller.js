function round_off(value) {
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
return '$' + numberWithCommas(Number(val).toFixed(0)) ;
};

HelloEmber.GraphController = Em.ObjectController.extend({
	needs: ['Portfolios'],
	
//	jsonurl: "/portfolios/graph_data",
//	graph_id: 'theegraph',
//	title: 'Title',
	y_min: null,
	y_max: null,
	y_axis_label: '',
//	x_min: null,
//	x_max: null,
//	x_tick_interval: null,
//	portfolio_names: [ ],
	
	load_data: function(graph_id, title, x_min, x_max, x_tick_interval, series_data, x_tick_options  ) {
//	this.set('x_min',x_min);
//	this.set('x_max',x_max);
//	this.set('x_tick_interval', x_tick_interval) ;
	
	var series_min = series_data[0].reduce(function(min, obj) { return obj[1] < min ? obj[1] : min; }, Infinity) ;
	var series_max = series_data[0].reduce(function(max, obj) { return obj[1] > max ? obj[1] : max; }, 0) ;
	
	this.set('y_min', round_off(series_min * 0.95 , 2) );
	this.set('y_max', round_off(series_max * 1.05 , 2) );

	  var options = {
//		dataRenderer: ajaxDataRenderer,        		
		title: {
			text: title,
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
			lineWidth: 3,
			showMarker: false,
			shadow: false
		},
		axes: {
		xaxis: {
			renderer:$.jqplot.DateAxisRenderer,
			tickOptions:{
//				formatString:'%b %#d, %Y'
//				formatString:'%I:%M %p'
				formatString: x_tick_options,
		       },
			min: x_min, 
			max: x_max,
			tickInterval: x_tick_interval,
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
			tickInterval: round_off( ((this.y_max - this.y_min) / 10), 2 ),
	        
		}
		},
		legend:{
			show:false, 
			location: 'e',
			rendererOptions:{numberRows: 1, placement: "outside"}
		},
		highlighter: {
	        show: true,
	        sizeAdjust: 10
      	},      
		series:[
			{ showMarker:false,
//			 pointLabels: { show:true, location: 'ne' } // do not show marker, but do show point label
          	},
//			{label: 'One' },
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
			backgroundColor: '#eeffff', // '#eeffff',  //'#CCFFFF',
			drawGridLines: true,
			shadow: false
		}
	  };
      
//	  var plot2 = $.jqplot(this.graph_id, series_data, options ).redraw();
	  var plot2 = $.jqplot(graph_id, series_data, options ).redraw();
	
	}
	
});
