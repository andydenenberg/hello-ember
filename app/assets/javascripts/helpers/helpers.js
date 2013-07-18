function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

Ember.Handlebars.registerBoundHelper("add", function(lvalue, rvalue) {
	if (lvalue != null && rvalue != null) { return numberWithCommas( (parseFloat(lvalue) + parseFloat(rvalue)).toFixed(2)) }
	else { return 0 }
});

Ember.Handlebars.registerBoundHelper("subtract", function(lvalue, rvalue) {
	if (lvalue != null && rvalue != null) { return numberWithCommas( (parseFloat(lvalue) - parseFloat(rvalue)).toFixed(2)) }
	else { return 0 }
});
	
Ember.Handlebars.registerBoundHelper("mult", function(lvalue, rvalue) {
	if (lvalue != null && rvalue != null) { return numberWithCommas( (parseFloat(lvalue) * parseFloat(rvalue)).toFixed(2)) }
	else { return 0 }
});

Ember.Handlebars.registerBoundHelper("mult_100", function(lvalue, rvalue) {
	if (lvalue != null && rvalue != null) { return numberWithCommas( (100 * parseFloat(lvalue) * parseFloat(rvalue)).toFixed(2)) }
	else { return 0 }
});

Ember.Handlebars.registerBoundHelper('decimal', function(number) {
  return numberWithCommas(Number(number).toFixed(2)) ;
});

Ember.Handlebars.registerBoundHelper('integer', function(number) {
  return numberWithCommas(Number(number).toFixed(0)) ;
});

Ember.Handlebars.registerBoundHelper('sort_arrow', function(value, options) {
		icon = '"icon-arrow-up"';
		label = 'descending' ;
		if ( value == false ) { label = 'ascending'; icon = '"icon-arrow-down"'; }
  return new Handlebars.SafeString( '<i class=' + icon + '></i>' );
});

Ember.Handlebars.registerBoundHelper('popover', function( latest_price ) {
	var test = latest_price ;
	return new Handlebars.SafeString( '<a href="#" id="example" class="popover-with-html" rel="popover" data-content="fagfdgadg" data-original-title="Twitter Bootstrap Popover">$' + test + '</a>' );
})

Handlebars.registerHelper('submitButton', function(text) {
  return new Handlebars.SafeString('<button type="submit" class="btn btn-primary">' + text + '</button>');
});

Handlebars.registerHelper('mailto', function(field) {
  var address = this.get(field);
  if (address) {
    return new Handlebars.SafeString('<a href="mailto: ' + address + '" />' + address + '</a>');
  }
});


