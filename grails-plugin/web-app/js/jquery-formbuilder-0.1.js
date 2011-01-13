/*
* jquery-form-builder-plugin - JQuery WYSIWYG Web Form Builder
* http://code.google.com/p/jquery-form-builder-plugin/
*
* Revision: 24
* Version: 0.1
* Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
*
* Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
*
* Date: Thu Jan 13 10:35:18 GMT+08:00 2011
*/

/*
 * Main component of JQuery Form Builder plugin, the Form Builder container itself 
 * consists of builder palette contains widgets supported by the form builder and 
 * builder panel where the constructed form display. 
 * 
 * Revision: 24
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 
 */

var FormBuilder = {
  options: { // default options. values are stored in widget's prototype
		widgets : ['PlainText'],
		tabSelected: 0,
		_builderForm: '#builderForm fieldset',
		_emptyBuilderPanel: '#emptyBuilderPanel',
		_standardFieldsPanel: '#standardFields',
		_fancyFieldsPanel: '#fancyFields',
    _fieldSettingsLanguageSection: '#fieldSettings fieldset.language:first',
    _fieldSettingsGeneralSection: '#fieldSettings div.general:first',
    _formSettingsLanguageSection: '#formSettings fieldset.language:first',
    _formSettingsGeneralSection: '#formSettings div.general:first'    	
    	    	
  },
  _create: function() {
    	// called on construction
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
		
		$('#paletteTabs').tabs({selected: this.options.tabSelected});
		var widgets = this.options.widgets;
		var length = widgets.length;
		var widgetOptions;
		var widget;
		var i;
	  for (i = 0; i < length; i++) {
		  widgetOptions = $['fb']['fb' + widgets[i]].prototype.options;
		  widget = $('<a id="' + widgetOptions.type +  '" href="#" class="fbWidget">' + widgetOptions.name + '</a>')['fb' + widgetOptions.type]();
      widget.button().appendTo(widgetOptions.belongsTo);
	    }			  
   },
  _initBuilderPanel: function() {
	  this._initFormFields();
	  this._initSortableWidgets();
	  this._initWidgetsEventBinder();
   },
  _initFormFields: function() {
	  var $builderForm = $(this.options._builderForm);
	  var $name = $('#name', $builderForm);
	  var $description = $('#description', $builderForm);
	  var $formSettingsGeneralSection = $(this.options._formSettingsGeneralSection);
	  
	  $("input[id$='form.name']", $formSettingsGeneralSection).val($name.val()).change(function(event) {
	       $name.val($(event.target).val());	
	    });
	  $("[id$='form.description']", $formSettingsGeneralSection).val($description.val()).change(function(event) {
	       $description.val($(event.target).val());	
	    });	  
   },
 _initWidgetsEventBinder: function() { // for existing widgets loaded from server
	  var $ctrlHolders = $('#builderForm div.ctrlHolder');
	  var size = $ctrlHolders.size();
		var fieldsUpdateStatus = ['name', 'settings', 'sequence'];
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < fieldsUpdateStatus.length; j++) {
				$ctrlHolders.find("input[id$='fields[" + i + "]." + fieldsUpdateStatus[j] + "']")
				                  .change($.fb.fbWidget.prototype._updateStatus);
			}	  
		}
  } ,
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
				if ($previousElement.attr('id')) {
					ui.item.prevId = $previousElement.attr('id');
					ui.item.originalPositionTop = $previousElement.position().top;
					// alert('ui.item.originalPositionTop = ' + ui.item.originalPositionTop);
				}
			},
			update: function (event, ui) {
				var $uiItem = $(ui.item);
				var $elements;
				var moveDown = ui.position.top > ui.item.originalPositionTop;
				if (ui.item.prevId) {
					if (moveDown) {
				    $elements = $uiItem.prevUntil('#' + ui.item.prevId);
				    $.fb.formbuilder.prototype._moveDown($uiItem, $elements);			    
					} else {
						// set next widget's sequence as my sequence
						$.fb.formbuilder.prototype._getSequence($uiItem).val(
						    $.fb.formbuilder.prototype._getSequence($uiItem.next()).val()).trigger('change');						
						$elements = $uiItem.nextUntil('#' + ui.item.prevId);  
						$elements.each(function(index) {
						  $.fb.formbuilder.prototype._increaseSequence($(this));
						 });		
						// process the last one
						$.fb.formbuilder.prototype._increaseSequence($('#' + ui.item.prevId));
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
		this.method1('calling from FormBuilder._init');
	},        
	destroy: function() {
    // called on removal

    // call the base destroy function.
		$.Widget.prototype.destroy.call(this);		
    },
  // _logging to the firebug's console, put in 1 line so it can be removed easily for production
  _moveDown: function($widget, $elements) {
		// set previous widget's sequence as my sequence
		$.fb.formbuilder.prototype._getSequence($widget).val(
		    $.fb.formbuilder.prototype._getSequence($widget.prev()).val()).trigger('change');
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
		  $sequence.trigger('change');
	    }
   },
  _decreaseSequence: function($widget) {
	  if ($widget.is(":visible")) {
	    var $sequence = $.fb.formbuilder.prototype._getSequence($widget);
	    $sequence.val($sequence.val() - 1);
	    $sequence.trigger('change');
	  }
   },  
	method1: function(params) {
    	// plugin specific method
    }
};

