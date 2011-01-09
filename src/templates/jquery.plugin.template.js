/*
 * JQuery Plugin Template - Jump-start plugin development
 * This template was created by refer to the following resources:
 * 1) Plugins/Authoring - http://docs.jquery.com/Plugins/Authoring
 * 2) A Plugin Development Pattern - http://www.learningjquery.com/2007/10/a-plugin-development-pattern
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
	var pluginName = 'pluginName';
	// logging to the firebug's console, put in 1 line so it can easily remove for production
	function log($message) { if (window.console && window.console.log) window.console.log($message); };

	$.fn.pluginName.name = pluginName;
	// Default options. Plugin user can override the default option externally
	// e.g. $.fn.pluginName.options.firstOption = '1st option'	
	$.fn.pluginName.options = {
		firstOption : 'default value',
		anotherOption : 'default value',
		groupedOptions : {
			optionA : 'default value',
			optionB : 100,
			optionC : true
		}
	};

	var methods = {
		init : function(passedInOptions) {
			return this.each(function() {
				// merge default options and passed in options (overwrite the default)
				var options = $.extend(true, {}, $.fn.pluginName.options, passedInOptions);
				var $this = $(this);
				var data = $this.data(pluginName);
				var tooltip = $('<div />', {
					text : $this.attr('title')
				});

				// If the plugin hasn't been initialized yet
				if (!data) {

					/*
					 * Do more setup stuff here
					 */

					$(this).data(pluginName, {
						target : $this,
						tooltip : tooltip
					});

				}
				
				// event binding
				$(window).bind('resize.' + pluginName, methods.reposition);
				
			});
		},
		destroy : function() {

			return this.each(function() {

				var $this = $(this);
				var data = $this.data(pluginName);

				// Namespacing FTW
				$(window).unbind('.tooltip');
				data.tooltip.remove();
				$this.removeData(pluginName);
			});

		},
		reposition : function() {
		},
		show : function() {
		},
		hide : function() {
		},
		update : function(content) {
		}
	};

	$.fn.pluginName = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
		}
	};
})(jQuery);
