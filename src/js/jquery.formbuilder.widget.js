/*
 * Base widget plugin of JQuery Form Builder plugin, all Form Builder widgets should extend from this plugin. 
 * Refer to URL below on how to extend from existing plugin:
 * http://stackoverflow.com/questions/2050985/best-way-to-extend-a-jquery-plugin
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

(function($) {
	// plugin's private variables and functions
	var pluginName = 'fbWidget';
	// for logging to the firebug console, put in 1 line so it can easily remove for production
	function log($message) { if (window.console && window.console.log) window.console.log($message); };
	
	$.fn.fbWidget = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
		}
	};
	
	$.fn.fbWidget.name = pluginName;
	// Default options. Plugin user can override the default option externally
	// e.g. $.fn.fbWidget.options.firstOption = '1st option'	
	$.fn.fbWidget.options = {
		icon : 'iconClass',
		name : 'widgetName',
		text : 'Widget Text',
		groupedOptions : {
				optionA : 'default value',
				optionB : 100,
				optionC : true
		}			
	};

	var methods = {
		init : function(options) {
			// merge default options and passed in options (overwrite the default)
			var options = $.extend(true, {}, $.fn.fbWidget.options, options);
			
			log ('options.icon = ' + options.icon);
			log ('options.name = ' + options.name);
			log ('options.text = ' + options.text);
			log ('options.groupedOptions.optionA = ' + options.groupedOptions.optionA);
			return this.each(function() {

				var $this = $(this);
				$this.button()
				.css('width', '200px')
				.css('text-align', 'left')
				.click(methods.click);
				/*$(window).click('click.' + options.name, methods.click);
				var data = $this.data(pluginName);

				// If the plugin hasn't been initialized yet
				if (!data) {	
					// store the widget specific options
					$(this).data(pluginName, {
						target : $this,
						options : options
					});

				} */
				
			});
		},
		destroy : function() {

			return this.each(function() {

				var $this = $(this);
				/*var data = $this.data(pluginName);

				// Namespacing FTW
				$(window).unbind('.' + data.options.name);
				$this.removeData(pluginName); */
			})

		},
		click: function() {
			log('click run properly');
		},
		show : function() {
		},
		hide : function() {
		},
		update : function(content) {
		}
	};


})(jQuery);
