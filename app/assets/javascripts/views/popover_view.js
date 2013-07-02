HelloEmber.PopoverView = Ember.View.extend({
            parentSelector: '',
            contentSelector: '',
            didInsertElement: function () {
                var self = this;
                $(self.parentSelector).popover({
                    html: true,
                    title: 'Latest Time',
                    placement: 'right',
                    content: function() {
                        var $content = $(self.contentSelector);
                        return $content.html();
                    }
                });
            },
            close: function() {
                $(this.parentSelector).popover('hide');
            }
        });
