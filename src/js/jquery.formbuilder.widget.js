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
	  _styleClass: 'ctrlHolder',
	  _selectedClass: 'ctrlHolderSelected'
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
	  var fbOptions = $.fb.formbuilder.prototype.options;
	  var index = $('#builderForm div.ctrlHolder').size();
	  
	  $('<a class="ui-corner-all closeButton" href="#"><span class="ui-icon ui-icon-close">delete this widget</span></a>')
	  .prependTo(widget).click($.fb.fbWidget.prototype._deleteWidget)
	  .hover(function () { $('span', this).removeClass('ui-icon-close').addClass('ui-icon-circle-close'); }, 
			     function () { $('span', this).removeClass('ui-icon-circle-close').addClass('ui-icon-close'); });
	  widget.attr('rel', index);
	  widget.append($.fb.fbWidget.prototype._createFieldProperties(name, options, settings, index));
	  
	  $(fbOptions._emptyBuilderPanel + ':visible').hide();
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
	   var options = $.fb.fbWidget.prototype.options;
	   var fbOptions = $.fb.formbuilder.prototype.options;
  
	   // new record that not stored in database
     if ($widget.find("input[id$='fields[" + index + "].id']").val() == 'null') { 
    	 $widget.remove();
     } else {
  	   $widget.find("input[id$='fields[" + index + "].status']").val('D'); 	 
  	   $widget.hide();
     }
     var $ctrlHolders = $('.' + options._styleClass + ':visible');
     $.fb.fbWidget.prototype._log('_deleteWidget(). $ctrlHolders.size() = ' + $ctrlHolders.size());
     if ($widget.attr('class').indexOf(options._selectedClass) > -1) {
		   // activate Add Field tab
		   $(fbOptions._paletteTabs).tabs('select', 0);
     }
     if ($ctrlHolders.size() === 0) {
    	 $(fbOptions._emptyBuilderPanel).show();   	 
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
		$.fb.fbWidget.prototype._log('_createFbWidget executing. event.type = ' + event.type);
		// $.fb.fbWidget.prototype._log('$(this).options._type = ' + this.options._type);
		var $this;
		if (this.options) { // from draggable, event.type == 'mousedown'
			$this = this;
		} else { // from click event
			var type = 'fb' + $(this)['fbWidget']('option', '_type');
			$.fb.fbWidget.prototype._log('type = ' + type);		
			$this = $(this).data(type);
		}
		// Clone an instance of plugin's option settings.
		// From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
		var settings = jQuery.extend(true, {}, $this.options.settings); 
		var counter = $this._getCounter($this);
		var languages = $this.options._languages;
		for (var i=0; i < languages.length; i++) {
			settings[languages[i]][$this.options._counterField] += ' ' + counter;
			$this._log(settings[languages[i]][$this.options._counterField]);
		}
		var $ctrlHolder = $('<div class="' + $this.options._styleClass + '"></div>').hide();
		// store settings to be used in _createFieldSettings() and _languageChange()
		$ctrlHolder.data('fbWidget', settings); 
		$this._log("b4. text = " + settings[$('#language').val()].text);
		var fb = {target: $this, item: $ctrlHolder, settings: settings[$('#language').val()]};
		var $widget = $this._getWidget(event, fb);
		$this._log("at. text = " + settings[$('#language').val()].text);
		$ctrlHolder.append($widget);
		if (event.type == 'click' || event.type == 'drop') {
			var name = $this._propertyName($this.options._type + counter);
			$widget.click($this._createFieldSettings);			
			$this._createField(name, $ctrlHolder, $this.options, settings);
			if (event.type == 'click') {
				$($.fb.formbuilder.prototype.options._formControls).append($ctrlHolder).sortable('refresh');				
				$ctrlHolder.toggle('slide', {direction: 'up'}, 'slow');			
			} else {
				return $ctrlHolder;
			}
		} else {
			return $ctrlHolder.show();
		}
		$this._log('_createFbWidget executed');
    },
  _createFieldSettings: function(event) { 
	  $.fb.fbWidget.prototype._log('_createFieldSettings executing.');
		var $widget = $(this);	  
		var selectedClass = $.fb.fbWidget.prototype.options._selectedClass;
		$widget = $widget.attr('class').indexOf($.fb.fbWidget.prototype.options._styleClass) > -1 ? $widget : $widget.parent();
		$widget.parent().find('.' + selectedClass).removeClass(selectedClass);
		$widget.addClass(selectedClass);
		var type = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].type']").val();
		$.fb.fbWidget.prototype._log('type = ' + type);
		var $this = $('#' + type).data('fb' + type);
		var fbOptions = $this._getFbOptions();
		$this._log('$widget.text() = ' + $widget.text() + ", fbOptions.readOnly = " + fbOptions.readOnly);
		
		if (!$widget.data('fbWidget')) { // widgets loaded from server
			var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
			$this._log('_createFieldSettings. unescaped settings = ' + unescape($settings.val()));
			// settings is JavaScript encoded when return from server-side
			$widget.data('fbWidget', $.parseJSON(unescape($settings.val())));
		}
		var settings = $widget.data('fbWidget'); 
		var $languageSection = $(fbOptions._fieldSettingsLanguageSection);
		var $language = $('#language');
		$('legend', $languageSection).text('Language: ' + $language.find('option:selected').text());		
		var fbLanguageSection = {target: $this, item: $widget, settings: settings[$language.val()]};
		var fieldSettings = $this._getFieldSettingsLanguageSection(event, fbLanguageSection);
		// remote all child nodes except legend
		$languageSection.children(':not(legend)').remove();  
		for (var i=0; i<fieldSettings.length; i++) {
			$languageSection.append(fieldSettings[i]);
		} 
		var fbGeneralSection = {target: $this, item: $widget, settings: settings};
		fieldSettings = $this._getFieldSettingsGeneralSection(event, fbGeneralSection);
		$this._log('fieldSettings.length = ' + fieldSettings.length);
		var $generalSection = $(fbOptions._fieldSettingsGeneralSection); 
		// remote all child nodes
		$generalSection.children().remove();  	
		for (var i=0; i<fieldSettings.length; i++) {
			$this._log(fieldSettings[i].html());
		  $generalSection.append(fieldSettings[i]);
		}
		
		if (fbOptions.readOnly) {
		  var $fieldSettingsPanel = $(fbOptions._fieldSettingsPanel);
		  $('input', $fieldSettingsPanel).attr("disabled", true);
		  $('select', $fieldSettingsPanel).attr("disabled", true);
		  $('textarea', $fieldSettingsPanel).attr("disabled", true);
		}
		
		// activate field settings tab
		$(fbOptions._paletteTabs).tabs('select', 1);
		
		// focus on 1st input component
		$('input:first', $fieldSettingsPanel).focus();	
		
  	$.fb.fbWidget.prototype._log('_createFieldSettings executed.');
    },
	_getCounter: function($this) {
		  var $ctrlHolders = $('.' + $this.options._styleClass + ':visible:not(.' + this._getFbOptions()._draggableClass + ')');
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
  _twoColumns: function($e1, $e2) {
	  return $('<div class="2cols"></div>')
	        .append($e1.addClass('labelOnTop col1 noPaddingBottom'))
	        .append($e2.addClass('labelOnTop col2'));
 	} ,      
  _oneColumn: function($e) {
	  return $e.addClass('clear labelOnTop');
 	} ,   
 	_help: function(options) {
 		var $help;
 		if (options.description) {
 		  $help = $('<span>&nbsp;(<a href="#" title="' + options.description + '">?</a>)</span>');
			var $link = $('a', $help);
			$link.qtip({
				content: $link.attr('title'),
				  position: { my: 'bottom left', at: 'top center' },
					show: {
						event: 'click',
						effect: function() { $(this).show('drop', { direction:'up'}); }
					},		
					hide: 'mouseout',
					style: {
						widget: true,
						classes: 'ui-tooltip-shadow ui-tooltip-rounded', 
						tip: true
					}				
			}); 		
 		}
 		return $help;
 	},
 	_label: function(options) {
 		var $label = $('<div><label for="' + options.name + '">' + options.label + '</label></div>')
 		       .append(this._help(options));
 		if (!options.nobreak) $label.append('<br />');
 		return $label;
 	},
 	_horizontalAlignment: function(options) {
 		var o = $.extend({}, options);
 		o.label = o.label ? o.label : 'Horizontal Align'; 
 		var $horizontalAlignment = this._label(o)
		.append('<select> \
			<option value="leftAlign">left</option> \
			<option value="centerAlign">center</option> \
			<option value="rightAlign">right</option> \
		</select>');
		$('select', $horizontalAlignment).val(o.value).attr('id', o.name);	
		return $horizontalAlignment;
 	},
 	_verticalAlignment: function(options) {
 		var o = $.extend({}, options);
 		o.label = o.label ? o.label : 'Vertical Align'; 
 		var $verticalAlignment = this._label(o)
		 .append('<select> \
				<option value="topAlign">top</option> \
				<option value="middleAlign">middle</option> \
				<option value="bottomAlign">bottom</option> \
			</select></div>');
		$('select', $verticalAlignment).val(o.value).attr('id', o.name);	
		return $verticalAlignment;			
 	},
 	_name: function($widget) {
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
 	_colorPicker: function(options) {
		var $colorPicker = this._label(options);
 		if (!options.type || options.type == 'basic') {
			$colorPicker.colorPicker({
				name: options.name,
				value: options.value,
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
	  return $colorPicker;
 	},
 	_fontPicker: function(options) {
 		var o = $.extend({}, options);
 		this._log('fontPicker(' + $.toJSON(o) + ')');
 		o.value = o.value.replace(/'/gi, ''); // remove single quote for chrome browser
 		o.value = o.value.split(',', 1)[0]; // taking the 1st font type
 		o.value = o.value != 'default' ? o.value : this._getFbOptions().settings.styles.fontFamily;
 		if (!o.label) o.label = 'Font';
		var $fontPicker = this._label(o).append('<div class="fontPicker" rel="' + o.name + '"></div>'); 		

		$('.fontPicker', $fontPicker).fontPicker({ 
			name: o.name,
			defaultFont: o.value
		});
 		return $fontPicker;
 	},	
 	_fontSize: function(options) {
 		this._log('fontSize(' + $.toJSON(options) + ')');
 		options.nobreak = true;
	 	var $fontSize = this._label(options).append('&nbsp;<select> \
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
		  </select>');		
		  var $select = $('select', $fontSize);
		  if (options.value == 'default') {
			  $select.val(this._getFbOptions().settings.styles.fontSize);
		  } else {
			  $select.val(options.value);
		  }
		  $select.attr('id', options.name);
		  return $fontSize;
   } ,	
  _fontStyles: function(options) {  
	  var names = options.names;
	  var checked = options.checked;
		var $fontStyles = $('<div> \
		  <input type="checkbox" id="' + names[0] + '" />&nbsp;Bold<br /> \
	    <input type="checkbox" id="' + names[1] + '" />&nbsp;Italic<br /> \
	    <input type="checkbox" id="' + names[2] + '" />&nbsp;Underline \
	  </div>');
	  if (checked) {
	    for (var i = 0; i < checked.length; i++) {
	    	$("input[id$='" + names[i] + "']", $fontStyles).attr('checked', checked[i]);
	    }
	  }
	  return $fontStyles;
  },
  _twoRowsOneRowLayout: function(row1col1, row2col1, row1col2) {
	  var $twoRowsOneRowLayout = $('<div class="twoRowsOneRow"> \
			    <div class="row1col1"> \
			      <div class="row2col1"> \
			      </div> \
			    </div> \
			    <div class="row1col2"> \
			    </div> \
			  </div>');
		$('.row1col1',$twoRowsOneRowLayout).prepend(row1col1);
		$('.row2col1',$twoRowsOneRowLayout).append(row2col1);
		$('.row1col2',$twoRowsOneRowLayout).append(row1col2);			    
		return $twoRowsOneRowLayout;	    
  },
  _fieldset: function(options) {
	  return $('<fieldset><legend>' + options.text + '</legend></fieldset>');
  },
  _fontPanel:function(options) {
	  //fontFamily, fontSize, styles.fontStyles
	  var idPrefix = options.idPrefix ? options.idPrefix : '';
	  var names = [idPrefix + 'bold', idPrefix + 'italic', idPrefix + 'underline'];
	  return this._fieldset({ text: 'Fonts' }).append(this._twoRowsOneRowLayout(
			  this._fontPicker({ name: idPrefix + 'fontFamily', value: options.fontFamily }),
			  this._fontSize({ label: 'Size', name: idPrefix + 'fontSize', value: options.fontSize }),
			  this._fontStyles({ names: names, checked: options.fontStyles }).css('paddingLeft', '2em')
			  ));
  },
  _colorPanel: function(options) {
	  //textColorValue, backgroundColorValue, idPrefix
	  var o = $.extend({}, options);
	  o.idPrefix = o.idPrefix ? o.idPrefix : '';
	  if (o.color == 'default') {
		  o.color = this._getFbOptions().settings.styles.color;
	    } 	  
	  if (o.backgroundColor == 'default') {
		  o.backgroundColor = this._getFbOptions().settings.styles.backgroundColor;
	    } 	 
	  var $colorPanel = this._fieldset({ text: 'Colors' }).append(
			  this._twoColumns(this._colorPicker({ label: 'Text', name: o.idPrefix + 'color', value: o.color }),
			  this._colorPicker({ label: 'Background', name: o.idPrefix + 'backgroundColor', value: o.backgroundColor })));
	  $colorPanel.find('.2cols .col2').addClass('noPaddingBottom');
	  $colorPanel.find('input:first').addClass('floatClearLeft');
	  return $colorPanel;
  },
  _getWidget: function(event, fb) {
  	 $.fb.fbWidget.prototype._log('getWidget(event, fb) should be overriden by subclass.');
   },
  _getFieldSettingsLanguageSection: function(event, fb) {
	   $.fb.fbWidget.prototype._log('getFieldSettingsLanguageSection(event, fb) should be overriden by subclass.');
	},
	_getFieldSettingsGeneralSection: function(event, fb) {
	   $.fb.fbWidget.prototype._log('getFieldSettingsLanguageSection(event, fb) should be overriden by subclass.');
	} , 
	_languageChange : function(event, fb) {
		$.fb.fbWidget.prototype._log('_languageChange(event, fb) should be overriden by subclass.');
	}
};

$.widget('fb.fbWidget', FbWidget);