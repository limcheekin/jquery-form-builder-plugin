/*
* jquery-form-builder-plugin - JQuery WYSIWYG Web Form Builder
* http://code.google.com/p/jquery-form-builder-plugin/
*
* Revision: 35
* Version: 0.1
* Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
*
* Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
*
* Date: Sun Jan 16 23:31:36 GMT+08:00 2011 
*/

/*
 * Main component of JQuery Form Builder plugin, the Form Builder container itself 
 * consists of builder palette contains widgets supported by the form builder and 
 * builder panel where the constructed form display. 
 * 
 * Revision: 35
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 16-Jan-2011
 */

var FormBuilder = {
  options: { // default options. values are stored in widget's prototype
		widgets : ['PlainText'],
		tabSelected: 0,
		readOnly: false,
		tabDisabled: [],
		_builderForm: '#builderForm fieldset',
		_emptyBuilderPanel: '#emptyBuilderPanel',
		_standardFieldsPanel: '#standardFields',
		_fancyFieldsPanel: '#fancyFields',
		_fieldSettingsPanel: '#fieldSettings',
    _fieldSettingsLanguageSection: '#fieldSettings fieldset.language:first',
    _fieldSettingsGeneralSection: '#fieldSettings div.general:first',
    _formSettingsLanguageSection: '#formSettings fieldset.language:first',
    _formSettingsGeneralSection: '#formSettings div.general:first'    	
    	    	
  },
  _create: function() {
    	// called on construction
    this._log('FormBuilder._create called. this.options.widgets = ' + this.options.widgets);
    this._initBuilderPalette();
    this._initBuilderPanel();
    },
  _initBuilderPalette: function() {
		// REF: http://www.webresourcesdepot.com/smart-floating-banners/
		$(window).scroll(
		function() {
			if ($(window).scrollTop() > $(".floatingPanelIdentifier").position({scroll : false}).top) {
				$(".floatingPanel").css("position", "fixed");
				$(".floatingPanel").css("top", "0");
			}
			
			if ($(window).scrollTop() <= $(".floatingPanelIdentifier").position({scroll : false}).top) {
				$(".floatingPanel").css("position", "relative");
				$(".floatingPanel").css("top",
						$(".floatingPanelIdentifier").position);
			}
		});
		
		$('#paletteTabs').tabs({selected: this.options.tabSelected, disabled: this.options.tabDisabled});
		var widgets = this.options.widgets;
		var length = widgets.length;
		var widgetOptions;
		var widget;
		var i;
	  for (i = 0; i < length; i++) {
		  widgetOptions = $['fb']['fb' + widgets[i]].prototype.options;
		  widget = $('<a id="' + widgetOptions._type +  '" href="#" class="fbWidget">' + widgetOptions.name + '</a>');
      widget.button()['fb' + widgetOptions._type]({fbOptions: this.options}).appendTo(widgetOptions.belongsTo);
	    }			  
   },
  _initBuilderPanel: function() {
	  this._initFormSettings();
	  if (!this.options.readOnly) {
	    this._initSortableWidgets();
	  } else {
			$('input:not(div.buttons input)').attr("disabled", true);
			$('select').attr("disabled", true);
			$('textarea').attr("disabled", true);	    	
	    }
	  this._initWidgetsEventBinder();
   },
  _initFormSettings: function() {
	  var $builderForm = $(this.options._builderForm);
	  var $name = $('#name', $builderForm);
	  var $description = $('#description', $builderForm);
	  var $formSettingsGeneralSection = $(this.options._formSettingsGeneralSection);
	  
	  $("input[id$='form.name']", $formSettingsGeneralSection).val($name.val())
	  .keyup(function(event) {
	       $name.val($(event.target).val());	
	    });

	  $("[id$='form.description']", $formSettingsGeneralSection).val($description.val())
	  .keyup(function(event) {
	       $description.val($(event.target).val());	
	    });	  
	 
   },
 _initWidgetsEventBinder: function() { // for widgets loaded from server
	  var $ctrlHolders = $('.' + $.fb.fbWidget.prototype.options._styleClass);
	  var size = $ctrlHolders.size();
		if (size > 0) { 
			var $this, widget;
			var fieldsUpdateStatus = ['name', 'settings', 'sequence'];
			
			$(this.options._emptyBuilderPanel + ':visible').hide();
			$ctrlHolders.each(function(i) {
			    $this = $(this);
			    widget = $this.find("input[id$='fields[" + i + "].type']").val();
			    $this.click($['fb']['fb' + widget].prototype._createFieldSettings);				
					for (var j = 0; j < fieldsUpdateStatus.length; j++) {
						$this.find("input[id$='fields[" + i + "]." + fieldsUpdateStatus[j] + "']")
						                  .change($.fb.fbWidget.prototype._updateStatus);
					}	  
			});
			if (!this.options.readOnly) {
			  $ctrlHolders.find(".closeButton").click($.fb.fbWidget.prototype._deleteWidget);
			}
		}
  },
  _initSortableWidgets: function() {
	  var $builderFormFieldset = $(this.options._builderForm);
		$builderFormFieldset.sortable({ 
			axis: 'y',
			cursor: 'move',
			helper: function (event, ui) {
				return $(ui).clone().css({
					opacity: 0.6,
					border: "3px solid #cccccc"
				});
			},
			start: function (event, ui) {
				var $previousElement = $(ui.item).prev();
				if ($previousElement.attr('rel')) {
					ui.item.prevIndex = $previousElement.attr('rel');
					ui.item.originalPositionTop = $previousElement.position().top;
					// alert('ui.item.originalPositionTop = ' + ui.item.originalPositionTop);
				}
			},
			update: function (event, ui) {
				var $uiItem = $(ui.item);
				var $elements;
				var moveDown = ui.position.top > ui.item.originalPositionTop;
				$.fb.formbuilder.prototype._log('moveDown = ' + moveDown + ', ui.position.top = ' + ui.position.top + ", ui.item.originalPositionTop = " + ui.item.originalPositionTop);
				if (ui.item.prevIndex) {
					var prevElementSelector = '[rel="' + ui.item.prevIndex + '"]';
					if (moveDown) {
				    $elements = $uiItem.prevUntil(prevElementSelector);
				    $.fb.formbuilder.prototype._moveDown($uiItem, $elements);			    
					} else {
						// set next widget's sequence as my sequence
						$.fb.formbuilder.prototype._getSequence($uiItem).val(
						    $.fb.formbuilder.prototype._getSequence($uiItem.next()).val()).change();						
						$elements = $uiItem.nextUntil(prevElementSelector);  
						$elements.each(function(index) {
						  $.fb.formbuilder.prototype._increaseSequence($(this));
						 });		
						// process the last one
						$.fb.formbuilder.prototype._increaseSequence($(prevElementSelector));
					}
				} else {
					$elements = $uiItem.prevAll();
					$.fb.formbuilder.prototype._moveDown($uiItem, $elements);			
				}	
			}	
		});
		// Making text elements, or elements that contain text, not text-selectable.
		$builderFormFieldset.disableSelection();	  
  },
	_init: function() {
	  // called on construction and re-initialization
		this._log('FormBuilder._init called.');
		this.method1('calling from FormBuilder._init');
	},        
	destroy: function() {
    // called on removal
		this._log('FormBuilder.destroy called.');

    // call the base destroy function.
		$.Widget.prototype.destroy.call(this);		
    },
  // _logging to the firebug's console, put in 1 line so it can be removed easily for production
  _log: function($message) { if (window.console && window.console.log) window.console.log($message); },
  _moveDown: function($widget, $elements) {
		// set previous widget's sequence as my sequence
		$.fb.formbuilder.prototype._getSequence($widget).val(
		    $.fb.formbuilder.prototype._getSequence($widget.prev()).val()).change();
	  $elements.each(function(index) {
		  $.fb.formbuilder.prototype._decreaseSequence($(this));
	    });	
  }, 
  _getSequence: function($widget) {
    	return $widget.find("input[id$='fields[" + $widget.attr('rel') + "].sequence']");
    },
  _increaseSequence: function($widget) {
	  if ($widget.is(":visible")) {
		  var $sequence = $.fb.formbuilder.prototype._getSequence($widget);
		  $sequence.val($sequence.val() * 1 + 1);
		  $sequence.change();
	    }
   },
  _decreaseSequence: function($widget) {
	  if ($widget.is(":visible")) {
	    var $sequence = $.fb.formbuilder.prototype._getSequence($widget);
	    $sequence.val($sequence.val() - 1);
	    $sequence.change();
	  }
   },  
	method1: function(params) {
    	// plugin specific method
		this._log('FormBuilder.method1 called. params = ' + params);
    }
};

