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
	  settings: {
	    text: 'Plain Text Value',
	    horizontalAlignment: 'left',
	    verticalAlignment: 'top'
	    },
	  html: '<div class="ctrlHolder textHolder top"></div>',
		belongsTo: $.fn.formbuilder.options.fancyFieldsPanel  
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
	  var options = $.ui.fbPlainText.prototype.options;
	  var size = $('.' + options.type).size() + 1;
	  var id = options.type + size;
	  $(options.html).addClass(options.type).attr('id', id)
	  .append('<input id="' + id + '.settings" type="hidden" value="' 
			  + $.toJSON(options.settings) + '" />');
    }
});

$.widget('ui.fbPlainText', FbPlainText);