$.widget('fb.formbuilder', FormBuilder);/*
 * Base widget plugin of JQuery Form Builder plugin, all Form Builder widgets should extend from this plugin. 
 * 
 * Revision: 24
 * Version: 0.1
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
	_create: function() {
	  this.element.click(this.createWidget);
    },
  _init: function() {
    },        
	destroy: function() {
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
		   $widget.find("input[id$='fields[" + index + "].status']").val('D');
		   $widget.hide();
		   event.stopPropagation();
	    });
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
	_createFieldProperties: function(name, options, settings, index) {
		// alert('name = ' + name + ', options.type = '+ options.type);
		var $fieldProperties = $('<div class="fieldProperties"> \
		<input type="hidden" id="fields[' + index + '].name" name="fields[' + index + '].name" value="' + name + '" /> \
		<input type="hidden" id="fields[' + index + '].type" name="fields[' + index + '].type" value="' + options.type + '" /> \
		<input type="hidden" id="fields[' + index + '].settings" name="fields[' + index + '].settings" /> \
		<input type="hidden" id="fields[' + index + '].sequence" name="fields[' + index + '].sequence" value="' + index + '" /> \
		<input type="hidden" id="fields[' + index + '].status" name="fields[' + index + '].status" /> \
		</div>');
		$fieldProperties.find("input[id$='fields[" + index + "].settings']").val($.toJSON(settings));
		return $fieldProperties;
    },        
  _updateStatus: function(event) {
	  $widget = $(event.target);
	  $widget.parent().find('input:last').val('U');
  },
	createWidget: function(event) { alert('createWidget(event) should be overriden by subclass'); }
};

$.widget('fb.fbWidget', FbWidget);/*
 * JQuery Form Builder - Plain Text plugin.
 * 
 * Revision: 24
 * Version: 0.1
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
	  html: '<div class="ctrlHolder"><div class="plainText"></div></div>',
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
	  	  fontFamily: 'none', // browser default
		    color: 'none',
		    backgroundColor: 'none'	    	
	        }
	    }
    },
	_create: function() {
	  $.fb.fbWidget.prototype._create.call(this); // call the superclass's _create function
	  // FbPlainText's construction code here
    },
  _init: function() {
	  $.fb.fbWidget.prototype._init.call(this); // call the superclass's _init function
	  // FbPlainText's construction and re-initialization code here	
    },        
	destroy: function() {
	  // FbPlainText's destroy code here
	  $.fb.fbWidget.prototype.destroy.call(this); // call the superclass's destroy function
    },
  createWidget: function(event) {
	  var $plainText = $(event.target).parent().data('fbPlainText'); // direct access to plugin instance
	  var size = $('div.' + $plainText.options.type).size() + 1;
	  var name = $plainText.propertyName($plainText.options.type + size);
		var language = $('#language').val();	  
	  var text = $plainText.options.settings[language].text + ' ' + size;
	  var $widget = $($plainText.options.html).addClass($plainText.options.type)
	              .addClass($plainText.options.settings[language].classes[1])
	              .attr('id', name).click($plainText.getFieldSettings);
	  // Clone an instance of plugin's option settings. 
	  // From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object 	  
	  var settings = jQuery.extend(true, {}, $plainText.options.settings);
	  settings[language].text = text;
	  $widget.find('div.plainText').text(text).addClass(settings[language].classes[0]);
	  $plainText.createField(name, $widget, $plainText.options, settings);
    },
 getFieldSettings: function(event) { 
	 var $plainTextElement = $(event.target).parent();
	 var formBuilderOptions = $.fb.formbuilder.prototype.options;
	 var index = $plainTextElement.attr('rel');
	 var $settings = $plainTextElement.find("input[id$='fields[" + index + "].settings']");
	 var settings = $.parseJSON($settings.val());
	 
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
	$languageSectionSettings.find('input#text')
													.val($plainTextElement.find('div.plainText').text())
													.change(function(event) {
														var value = $(event.target).val();
														$plainTextElement.find('div.plainText').text(value);
														settings[language].text = value;
														$settings.val($.toJSON(settings)).trigger('change');
													});
	$languageSectionSettings.find('select#horizontalAlignment')
													.val(settings[language].classes[0])
													.change(function(event) {
														var $text = $plainTextElement.find('div.plainText');
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
														var $text = $plainTextElement.find('div.plainText');
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
