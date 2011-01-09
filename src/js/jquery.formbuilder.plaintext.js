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
	  type: 'PlainText',
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
	  var $plainTextHandle = $(event.target).parent().data('fbPlainText'); // direct access to plugin instance
	  var size = $('div.' + $plainTextHandle.options.type).size() + 1;
	  var name = $plainTextHandle.options.type + size;	  
	  
	  var widget = $($plainTextHandle.options.html).addClass($plainTextHandle.options.type).attr('id', name);
	  // TODO: remembered to remove it when user click on "delete this widget" button
	  // Clone an instance of plugin's option. From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object 
	  widget.data('options', jQuery.extend(true, {}, $plainTextHandle.options));  
	  var widgetOptions = widget.data('options');
	  widgetOptions.settings.text = widgetOptions.settings.text + ' ' + size;
	  widget.text(widgetOptions.settings.text).click($plainTextHandle.getFieldSettings);
	  $plainTextHandle.createField(name, widget, widgetOptions);
    },
 getFieldSettings: function(event) { 
	 var $plainTextElement = $(event.target);
	 $.ui.fbWidget.prototype.log('PlainText.getFieldSettings. id = ' + $plainTextElement.attr('id') + ', ' + $plainTextElement.attr('rel'));	
	 $.ui.fbWidget.prototype.log('settings = ' + $plainTextElement.find("input[id$='fields[" + $plainTextElement.attr('rel') + "].settings']").val());
	 var settings = $.parseJSON($plainTextElement.find("input[id$='fields[" + $plainTextElement.attr('rel') + "].settings']").val());
	 var languageSection = '<div class="clear labelOnTop"> \
		<label for="text">Text (?)</label><br /> \
		<input type="text" id="text" /> \
	</div> \
	<div class="2cols"> \
		<div class="labelOnTop col1 noPaddingBottom"> \
			<label for="horizontalAlignment">Horizontal Align (?)</label><br /> \
			<select id="horizontalAlignment"> \
				<option value="leftAlign">left</option> \
				<option value="centerAlign">center</option> \
				<option value="rightAlign">right</option> \
			</select> \
		</div> \
		<div class="labelOnTop col2"> \
		<label for="verticalAlignment">Vertical Align (?)</label><br /> \
			<select id="verticalAlignment"> \
				<option value="topAlign">top</option> \
				<option value="middleAlign">middle</option> \
				<option value="bottomAlign">bottom</option> \
			</select> \
	  </div> \
	</div>';
	 
	var $languageSection = $($.ui.formbuilder.prototype.options.fieldSettingsLanguageSection); 
	// remote all child nodes
	$languageSection.children().remove();  
	$languageSection.append(languageSection);
	$languageSection.find('input#text').val(settings.text);
	
	// general section
	var $generalSection = $($.ui.formbuilder.prototype.options.fieldSettingsGeneralSection); 
	// remote all child nodes 
	$generalSection.children().remove();  
	var generalSection = '<div class="2cols"> \
		<div class="labelOnTop col1 noPaddingBottom"> \
			<label for="name">Name (?)</label><br/> \
		  <input type="text" id="name" /> \
		</div> \
	</div>';
	$generalSection.append(generalSection);
	
	
	
	// activate field settings tab
	$('#paletteTabs').tabs('select', 1);
 }
    
});

$.widget('ui.fbPlainText', FbPlainText);
