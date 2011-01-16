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
  // logging to the firebug's console, put in 1 line so it can be removed easily for production
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
  propertyName: function (value) {
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
		var counter = $this.getCounter($this);
		var languages = $this.options._languages;
		for (var i=0; i < languages.length; i++) {
			settings[languages[i]][$this.options._counterField] += ' ' + counter;
			$this._log(settings[languages[i]][$this.options._counterField]);
		}
		var $ctrlHolder = $('<div class="' + $this.options._styleClass + '"></div>');
		$this._log("b4. text = " + settings[$('#language').val()].text);
		var $widget = $this.getWidget($this, settings[$('#language').val()], $ctrlHolder);
		$this._log("at. text = " + settings[$('#language').val()].text);
		var name = $this.propertyName($this.options._type + counter);
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
		var settings = $.parseJSON(unescape($settings.val())); // settings is JavaScript encoded when return from server-side
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
		
		fieldSettings = $this.getFieldSettingsGeneralSection($this, $widget, settings[$language.val()]);
		$this._log('fieldSettings.length = ' + fieldSettings.length);
		var $generalSection = $(formbuilderOptions._fieldSettingsGeneralSection); 
		// remote all child nodes 
		$generalSection.children().remove();  	
		for (var i=0; i<fieldSettings.length; i++) {
			$this._log(fieldSettings[i].html());
		  $generalSection.append(fieldSettings[i]);
		}
		// activate field settings tab
		if (formbuilderOptions.readOnly) {	
			//var $fieldSettingsPanel = $(formbuilderOptions._fieldSettingsPanel);
		  $('input:not(div.buttons input)').attr("disabled", true);
		  $('select').attr("disabled", true);
		}
		$('#paletteTabs').tabs('select', 1);	
  	$.fb.fbWidget.prototype._log('_createFieldSettings executed.');
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
		.change(function(event) {
		  $widget.find("input[id$='fields[" + index + "].name']")
				     .val($(event.target).val()).change();
		});		
 		return $name;		 
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