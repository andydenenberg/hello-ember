function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}
	
Ember.Handlebars.registerBoundHelper('decimal', function(contact) {
  return numberWithCommas(Number(contact).toFixed(2))
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

// {{colorize_route App.current_path}}
Ember.Handlebars.registerBoundHelper('colorize_route', function(value, options) {
	color = 'label-info' ;
	flag = '' ;
	if (value == 'contacts.contact') { 
		color = 'label-success';
	    flag = '<img src="assets/flash_flag.gif"></img>' 
	}
  var escaped = Handlebars.Utils.escapeExpression(value);
  return new Handlebars.SafeString('<span class="label ' + color + '">' + escaped + '</span>' + flag );
});

