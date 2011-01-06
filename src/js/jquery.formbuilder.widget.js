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
//inherits from ui.button
var FbWidget = {
  options: { // default options. values are stored in widget's prototype
	  option1: "FbWidget.optionValue"		
    },
  // logging to the firebug's console, put in 1 line so it can be removed easily for production
  log: function($message) { if (window.console && window.console.log) window.console.log($message); },
	_create: function() {
	  this.log('FbWidget._create called. this.options.option1 = ' + this.options.option1);
	  this.element.click(this.createWidget);
    },
  _init: function() {
    this.log('FbWidget._init called.');
    },        
	destroy: function() {
	  this.log('FbWidget.destroy called.');
	  this.element.button('destroy');
    },
	createWidget: function(event) { // to be override by subclass
		alert('FbWidget.createWidget called. Plugin inherited from this plugin required to implement createWidget. \n' + 
				  'event.type = ' + event.type + ', event.target.id = ' + $(event.target).parent().attr('id'));
    }
};

$.widget('ui.fbWidget', FbWidget);
