/*
 * Base widget plugin of JQuery Form Builder plugin, all Form Builder widgets should extend from this plugin. 
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

var FbWidget = {
  options: { // default options. values are stored in widget's prototype
	  option1: "FbWidget.optionValue"		
    },
  // _logging to the firebug's console, put in 1 line so it can be removed easily for production
  _log: function($message) { if (window.console && window.console.log) window.console.log($message); },
	_create: function() {
	  this._log('FbWidget._create called. this.options.option1 = ' + this.options.option1);
	  this.element.click(this.createWidget);
    },
  _init: function() {
    this._log('FbWidget._init called.');
    },        
	destroy: function() {
	  this._log('FbWidget.destroy called.');
	  this.element.button('destroy');

	  // call the base destroy function.
		$.Widget.prototype.destroy.call(this);

    },
  createField: function(name, widget, options, settings) {
	  var formBuilderOptions = $.fb.formbuilder.prototype.options;
	  var index = $('#builderForm div.ctrlHolder').size();
	  
	  $('<a class="ui-corner-all closeButton" href="#"><span class="ui-icon ui-icon-close">delete this widget</span></a>')
	  .prependTo(widget).click(function(event) {
		   var $widget = $(event.target).parent().parent();
		   var index = $widget.attr('rel');
		   var $ctrlHolders = $('#builderForm div.ctrlHolder');
		   var size = $ctrlHolders.size();
		   var i, $sequence;
		   $widget.find("input[id$='fields[" + index + "].name']").val('#DEL');
		   $widget.hide();
		   // TODO: i should start from index + 1, but surprisingly it doesn't work properly
		   // optimizing needed
		   for (i = index; i < size; i++) {
			   $sequence = $ctrlHolders.find("input[id$='fields[" + i + "].sequence']");
			   // alert('$sequence['+i+'].val() = ' + $sequence.val());
			   $sequence.val($sequence.val() - 1);
		   }
	    });
	  widget.attr('rel', index);
	  widget.append($.fb.fbWidget.prototype._createFieldProperties(name, options, index));
	  widget.find("input[id$='fields[" + index + "].settings']").val($.toJSON(settings));
	  $(formBuilderOptions._emptyBuilderPanel + ':visible').hide();
	  $(formBuilderOptions._builderForm).append(widget).sortable('refresh');
    }, 
  propertyName: function (value) {
  	var propertyName;
  	propertyName = value.replace(/ /gi,'');
  	propertyName = propertyName.charAt(0).toLowerCase() + propertyName.substring(1);
  	return propertyName;
  	},    
	_createFieldProperties: function(name, options, index) {
		// alert('name = ' + name + ', options.type = '+ options.type);
		return '<div class="fieldProperties"> \
		<input type="hidden" id="fields[' + index + '].name" name="fields[' + index + '].name" value="' + name + '" /> \
		<input type="hidden" id="fields[' + index + '].type" name="fields[' + index + '].type" value="' + options.type + '" /> \
		<input type="hidden" id="fields[' + index + '].settings" name="fields[' + index + '].settings" /> \
		<input type="hidden" id="fields[' + index + '].sequence" name="fields[' + index + '].sequence" value="' + index + '" /> \
		</div>';
    },        
	createWidget: function(event) { alert('createWidget(event) should be overriden by subclass'); }
};

$.widget('fb.fbWidget', FbWidget);
