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
var FbPlainText = $.extend({}, $.fb.fbWidget.prototype, {
  options: { // default options. values are stored in widget's prototype
	  type: 'PlainText',
	  name: 'Plain Text',
	  html: '<div class="ctrlHolder"><div class="PlainText"></div></div>',
		belongsTo: $.fb.formbuilder.prototype.options._fancyFieldsPanel,  	  
	  settings: {
		  en: {
		    text: 'Plain Text Value',
		    classes: ['leftAlign', 'topAlign']
		    },
			zh: {
				text: '無格式文字',
				classes: ['rightAlign', 'topAlign']
		    },		    
	    styles: {
	  	  fontFamily: 'default', // browser default
		    color: 'default',
		    backgroundColor: 'default'	    	
	        }
	    }
    },
	_create: function() {
	  $.fb.fbWidget.prototype._create.call(this); // call the superclass's _create function
	  // FbPlainText's construction code here
	  this._log('FbPlainText._create called. this.options.text = ' + this.options.settings.en.text);
    },
  _init: function() {
	  $.fb.fbWidget.prototype._init.call(this); // call the superclass's _init function
	  // FbPlainText's construction and re-initialization code here	
      this._log('FbPlainText._init called.');
    },        
	destroy: function() {
	  // FbPlainText's destroy code here
	  this._log('FbPlainText.destroy called.');
	  $.fb.fbWidget.prototype.destroy.call(this); // call the superclass's destroy function
    },
  createWidget: function(event) {
	  var $plainText = $(event.target).parent().data('fbPlainText'); // direct access to plugin instance
	  var size = $('div.' + $plainText.options.type).size() + 1;
	  var name = $plainText.propertyName($plainText.options.type + size);
		var language = $('#language').val();	  
	  var text = $plainText.options.settings[language].text + ' ' + size;
	  var $widget = $($plainText.options.html)
	              .addClass($plainText.options.settings[language].classes[1])
	              .attr('id', name).click($plainText.getFieldSettings);
	  // Clone an instance of plugin's option settings. 
	  // From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object 	  
	  var settings = jQuery.extend(true, {}, $plainText.options.settings);
	  settings[language].text = text;
	  $widget.find('div.PlainText').text(text).addClass(settings[language].classes[0]);
	  $plainText.createField(name, $widget, $plainText.options, settings);
    },
 getFieldSettings: function(event) { 
	 var $target = $(event.target);
	 var $plainTextElement = $target.attr('class').indexOf($.fb.fbWidget.prototype.options._styleClass) > -1 ? $target : $target.parent();
	 var formBuilderOptions = $.fb.formbuilder.prototype.options;
	 var index = $plainTextElement.attr('rel');
	 var $settings = $plainTextElement.find("input[id$='fields[" + index + "].settings']");
	 $.fb.fbWidget.prototype._log('settings = ' + $settings.val());
	 $.fb.fbWidget.prototype._log('unescaped settings = ' + unescape($settings.val()));
	 var settings = $.parseJSON(unescape($settings.val())); // settings is html encoded when return from server-side
	 
	 $.fb.fbWidget.prototype._log('PlainText.getFieldSettings. id = ' + $plainTextElement.attr('id') + ', ' + $plainTextElement.attr('rel'));	
	
	 var languageSectionSettings = '<div class="clear labelOnTop"> \
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
	var $languageSectionSettings = $(languageSectionSettings); 
	var $languageSection = $(formBuilderOptions._fieldSettingsLanguageSection);
	var $language = $('#language');
	var language = $language.val();
	$('legend', $languageSection).text('Language: ' + $language.find('option:selected').text());
	$.fb.fbWidget.prototype._log('language = ' + language + ", " + $language.find('option:selected').text());
	$languageSectionSettings.find('input#text')
													.val($plainTextElement.find('div.PlainText').text())
													.change(function(event) {
														var value = $(event.target).val();
														$plainTextElement.find('div.PlainText').text(value);
														settings[language].text = value;
														$settings.val($.toJSON(settings)).trigger('change');
													});
	$languageSectionSettings.find('select#horizontalAlignment')
													.val(settings[language].classes[0])
													.change(function(event) {
														var $text = $plainTextElement.find('div.PlainText');
														var value = $(event.target).val();
														$text.removeClass(settings[language].classes[0]).addClass(value);
														settings[language].classes[0] = value;
														$settings.val($.toJSON(settings)).trigger('change');
														// alert('$text.class = ' + $text.attr('class'));
														// alert('$settings.val() = ' + $settings.val());
													});					
	$languageSectionSettings.find('select#verticalAlignment')
													.val(settings[language].classes[1])
													.change(function(event) {
														var $text = $plainTextElement.find('div.PlainText');
														var value = $(event.target).val();
														$plainTextElement.removeClass(settings[language].classes[1]).addClass(value);
														settings[language].classes[1] = value;
														$settings.val($.toJSON(settings)).trigger('change');
														// alert('$text.class = ' + $text.attr('class'));
														// alert('$settings.val() = ' + $settings.val());
													});				

	
	
	// remote all child nodes
	$languageSection.children(':not(legend)').remove();  
	$languageSection.append($languageSectionSettings);
	
	
	// general section
	var generalSectionSettings = '<div class="2cols"> \
		<div class="labelOnTop col1 noPaddingBottom"> \
			<label for="name">Name (?)</label><br/> \
		  <input type="text" id="name" /> \
		</div> \
	</div>';
	var $generalSectionSettings = $(generalSectionSettings);
	$generalSectionSettings.find('input#name')
	                       .val($plainTextElement.find("input[id$='fields[" + index + "].name']").val())
												 .change(function(event) {
														$plainTextElement.find("input[id$='fields[" + index + "].name']").val($(event.target).val()).trigger('change');
													});		
	var $generalSection = $(formBuilderOptions._fieldSettingsGeneralSection); 
	// remote all child nodes 
	$generalSection.children().remove();  	
	$generalSection.append($generalSectionSettings);
	
	
	
	// activate field settings tab
	$('#paletteTabs').tabs('select', 1);
 }
    
});

$.widget('fb.fbPlainText', FbPlainText);
