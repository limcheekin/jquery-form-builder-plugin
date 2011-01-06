/*
 * JQuery UI Widget Plugin Template - Jump-start widget plugin development
 * This template was created by refer to the following resources:
 * 1) Understanding jQuery UI widgets: A tutorial - http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/
 * 
 * Usage: 
 * $(selector).className({option1: "Option of className"});
 * $(selector).extendedClassName({option1: "Option of extendedClassName"});
 * $(selector).className("method1", "123");
 * $(selector).extendedClassName("method1", "12345"); 
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

var NameSpace = {
	ClassName: {
		options: { // default options. values are stored in widget's prototype
      option1: "optionValue"		
        },
    _create: function() {
    	// called on construction
    	this.log('NameSpace.ClassName._create called. this.options.option1 = ' + this.options.option1);
        },
		_init: function() {
			// called on construction and re-initialization
			this.log('NameSpace.ClassName._init called.');
			this.method1('calling from NameSpace.ClassName._init');
		},        
		destroy: function() {
    	// called on removal
			this.log('NameSpace.ClassName.destroy called.');
        },
    // logging to the firebug's console, put in 1 line so it can be removed easily for production
    log: function($message) { if (window.console && window.console.log) window.console.log($message); },
		method1: function(params) {
    	// plugin specific method
			this.log('NameSpace.ClassName.method1 called. params = ' + params);
        }
	}
};

$.widget('ui.className', NameSpace.ClassName);

// extends/inherits from superclass: ClassName
var NameSpace = {
		ExtendedClassName: $.extend({}, $.ui.className.prototype, {
			options: { // default options. values are stored in widget's prototype
	      option1: "ExtendedClassName.optionValue"		
	        },
	    _create: function() {
	      $.ui.className.prototype._create.call(this); // call the superclass's _create function
	      // ExtendedClassName's construction code here
	      this.log('NameSpace.ExtendedClassName._create called. this.options.option1 = ' + this.options.option1);
	        },
			_init: function() {
			  $.ui.className.prototype._init.call(this); // call the superclass's _init function
			  // ExtendedClassName's construction and re-initialization code here	
			  this.log('NameSpace.ExtendedClassName._init called.');
			},        
			destroy: function() {
	    	// ExtendedClassName's destroy code here
				this.log('NameSpace.ExtendedClassName.destroy called.');
				$.ui.className.prototype.destroy.call(this); // call the superclass's destroy function
	        },
			method1: function(params) {
	    	// plugin specific method
				this.log('NameSpace.ExtendedClassName.method1 called. params = ' + params);
	        }
		})
};

$.widget('ui.extendedClassName', NameSpace.ExtendedClassName);