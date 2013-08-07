HelloEmber.GraphController = Em.ObjectController.extend({
//    content: HelloEmber.GraphState.create(),
	graph: null,
	load: function(){

	  var ajaxDataRenderer = function(url, plot, options) {
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
	
	tickFormatter = function (format, val) { 
	return '$' + numberWithCommas(val) ;
	};

	  var jsonurl = "/portfolios/graph_data";
	  var options = {
		dataRenderer: ajaxDataRenderer,        		
		title: {
			text: 'Portfolio Performance',
			textAlign: 'center',
			fontSize: '18pt',
			textColor: 'black'
	    },
	   	axesDefaults: {
	       	tickOptions: {
	         		fontSize: '12pt'
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
			tickOptions:{formatString:'%b %#d, %Y'},
			min:'Jul 22, 2013', 
			tickInterval:'1 week'
		},
		yaxis: {
			tickOptions: {
		  		formatter: tickFormatter
		 	},
			show: true,
			showTicks: true,
			min: 16000000,
			max: 17500000,
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
			backgroundColor: '#FFF',
			drawGridLines: true,
			shadow: false
		}
	  };
      
	  // passing in the url string as the jqPlot data argument is a handy
	  // shortcut for our renderer.  You could also have used the
	  // "dataRendererOptions" option to pass in the url.

	  var plot2 = $.jqplot(this.graph, jsonurl, options );
	
	}
	
});
