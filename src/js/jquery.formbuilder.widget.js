/*
 * Base widget plugin of JQuery Form Builder plugin, all Form Builder widgets should extend from this plugin. 
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 16-Jan-2011
 */

var FbWidget = {
  options: { // default options. values are stored in widget's prototype
	  _styleClass: "ctrlHolder"
    },
  // logging to the firebug's console, put in 1 line so it can be removed
	// easily for production
  _log: function($message) { if (window.console && window.console.log) window.console.log($message); },
	_create: function() {
	  this._log('FbWidget._create called.');
    },
  _init: function() {
    this._log('FbWidget._init called.');
    this.element.click(this._createFbWidget);
    },        
	destroy: function() {
	  this._log('FbWidget.destroy called.');
	  this.element.button('destroy');

	  // call the base destroy function.
		$.Widget.prototype.destroy.call(this);

    },
  _getFbOptions: function() {
	  return $($.fb.formbuilder.prototype.options._id).formbuilder('option');  
  },
  _createField: function(name, widget, options, settings) {
	  var formBuilderOptions = $.fb.formbuilder.prototype.options;
	  var index = $('#builderForm div.ctrlHolder').size();
	  
	  $('<a class="ui-corner-all closeButton" href="#"><span class="ui-icon ui-icon-close">delete this widget</span></a>')
	  .prependTo(widget).click($.fb.fbWidget.prototype._deleteWidget);
	  widget.attr('rel', index);
	  widget.append($.fb.fbWidget.prototype._createFieldProperties(name, options, settings, index));
	  
	  $(formBuilderOptions._emptyBuilderPanel + ':visible').hide();
	  $(formBuilderOptions._builderForm).append(widget).sortable('refresh');
    }, 
  _propertyName: function (value) {
  	var propertyName;
  	propertyName = value.replace(/ /gi,'');
  	propertyName = propertyName.charAt(0).toLowerCase() + propertyName.substring(1);
  	return propertyName;
  	},    
  _deleteWidget: function(event) {
	   var $widget = $(event.target).parent().parent();
	   var index = $widget.attr('rel');
	   // new record that not stored in database
     if ($widget.find("input[id$='fields[" + index + "].id']").val() == 'null') { 
    	 $widget.remove();
     } else {
  	   $widget.find("input[id$='fields[" + index + "].status']").val('D');
	     $widget.hide();    	 
     }
     var $ctrlHolders = $('.' + $.fb.fbWidget.prototype.options._styleClass + ':visible');
     if ($ctrlHolders.size() == 0) {
    	 $($.fb.formbuilder.prototype.options._emptyBuilderPanel).show();
     }
     event.stopPropagation();
  },
	_createFieldProperties: function(name, options, settings, index) {
		// alert('name = ' + name + ', options._type = '+ options._type);
		var fieldId = 'fields[' + index + '].';
		var $fieldProperties = $('<div class="fieldProperties"> \
		<input type="hidden" id="' + fieldId + 'id" name="' + fieldId + 'id" value="null" /> \
		<input type="hidden" id="' + fieldId + 'name" name="' + fieldId + 'name" value="' + name + '" /> \
		<input type="hidden" id="' + fieldId + 'type" name="' + fieldId + 'type" value="' + options._type + '" /> \
		<input type="hidden" id="' + fieldId + 'settings" name="' + fieldId + 'settings" /> \
		<input type="hidden" id="' + fieldId + 'sequence" name="' + fieldId + 'sequence" value="' + index + '" /> \
		<input type="hidden" id="' + fieldId + 'status" name="' + fieldId + 'status" /> \
		</div>');
		$fieldProperties.find("input[id$='" + fieldId + "settings']").val($.toJSON(settings));
		return $fieldProperties;
    },        
  _updateStatus: function(event) {
	  $widget = $(event.target);
	  $.fb.fbWidget.prototype._log($widget.attr('id') + " updated");
	  if ($widget.parent().find('input:first').val() != 'null') {
		  $.fb.fbWidget.prototype._log("field status updated");
	    $widget.parent().find('input:last').val('U');
	    }
  },
	_createFbWidget: function(event) {
		$.fb.fbWidget.prototype._log('_createFbWidget executing');
	  var type = 'fb' + $(this)['fbWidget']('option', '_type');
	  $.fb.fbWidget.prototype._log('type = ' + type);		
		var $this = $(this).data(type);
		// Clone an instance of plugin's option settings.
		// From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
		var settings = jQuery.extend(true, {}, $this.options.settings);
		var counter = $this._getCounter($this);
		var languages = $this.options._languages;
		for (var i=0; i < languages.length; i++) {
			settings[languages[i]][$this.options._counterField] += ' ' + counter;
			$this._log(settings[languages[i]][$this.options._counterField]);
		}
		var $ctrlHolder = $('<div class="' + $this.options._styleClass + '"></div>');
		$this._log("b4. text = " + settings[$('#language').val()].text);
		var $widget = $this.getWidget($this, settings[$('#language').val()], $ctrlHolder);
		$this._log("at. text = " + settings[$('#language').val()].text);
		var name = $this._propertyName($this.options._type + counter);
		$widget.click($this._createFieldSettings);
		$ctrlHolder.append($widget);
		$this._createField(name, $ctrlHolder, $this.options, settings);		
		$this._log('_createFbWidget executed');
    },
  _createFieldSettings: function(event) { 
	  $.fb.fbWidget.prototype._log('_createFieldSettings executing.');
		var $widget = $(this);	  
		$widget = $widget.attr('class').indexOf($.fb.fbWidget.prototype.options._styleClass) > -1 ? $widget : $widget.parent();
		var type = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].type']").val();
		$.fb.fbWidget.prototype._log('type = ' + type);
		$this = $('#' + type).data('fb' + type);
		var formbuilderOptions = $this._getFbOptions();
		$this._log('$widget.text() = ' + $widget.text() + ", formbuilderOptions.readOnly = " + formbuilderOptions.readOnly);
		var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
		$this._log('settings = ' + $settings.val());
		$this._log('unescaped settings = ' + unescape($settings.val()));
		// settings is JavaScript encoded when return from server-side
		$widget.data('fbWidget', $.parseJSON(unescape($settings.val())));
		var settings = $widget.data('fbWidget'); 
		var $languageSection = $(formbuilderOptions._fieldSettingsLanguageSection);
		var $language = $('#language');
		$('legend', $languageSection).text('Language: ' + $language.find('option:selected').text());		 		
		var fieldSettings = $this.getFieldSettingsLanguageSection($this, $widget, settings[$language.val()]);
		// remote all child nodes except legend
		$languageSection.children(':not(legend)').remove();  
		for (var i=0; i<fieldSettings.length; i++) {
			$languageSection.append(fieldSettings[i]);
		} 
		
		fieldSettings = $this.getFieldSettingsGeneralSection($this, $widget, settings);
		$this._log('fieldSettings.length = ' + fieldSettings.length);
		var $generalSection = $(formbuilderOptions._fieldSettingsGeneralSection); 
		// remote all child nodes
		$generalSection.children().remove();  	
		for (var i=0; i<fieldSettings.length; i++) {
			$this._log(fieldSettings[i].html());
		  $generalSection.append(fieldSettings[i]);
		}
		
		if (formbuilderOptions.readOnly) {
		  var $fieldSettingsPanel = $(formbuilderOptions._fieldSettingsPanel);
		  $('input', $fieldSettingsPanel).attr("disabled", true);
		  $('select', $fieldSettingsPanel).attr("disabled", true);
		  $('textarea', $fieldSettingsPanel).attr("disabled", true);
		}
		
		// activate field settings tab
		$('#paletteTabs').tabs('select', 1);	
  	$.fb.fbWidget.prototype._log('_createFieldSettings executed.');
    },
	_getCounter: function($this) {
		  var $ctrlHolders = $('.' + $this.options._styleClass + ':visible');
		  var counter = 1;
		  if ($ctrlHolders.size() > 0) {
		    	var $ctrlHolder, index, name, widgetCounter = 0;
		    	var propertyName = $this._propertyName($this.options._type);
					$ctrlHolders.each(function(i) {
					    $ctrlHolder = $(this);
					    index = $ctrlHolder.attr('rel');
					    name = $ctrlHolder.find("input[id$='fields[" + index + "].name']").val();
					    if (name.indexOf(propertyName) > -1) {
					    	widgetCounter = name.substring(propertyName.length) * 1;
					    	$this._log('widgetCounter = ' + widgetCounter);
					    	if (widgetCounter > counter) {
					    		counter = widgetCounter;
					    	}
					    }
					});
					if (widgetCounter > 0) counter++;
		     }
		  $this._log('counter = ' + counter);
		  return counter;
	},    
  _updateSettings: function($widget) {
	  var settings = $widget.data('fbWidget');
	  this._log('_updateSettings: \n' + $.toJSON(settings));
  	var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
  	$settings.val($.toJSON(settings)).change();
   	} ,          
  twoColumns: function($e1, $e2) {
	  var $ui = $('<div class="2cols"> \
		<div class="labelOnTop col1 noPaddingBottom"></div> \
	  <div class="labelOnTop col2"></div> \
    </div>');
	  $ui.find(".col1").append($e1);
	  $ui.find(".col2").append($e2);
	  return $ui;
 	} ,      
  oneColumn: function($e) {
	  return $('<div class="clear labelOnTop"></div>').append($e);
 	} ,    	
 	horizontalAlignment: function(name, value) {
 		var $horizontalAlignment = $('<div> \
 		<label for="' + name + '">Horizontal Align (?)</label><br /> \
		<select> \
			<option value="leftAlign">left</option> \
			<option value="centerAlign">center</option> \
			<option value="rightAlign">right</option> \
		</select></div>');
		$('select', $horizontalAlignment).val(value).attr('id', name);	
		return $horizontalAlignment;
 	},
 	verticalAlignment: function(options) {
 		var o = $.extend({}, options);
 		o.label = o.label ? o.label : 'Vertical Align'; 
 		var $verticalAlignment = $('<div> \
 			<label for="' + o.name + '">' + o.label + ' (?)</label><br /> \
			<select> \
				<option value="topAlign">top</option> \
				<option value="middleAlign">middle</option> \
				<option value="bottomAlign">bottom</option> \
			</select></div>');
		$('select', $verticalAlignment).val(o.value).attr('id', o.name);	
		return $verticalAlignment;			
 	},
 	name: function($widget) {
 		var index = $widget.attr('rel');
 		var $name = $('<label for="field.name">Name (?)</label><br/> \
 				  <input type="text" id="field.name" />');
		$("input[id$='field.name']", $name)
		.val($widget.find("input[id$='fields[" + index + "].name']").val())
		.keyup(function(event) {
		  $widget.find("input[id$='fields[" + index + "].name']")
				     .val($(event.target).val()).change();
		});		
 		return $name;		 
 	}, 	
 	colorPicker: function(label, name, value, help, type) {
		var $colorPicker = $('<div></div>');
 		if (!type || type == 'basic') {
			$colorPicker.colorPicker({
				name: name,
				value: value,
				ico: '../images/jquery.colourPicker.gif',
			  title: 'Basic Colors'
			});		
		} else {
			$colorPicker.colorPicker({
				name: name,
				value: value,
				ico: '../images/jquery.colourPicker.gif',				
			  title: 'Web Safe Colors',
			  type: 'webSafe',
			  width: 360
			});		
		}
 		$colorPicker.prepend('<label for="' + name + '">' + label + ' (?)</label><br/>');
	  return $colorPicker;
 	},
 	fontPicker: function(options) {
 		var o = $.extend({}, options);
 		this._log('fontPicker(' + $.toJSON(o) + ')');
 		o.value = o.value.replace(/'/gi, ''); // remove single quote for chrome browser
 		o.value = o.value.split(',', 1)[0]; // taking the 1st font type
 		o.value = o.value != 'default' ? o.value : this._getFbOptions().settings.styles.fontFamily;
 		
		var $fontPicker = $('<div><label for="' + o.name + '">Font (?)</label><br/> \
				<div class="fontPicker" rel="' + o.name + '"></div></div>'); 		

		$('.fontPicker', $fontPicker).fontPicker({ 
			name: o.name,
			defaultFont: o.value
		});
 		return $fontPicker;
 	},	
 	fontSize: function(label, name, value, help) {
 		this._log('fontSize(' + label + ', ' + name + ',' + value + ', ' + help + ')');
	 	var $fontSize = $('<div> \
	 		<label for="' + name + '">' + label + ' (?)</label>&nbsp; \
		  <select> \
		    <option value="9">9</option> \
		    <option value="10">10</option> \
		    <option value="11">11</option> \
		    <option value="12">12</option> \
		    <option value="13">13</option> \
		    <option value="14">14</option> \
		    <option value="15">15</option> \
		    <option value="16">16</option> \
		    <option value="17">17</option> \
		    <option value="18">18</option> \
		    <option value="20">20</option> \
		    <option value="22">22</option> \
		    <option value="24">24</option> \
		    <option value="28">28</option> \
		    <option value="32">32</option> \
		  </select></div>');		
		  var $select = $('select', $fontSize);
		  if (value == 'default') {
			  $select.val(this._getFbOptions().settings.styles.fontSize);
		  } else {
			  $select.val(value);
		  }
		  $select.attr('id', name);
		  return $fontSize;
   } ,	
  fontStyles: function(names, checked) {  
		var $fontStyles = $('<div> \
		  <span class="floatClearLeft"><input type="checkbox" id="' + names[0] + '" />&nbsp;Bold</span><br/> \
	    <span class="floatClearLeft"><input type="checkbox" id="' + names[1] + '" />&nbsp;Italic</span><br/> \
	    <span class="floatClearLeft"><input type="checkbox" id="' + names[2] + '" />&nbsp;Underline</span> \
	  </div>');
	  if (checked) {
	    for (var i = 0; i < checked.length; i++) {
	    	$("input[id$='" + names[i] + "']", $fontStyles).attr('checked', checked[i]);
	    }
	  }
	  return $fontStyles;
  },
  twoRowsOneRowLayout: function(row1col1, row2col1, row1col2) {
	  var $twoRowsOneRowLayout = $('<div class="fontPanel"> \
			    <div class="fontPickerContainer"> \
			      <div class="fontSize"> \
			      </div> \
			    </div> \
			    <div class="fontStyles"> \
			    </div> \
			  </div>');
		$('.fontPickerContainer',$twoRowsOneRowLayout).prepend(row1col1);
		$('.fontSize',$twoRowsOneRowLayout).append(row2col1);
		$('.fontStyles',$twoRowsOneRowLayout).append(row1col2);			    
		return $twoRowsOneRowLayout;	    
  },
  fieldset: function(legend) {
	  return $('<fieldset><legend>' + legend + '</legend></fieldset>');
  },
  fontPanel:function(fontPickerValue, fontSizeValue, fontStylesChecked, idPrefix) { 
	  idPrefix = idPrefix ? idPrefix : '';
	  var names = [idPrefix + 'bold', idPrefix + 'italic', idPrefix + 'underline'];
	  return this.fieldset('Fonts').append(this.twoRowsOneRowLayout(
			  this.fontPicker({ name: idPrefix + 'fontFamily', value: fontPickerValue }),
			  this.fontSize('Size', idPrefix + 'fontSize', fontSizeValue),
			  this.fontStyles(names, fontStylesChecked)
			  ));
  },
  colorPanel: function(textColorValue, backgroundColorValue, idPrefix) {
	  idPrefix = idPrefix ? idPrefix : '';
	  if (textColorValue == 'default') {
		  textColorValue = this._getFbOptions().settings.styles.color;
	    } 	  
	  if (backgroundColorValue == 'default') {
		  backgroundColorValue = this._getFbOptions().settings.styles.backgroundColor;
	    } 	 
	  this._log('textColorValue = ' + textColorValue + ', backgroundColorValue = ' + backgroundColorValue);
	  var $colorPanel = this.fieldset('Colors').append(this.twoColumns(this.colorPicker('Text', idPrefix + 'color', textColorValue),
			  this.colorPicker('Background', idPrefix + 'backgroundColor', backgroundColorValue)));
	  $colorPanel.find('.2cols .col2').addClass('noPaddingBottom');
	  return $colorPanel;
  },
  getWidget: function($this, settings, $ctrlHolder) {
  	 $.fb.fbWidget.prototype._log('getWidget($this, settings, ctrlHolder) should be overriden by subclass.');
   },
  getFieldSettingsLanguageSection: function($this, $widget, settings) {
	   $.fb.fbWidget.prototype._log('getFieldSettingsLanguageSection($this, $widget, settings) should be overriden by subclass.');
	},
	getFieldSettingsGeneralSection: function($this, $widget, settings) {
	   $.fb.fbWidget.prototype._log('getFieldSettingsLanguageSection($this, $widget, settings) should be overriden by subclass.');
	}    	
};

$.widget('fb.fbWidget', FbWidget);