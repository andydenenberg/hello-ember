HelloEmber.GraphState = Em.Object.extend({
  series : [ [ 17880.06, 17987.48 ],
             [ 2205.23, 2208.63 ], [ 85176.53, 85507.03 ] ],
  options : {
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
                  show: true,
                  showTicks: true,
                  min: 1,
                  max: 10
                },
                yaxis: {
                  show: true,
                  showTicks: true,
                  min: 0
                  //max: 100000
                }
              },
              legend: {
                show: true
              },
              grid: {
                drawGridLines: true,
                shadow: false
              }
          }
});

/**************************
 * Views
 **************************/

HelloEmber.AboutView = Ember.View.extend({
  templateName: 'about',
  graphStateBinding: 'HelloEmber.AboutController.content',
//  plotObj: null,

didInsertElement : function() {
  var a = this.get('series');
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
	        this.content.get('series'),
	        this.content.get('options'));
	    plotObj.draw();

      }
});

