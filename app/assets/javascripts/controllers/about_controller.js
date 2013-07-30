HelloEmber.GraphState = Em.Object.extend({
series1 : [ [['2008-06-30 8:00AM',4], ['2008-7-30 8:00AM',6.5], ['2008-8-30 8:00AM',5.7],
            ['2008-9-30 8:00AM',9], ['2008-10-30 8:00AM',8.2]],
  		 [['2008-06-30 8:00AM',4], ['2008-7-30 8:00AM',6.5], ['2008-8-30 8:00AM',8],
  		  ['2008-9-30 8:00AM',9], ['2008-10-30 8:00AM',8.2]] ],


series2 : [[["07-26-2013 05:00PM", "17880.06"], ["07-26-2013 05:00PM", "17987.48"], ["07-29-2013 05:00PM", "17963.31"], ["07-30-2013 05:00PM", "17845.15"]], [["07-26-2013 05:00PM", "2205.23"], ["07-26-2013 05:00PM", "2208.63"], ["07-29-2013 05:00PM", "2181.44"], ["07-30-2013 05:00PM", "2190.78"]], [["07-26-2013 05:00PM", "85176.53"], ["07-26-2013 05:00PM", "85507.03"], ["07-29-2013 05:00PM", "85564.53"], ["07-30-2013 05:00PM", "87188.53"]], [["07-26-2013 05:00PM", "5770249.14"], ["07-26-2013 05:00PM", "5790604.34"], ["07-29-2013 05:00PM", "5769310.64"], ["07-30-2013 05:00PM", "5778255.02"]], [["07-26-2013 05:00PM", "2570602.62"], ["07-26-2013 05:00PM", "2581167.34"], ["07-29-2013 05:00PM", "2579978.44"], ["07-30-2013 05:00PM", "2582223.61"]], [["07-26-2013 05:00PM", "2902009.0"], ["07-26-2013 05:00PM", "2911408.42"], ["07-29-2013 05:00PM", "2909904.94"], ["07-30-2013 05:00PM", "2913859.51"]], [["07-26-2013 05:00PM", "2773261.95"], ["07-26-2013 05:00PM", "2777180.12"], ["07-29-2013 05:00PM", "2777103.64"], ["07-30-2013 05:00PM", "2792899.0"]], [["07-26-2013 05:00PM", "1881528.34"], ["07-26-2013 05:00PM", "1894111.21"], ["07-29-2013 05:00PM", "1891455.23"], ["07-30-2013 05:00PM", "1900992.23"]], [["07-26-2013 05:00PM", "368741.0"], ["07-26-2013 05:00PM", "368741.0"], ["07-29-2013 05:00PM", "368741.0"], ["07-30-2013 05:00PM", "368741.0"]], [["07-29-2013 05:00PM", "125667.79"], ["07-30-2013 05:00PM", "125527.79"]]]

});


/**************************
 * Views
 **************************/

HelloEmber.AboutView = Ember.View.extend({
  templateName: 'about',
  graphStateBinding: 'HelloEmber.AboutController.content',
//  plotObj: null,

didInsertElement : function() {
//  var a = this.get('series');
  this.controller.load();
//  var plotObj = $.jqplot('theegraph',
//      this.get('series'),
//      this.get('options'));
//  plotObj.draw();
}

});

/**************************
 * Controllers
 **************************/

HelloEmber.AboutController = Em.ObjectController.extend({
    content: HelloEmber.GraphState.create(),
    load: function() {
	    var plotObj = $.jqplot('theegraph',
	        this.content.get('series2'),
	        {
			              title: {
			                text: 'The Graph',
			                show: true,
			                fontSize: 12,
			                textAlign: 'center'
			              },
			              seriesDefaults: {
			                lineWidth: 1.5,
			                showMarker: false,
			                shadow: false
			              },
			              axes: {
			                xaxis: {
							  renderer:$.jqplot.DateAxisRenderer,
							  tickOptions:{formatString:'%b %#d, %y'},
							  min:'Jul 26, 2013', 
							  tickInterval:'1 day'
			                },
			                yaxis: {
			                  show: true,
			                  showTicks: true,
			                  min: 0,
			                  max: 6000000,
			                }
			              },
				        legend:{
				            show:true, 
				            location: 'e',
				       //     labels: legendLabels,
				            rendererOptions:{numberRows: 1, placement: "outside"}
				        },
			              grid: {
			                drawGridLines: true,
			                shadow: false
			              }
			          }
	        );
	    plotObj.draw();

      }
});

