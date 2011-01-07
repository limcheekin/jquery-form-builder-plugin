/*
 * JQuery Form Builder - Plain Text plugin.
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

// extends/inherits from superclass: FbWidget
var FbPlainText = $.extend({}, $.ui.fbWidget.prototype, {
  options: { // default options. values are stored in widget's prototype
	  type: 'plainText',
	  name: 'Plain Text',
	  fontType: 'none', // browser default
	  fontColor: 'none',
	  backgroundColor: 'none',
	  html: '<div class="ctrlHolder textHolder topAlign"></div>',
		belongsTo: $.ui.formbuilder.prototype.options.fancyFieldsPanel,  	  
	  settings: {
	    text: 'Plain Text Value',
	    horizontalAlignment: 'leftAlign',
	    verticalAlignment: 'topAlign'
	    }
    },
	_create: function() {
	  $.ui.fbWidget.prototype._create.call(this); // call the superclass's _create function
	  // FbPlainText's construction code here
	  this.log('FbPlainText._create called. this.options.text = ' + this.options.text);
    },
  _init: function() {
	  $.ui.fbWidget.prototype._init.call(this); // call the superclass's _init function
	  // FbPlainText's construction and re-initialization code here	
      this.log('FbPlainText._init called.');
    },        
	destroy: function() {
	  // FbPlainText's destroy code here
	  this.log('FbPlainText.destroy called.');
	  $.ui.fbWidget.prototype.destroy.call(this); // call the superclass's destroy function
    },
  createWidget: function(event) {
	  var name = $.ui.fbPlainText.prototype.getName();
	  var options = $.ui.fbPlainText.prototype.options;
	  var widget = $(options.html).addClass(options.type).attr('id', name).text(options.settings.text);
	  $.ui.fbWidget.prototype.createField.call(this, name, widget, options);
    },
  getName: function() {
	  var widgetType = $.ui.fbPlainText.prototype.options.type;
	  var size = $('div.' + widgetType).size() + 1;
	  var name = widgetType + size;
	  return name;
   }
});

$.widget('ui.fbPlainText', FbPlainText);
