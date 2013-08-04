HelloEmber.GraphState = Em.Object.extend({

series : [[["07-25-2013 05:00PM", 16371653], ["07-26-2013 05:00PM", 16428915], ["07-29-2013 05:00PM", 16527870], ["07-30-2013 05:00PM", 16569722], ["08-01-2013 05:00PM", 16662247]], [["07-26-2013 05:00PM", "17880.06"], ["07-26-2013 05:00PM", "17987.48"], ["07-29-2013 05:00PM", "17963.31"], ["07-30-2013 05:00PM", "17845.15"], ["08-01-2013 05:00PM", "17568.54"]], [["07-26-2013 05:00PM", "2205.23"], ["07-26-2013 05:00PM", "2208.63"], ["07-29-2013 05:00PM", "2181.44"], ["07-30-2013 05:00PM", "2190.78"], ["08-01-2013 05:00PM", "2229.03"]], [["07-26-2013 05:00PM", "85176.53"], ["07-26-2013 05:00PM", "85507.03"], ["07-29-2013 05:00PM", "85564.53"], ["07-30-2013 05:00PM", "87188.53"], ["08-01-2013 05:00PM", "88887.53"]], [["07-26-2013 05:00PM", "5770249.14"], ["07-26-2013 05:00PM", "5790604.34"], ["07-29-2013 05:00PM", "5769310.64"], ["07-30-2013 05:00PM", "5778255.02"], ["08-01-2013 05:00PM", "5811291.55"]], [["07-26-2013 05:00PM", "2570602.62"], ["07-26-2013 05:00PM", "2581167.34"], ["07-29-2013 05:00PM", "2579978.44"], ["07-30-2013 05:00PM", "2582223.61"], ["08-01-2013 05:00PM", "2619050.59"]], [["07-26-2013 05:00PM", "2902009.0"], ["07-26-2013 05:00PM", "2911408.42"], ["07-29-2013 05:00PM", "2909904.94"], ["07-30-2013 05:00PM", "2913859.51"], ["08-01-2013 05:00PM", "2929568.45"]], [["07-26-2013 05:00PM", "2773261.95"], ["07-26-2013 05:00PM", "2777180.12"], ["07-29-2013 05:00PM", "2777103.64"], ["07-30-2013 05:00PM", "2792899.0"], ["08-01-2013 05:00PM", "2781254.41"]], [["07-26-2013 05:00PM", "1881528.34"], ["07-26-2013 05:00PM", "1894111.21"], ["07-29-2013 05:00PM", "1891455.23"], ["07-30-2013 05:00PM", "1900992.23"], ["08-01-2013 05:00PM", "1917624.11"]], [["07-26-2013 05:00PM", "368741.0"], ["07-26-2013 05:00PM", "368741.0"], ["07-29-2013 05:00PM", "368741.0"], ["07-30-2013 05:00PM", "368741.0"], ["08-01-2013 05:00PM", "368741.0"]], [["07-29-2013 05:00PM", "125667.79"], ["07-30-2013 05:00PM", "125527.79"], ["08-01-2013 05:00PM", "126031.79"]]],
jsonurl : "/portfolios/graph_data",

});

/**************************
 * Views
 **************************/

HelloEmber.AboutView = Ember.View.extend({
  templateName: 'about',
  graphStateBinding: 'HelloEmber.AboutController.content',
//  plotObj: null,

	didInsertElement : function() {
//		alert($('.container').innerWidth()) ;
//		var width = $('.container').innerWidth() * 0.95;
//		var height = width / 2 ;
//		$('#theegraph').css({'height': height, 'width': width});

  this.controller.load();
}

});


HelloEmber.AboutController = Em.ObjectController.extend({
    content: HelloEmber.GraphState.create(),
//	graph_data: [[["07-25-2013 05:00PM", 16371653], ["07-26-2013 05:00PM", 16428915]]],
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
	  var plot2 = $.jqplot('theegraph', jsonurl, options );
	
	}
	
});
