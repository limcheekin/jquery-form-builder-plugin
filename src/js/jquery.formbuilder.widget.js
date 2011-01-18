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
	  fbOptions: "", // $.fb.formbuilder.prototype.options
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
		// From:
		// http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
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
		var formbuilderOptions = $this.options.fbOptions;
		$this._log('$widget.text() = ' + $widget.text() + ", formbuilderOptions.readOnly = " + formbuilderOptions.readOnly);
		var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
		$this._log('settings = ' + $settings.val());
		$this._log('unescaped settings = ' + unescape($settings.val()));
		// settings is JavaScript encoded when return from server-side
		var settings = $.parseJSON(unescape($settings.val())); 
		$widget.data('fbWidget', settings);
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
  updateSettings: function($widget, settings) {
  	var fullSettings = $widget.data('fbWidget');
  	var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
  	fullSettings[$('#language').val()] = settings;
  	$settings.val($.toJSON(fullSettings)).change();
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
 	horizontalAlignment: function() {
		return $('<label for="field.horizontalAlignment">Horizontal Align (?)</label><br /> \
		<select id="field.horizontalAlignment"> \
			<option value="leftAlign">left</option> \
			<option value="centerAlign">center</option> \
			<option value="rightAlign">right</option> \
		</select>');  		
 	},
 	verticalAlignment: function() {
 		return $('<label for="field.verticalAlignment">Vertical Align (?)</label><br /> \
			<select id="field.verticalAlignment"> \
				<option value="topAlign">top</option> \
				<option value="middleAlign">middle</option> \
				<option value="bottomAlign">bottom</option> \
			</select>');
 	},
 	name: function($widget) {
 		var index = $widget.attr('rel');
 		var $name = $('<label for="field.name">Name (?)</label><br/> \
 				  <input type="text" id="field.name" />');
		("input[id$='field.name']", $name)
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
 	fontPicker: function(name, value) {
 		this._log('fontPicker(' +name+ ',' +value+ ')');
		var $fontPicker = $('<div><label for="' + name + '">Font (?)</label><br/> \
				<div class="fontPicker"></div> \
				<input type="hidden" id="' + name + '" value="' + value + '" /></div>'); 		
		$fontFamily =  $('input', $fontPicker);
		this._log('$fontFamily.val() = ' + $fontFamily.val());
 		if ($fontFamily.val() == 'default') {
 			$fontFamily.val(this.options.fbOptions._fontFamily);
 			this._log('$fontFamily.val() = ' + $fontFamily.val());
 		}		
		$('.fontPicker', $fontPicker).fontPickerRegios({ 
			defaultFont: $fontFamily.val(),	
			callbackFunc: function(fontFamily) {
				$fontFamily.val(fontFamily).change();
			}
		});		
 		return $fontPicker;
 	},	
 	fontSize: function(label, name, value, help) {
 		this._log('fontSize(' + label + ', ' + name + ',' + value + ', ' + help + ')');
	 	var $fontSize = $('<div> \
	 		<label for="' + name + '">' + label + ' (?)</label>&nbsp; \
		  <select id="' + name + '"> \
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
		  if (value == 'default') {
			  $('select', $fontSize).val(this.options.fbOptions._fontSize);
		  } else {
			  $('select', $fontSize).val(value);
		  }
		  return $fontSize;
   } ,	
  fontStyles: function(names, checked) {  
		var $fontStyles = $('<div> \
		  <span class="floatClearLeft"><input type="checkbox" id="' + names[0] + '" value="bold" />&nbsp;Bold</span><br/> \
	    <span class="floatClearLeft"><input type="checkbox" id="' + names[1] + '" value="italic" />&nbsp;Italic</span><br/> \
	    <span class="floatClearLeft"><input type="checkbox" id="' + names[2] + '" value="underline" />&nbsp;Underline</span> \
	  </div>');
	  if (checked) {
	    for (var i = 0; i < checked.length; i++) {
	    	$("input[id$='" + names[checked[i]] + "']", $fontStyles).attr('checked', true);
	    }
	  }
	  return $fontStyles;
  },
  fontPanel:function(fontPickerValue, fontSizeValue, fontStylesChecked, idPrefix) {
	  var $fontPanel = $('<fieldset> \
			  <legend>Fonts</legend> \
			  <div class="fontPanel"> \
			    <div class="fontPickerContainer"> \
			      <div class="fontSize"> \
			      </div> \
			    </div> \
			    <div class="fontStyles"> \
			    </div> \
			  </div> \
			  </fieldset>');	 
	  idPrefix = idPrefix ? idPrefix : '';	  
		$('.fontPickerContainer',$fontPanel).prepend(this.fontPicker(idPrefix + 'fontFamily', fontPickerValue));
		$('.fontSize',$fontPanel).append(this.fontSize('Size', idPrefix + 'fontSize', fontSizeValue));
		var names = [idPrefix + 'bold', idPrefix + 'italic', idPrefix + 'underline'];
		$('.fontStyles',$fontPanel).append(this.fontStyles(names, fontStylesChecked));
		return $fontPanel;
  },
  colorPanel: function(textColorValue, backgroundColorValue, idPrefix) {
	  idPrefix = idPrefix ? idPrefix : '';	  
	  var $colorPanel = $('<fieldset><legend>Colors</legend></fieldset>');
	  if (textColorValue == 'default') {
		  textColorValue = this.options.fbOptions._color;
	    } 	  
	  if (backgroundColorValue == 'default') {
		  backgroundColorValue = this.options.fbOptions._backgroundColor;
	    } 	 
	  this._log('textColorValue = ' + textColorValue + ', backgroundColorValue = ' + backgroundColorValue);
	  $colorPanel.append(this.twoColumns(this.colorPicker('Text', idPrefix + 'color', textColorValue),
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