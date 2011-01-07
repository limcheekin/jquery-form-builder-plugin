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
  createField: function(name, widget, options) {
	  var formBuilderOptions = $.ui.formbuilder.prototype.options;
	  widget.append($.ui.fbWidget.prototype._createFieldProperties.call(this, name, options));
	  $(formBuilderOptions.emptyBuilderPanel).hide();
	  $(formBuilderOptions.builderForm).append(widget);
    },    
	_createFieldProperties: function(name, options) {
		// alert('name = ' + name + ', options.type = '+ options.type);
		var index = $('div.fieldProperties').size();
		return '<div class="fieldProperties"> \
		<input type="hidden" id="fields[' + index + '].name" name="fields[' + index + '].name" value="' + name + '" /> \
		<input type="hidden" id="fields[' + index + '].type" name="fields[' + index + '].type" value="' + options.type + '" /> \
		<input type="hidden" id="fields[' + index + '].settings" name="fields[' + index + '].settings" value="' + $.toJSON(options.settings) + '" /> \
		<input type="hidden" id="fields[' + index + '].sequence" name="fields[' + index + '].sequence" value="' + index + '" /> \
		</div>';
    },        
	createWidget: function(event) { alert('createWidget(event) should be overriden by subclass'); }
};

$.widget('ui.fbWidget', FbWidget);