$.widget('fb.formbuilder', FormBuilder);/*
 * Base widget plugin of JQuery Form Builder plugin, all Form Builder widgets should extend from this plugin. 
 * 
 * Revision: 35
 * Version: 0.1
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

$.widget('fb.fbWidget', FbWidget);/*
 * JQuery Form Builder - Plain Text plugin.
 * 
 * Revision: 35
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 16-Jan-2011
 */

// extends/inherits from superclass: FbWidget
var FbPlainText = $.extend({}, $.fb.fbWidget.prototype, {
	options : { // default options. values are stored in widget's prototype
		name : 'Plain Text',
		belongsTo : $.fb.formbuilder.prototype.options._fancyFieldsPanel,
		_type : 'PlainText',
		_html : '<div class="PlainText"></div>',
		_counterField : 'text',
		_languages : [ 'en', 'zh' ],
		settings : {
			en : {
				text : 'Plain Text Value',
				classes : [ 'leftAlign', 'topAlign' ]
			},
			zh : {
				text : '無格式文字',
				classes : [ 'rightAlign', 'topAlign' ]
			},
			styles : {
				fontFamily : 'default', // browser default
				color : 'default',
				backgroundColor : 'default'
			}
		}
	},
	_create : function() {
		$.fb.fbWidget.prototype._create.call(this); 
	},
	_init : function() {
		$.fb.fbWidget.prototype._init.call(this); 
		this.options = $.extend({}, $.fb.fbWidget.prototype.options, this.options);
		this._log('FbPlainText._create called. this.options.text = ' + this.options.settings.en.text);
		this._log('FbPlainText._init called.');
	},
	destroy : function() {
		// FbPlainText's destroy code here
		this._log('FbPlainText.destroy called.');
		$.fb.fbWidget.prototype.destroy.call(this); 
	},
	getWidget : function($this, settings, $ctrlHolder) {
		$ctrlHolder.addClass(settings.classes[1]); // vertical alignment
		return $($this.options._html).text(settings.text)
				.addClass(settings.classes[0]);
	},
	getCounter : function($this) {
		return $('div.' + $this.options._type).size() + 1;
	},
	getFieldSettingsLanguageSection : function($this, $widget, settings) {
		var $text = $('<label for="field.text">Text (?)</label><br /> \
     <input type="text" id="field.text" />')
				.val($widget.find('div.PlainText').text())
				.keyup(function(event) {
					var value = $(this).val();
					$widget.find('div.PlainText').text(value);
					settings.text = value;
					$this.updateSettings($widget, settings);
				});
		var $verticalAlignment = $this.verticalAlignment().val(
				settings.classes[1]).change(
				function(event) {
					var value = $(this).val();
					$widget.removeClass(settings.classes[1]).addClass(value);
					settings.classes[1] = value;
					$this.updateSettings($widget, settings);
				});
		var $horizontalAlignment = $this.horizontalAlignment()
				.val(settings.classes[0]).change(
						function(event) {
							var $text = $widget.find('div.PlainText');
							var value = $(this).val();
							$text.removeClass(settings.classes[0]).addClass(value);
							settings.classes[0] = value;
							$this.updateSettings($widget, settings);
						});
		return [$this.oneColumn($text),
				$this.twoColumns($verticalAlignment,$horizontalAlignment) ];
	},
	getFieldSettingsGeneralSection : function($this, $widget, settings) {
		return [ $this.oneColumn($this.name($widget)) ];
	}
});

$.widget('fb.fbPlainText', FbPlainText);
