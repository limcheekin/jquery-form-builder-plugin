/*
 * JQuery UI Widget Plugin Template - Jump-start widget plugin development
 * This template was created by refer to the following resources:
 * 1) Understanding jQuery UI widgets: A tutorial - http://bililite.com/blog/understanding-jquery-ui-widgets-a-tutorial/
 * 
 * Usage: 
 * 1) Add tag below to your <body> tag:
 * <div id="test">This is Testing Div.</div>
 * 2) Add the following JavaScript to your <script> tag: 
 * $(function(){
 *	 $('#test').className({publicOption: "Option of className"});
 *	 $('#test').extendedClassName({publicOption: "Option of extendedClassName"});
 *	 $('#test').className("method1", "123");
 *	 $('#test').extendedClassName("method1", "12345");
 *  });
 * 3) This template is ready to run.
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 16-Jan-2011
 */

var NameSpace = {
	ClassName : {
		options : { // default options. values are stored in widget's prototype
			publicOption : "public option value",
			_privateOption : "private option value",
			publicOptions : {
				option1 : "option1"
			}
		},
		_create : function() {
			// called on construction
			this._log('NameSpace.ClassName._create called. this.options.publicOption = ' + this.options.publicOption);
		},
		_init : function() {
			// called on construction and re-initialization
			this._log('NameSpace.ClassName._init called. this.id = ' + this.element.attr('id'));
			this.method1('calling from NameSpace.ClassName._init');
			this.element.click(this._clickHandler);
		},
		_clickHandler : function(event) {
			$.ns.className.prototype._log('before subclassClickHandler(event)');
			var type = $(this)['className']('option', 'type');
			$(this).data(type).subclassClickHandler(event); // Alternative: $(this)[type]('subclassClickHandler', event);
			$.ns.className.prototype._log('after subclassClickHandler(event)');
		},
		destroy : function() {
			// called on removal
			this._log('NameSpace.ClassName.destroy called.');

			// From: http://blog.nemikor.com/2010/05/15/building-stateful-jquery-plugins/
			// call the base destroy function.
			$.Widget.prototype.destroy.call(this);
		},
		// logging to the firebug's console, put in 1 line so it can be removed
		// easily for production
		_log : function($message) { if (window.console && window.console.log) window.console.log($message);},
		method1 : function(params) {
			// plugin specific method
			this._log('NameSpace.ClassName.method1 called. params = ' + params);
		},
		subclassClickHandler : function(event) {
			$.ns.className.prototype._log('subclassClickHandler(event) should be overriden by subclass. event = ' + event.type);
		}
	}
};

$.widget('ns.className', NameSpace.ClassName); // ns: namespace, don't use "ui" as it was reserved by JQuery UI

// extends/inherits from superclass: ClassName
var NameSpace = {
	ExtendedClassName : $.extend({}, $.ns.className.prototype, {
		options : { // default options. values are stored in
					// widget's prototype
			type : "extendedClassName",
			publicOption : "public option value",
			_privateOption : "private option value"
		},
		_create : function() {
			$.ns.className.prototype._create.call(this); // call the superclass's _create function
			// ExtendedClassName's construction code here
			this._log('NameSpace.ExtendedClassName._create called. this.options.publicOption = ' + this.options.publicOption);
		},
		_init : function() {
			$.ns.className.prototype._init.call(this); // call the superclass's _init function
			// ExtendedClassName's construction and
			// re-initialization code here
			this.options = $.extend({}, $.ns.className.prototype.options, this.options);
			this._log('NameSpace.ExtendedClassName._init called. this.options.publicOptions.option1 = ' + this.options.publicOptions.option1);
		},
		destroy : function() {
			// ExtendedClassName's destroy code here
			this._log('NameSpace.ExtendedClassName.destroy called.');
			$.ns.className.prototype.destroy.call(this); // call the superclass's destroy function
		},
		method1 : function(params) {
			// plugin specific method
			this._log('NameSpace.ExtendedClassName.method1 called. params = ' + params);
		},
		subclassClickHandler : function(event) {
			$.ns.className.prototype._log("text = " + this.element.text() + ", event.type = " + event.type);
		}
	})
};

$.widget('ns.extendedClassName', NameSpace.ExtendedClassName); // ns: namespace, don't use "ui" as it was reserved by JQuery UI
