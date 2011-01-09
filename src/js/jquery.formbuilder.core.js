/*
 * Main component of JQuery Form Builder plugin, the Form Builder container itself 
 * consists of builder palette contains widgets supported by the form builder and 
 * builder panel where the constructed form display. 
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

var FormBuilder = {
  options: { // default options. values are stored in widget's prototype
		widgets : ['PlainText'],
		builderForm: '#builderForm fieldset',
		emptyBuilderPanel: '#emptyBuilderPanel',
		standardFieldsPanel: '#standardFields',
		fancyFieldsPanel: '#fancyFields'
    },
  _create: function() {
    	// called on construction
    this.log('FormBuilder._create called. this.options.widgets = ' + this.options.widgets);
		// REF: http://www.webresourcesdepot.com/smart-floating-banners/
		$(window).scroll(
		function() {
			if ($(window).scrollTop() > $(".floatingPanelIdentifier").position({scroll : false}).top) {
				$(".floatingPanel").css("position", "fixed");
				$(".floatingPanel").css("top", "0");
			}
			
			if ($(window).scrollTop() <= $(".floatingPanelIdentifier").position({scroll : false}).top) {
				$(".floatingPanel").css("position", "relative");
				$(".floatingPanel").css("top",
						$(".floatingPanelIdentifier").position);
			}
		});
		
		$('#paletteTabs').tabs();
		var widgets = this.options.widgets;
		var length = widgets.length;
		var widgetOptions;
		var widget;
		var i;
	  for (i = 0; i < length; i++) {
		  widgetOptions = $['ui']['fb' + widgets[i]].prototype.options;
		  widget = $('<a href = "#" class="fbWidget">' + widgetOptions.name + '</a>')['fb' + widgetOptions.type]();
      widget.button().appendTo(widgetOptions.belongsTo);
	    }		
    },
	_init: function() {
			// called on construction and re-initialization
		this.log('FormBuilder._init called.');
		this.method1('calling from FormBuilder._init');
	},        
	destroy: function() {
        // called on removal
		this.log('FormBuilder.destroy called.');
    },
  // logging to the firebug's console, put in 1 line so it can be removed easily for production
  log: function($message) { if (window.console && window.console.log) window.console.log($message); },
	method1: function(params) {
    	// plugin specific method
		this.log('FormBuilder.method1 called. params = ' + params);
    }
};

$.widget('ui.formbuilder', FormBuilder);