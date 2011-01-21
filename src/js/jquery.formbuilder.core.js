/*
 * Main component of JQuery Form Builder plugin, the Form Builder container itself 
 * consists of builder palette contains widgets supported by the form builder and 
 * builder panel where the constructed form display. 
 * 
 * Revision: @REVISION
 * Version: @VERSION
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
		formCounter: 1,
		settings: {
			en: {
				name: 'Form',
				classes: ['leftAlign'],
				heading: 'h2',
				fontStyles: [1, 0, 0]
			},
			zh: {
				name: '表格',
				classes: ['rightAlign'],
				heading: 'h2',
				fontStyles: [1, 0, 0]
			},			
			styles : {
				color : 'default', // browser default
				backgroundColor : 'default',
				fontFamily: 'default', 
				fontSize: 'default'				
			}
		},
		_id: '#container',
		_languages : [ 'en', 'zh' ],
		_builderPanel: '#builderPanel',
		_builderForm: '#builderForm fieldset',
		_emptyBuilderPanel: '#emptyBuilderPanel',
		_standardFieldsPanel: '#standardFields',
		_fancyFieldsPanel: '#fancyFields',
		_fieldSettingsPanel: '#fieldSettings',
    _fieldSettingsLanguageSection: '#fieldSettings fieldset.language:first',
    _fieldSettingsGeneralSection: '#fieldSettings div.general:first',
    _formSettingsLanguageSection: '#formSettings fieldset.language:first',
    _formSettingsGeneralSection: '#formSettings div.general:first',
    _languagesSupportIdGeneration: ['en']
  },
  _create: function() {
    	// called on construction
    this._log('FormBuilder._create called. this.options.widgets = ' + this.options.widgets);
    this._initBrowserDefaultSettings();
    this._initBuilderPalette();
    this._initBuilderPanel();
    },
  _initBrowserDefaultSettings: function() {
	  var $html = $('html');
	  var options = this.options;
	  options._fontFamily = $html.css('fontFamily');
	  options._fontSize = $html.css('fontSize');
	  options._color = $html.css('color');
	  options._backgroundColor = $html.css('backgroundColor');
	  var pxIndex = options._fontSize.lastIndexOf('px');
	  if (pxIndex > -1) {
		  options._fontSize = options._fontSize.substring(0, pxIndex);
	  }
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
      widget.button()['fb' + widgetOptions._type]().appendTo(widgetOptions.belongsTo);
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
	  var $fbWidget = $.fb.fbWidget.prototype;
	  var $builderPanel = $(this.options._builderPanel);
	  var $builderForm = $(this.options._builderForm);
	  var $formSettingsLanguageSection = $(this.options._formSettingsLanguageSection);
	  var $formSettingsGeneralSection = $(this.options._formSettingsGeneralSection);
	  var $language = $('#language', $formSettingsLanguageSection).change(this._languageChange);
	  var options = this.options;
	  var settings = options.settings[$language.val()];
	  var $this = this;
	  var $formHeading = $('.formHeading',$builderForm);
	  
	  for (var i = 0; i < options._languages.length; i++) {
		  options.settings[options._languages[i]].name += ' ' + options.formCounter;
	  }
	 
	  $formHeading.append('<' + settings.heading + ' class="heading">' + settings.name + '</' + settings.heading + '>');
	  
	  $('#name',$builderForm).val($fbWidget._propertyName(settings.name));
		var $name = $('<label for="form.name">Name (?)</label><br/> \
				  <input type="text" id="form.name" value="' + settings.name + '" />')
					.keyup(function(event) {
						var value = $(this).val();
						if ($.inArray($language.val(), options._languagesSupportIdGeneration) > -1) {
							var name = $fbWidget._propertyName(value);
				      $('#name',$builderForm).val(name).change();
						}
						$fbWidget._log('$(this).val() = ' + value);
						settings.name = value;
						$(settings.heading, $formHeading).text(value);
					});			  
		
		var $heading = $('<select> \
					<option value="h1">Heading 1</option> \
					<option value="h2">Heading 2</option> \
					<option value="h3">Heading 3</option> \
					<option value="h4">Heading 4</option> \
					<option value="h5">Heading 5</option> \
					<option value="h6">Heading 6</option> \
				</select>').css('marginTop', '1em')
				.val(settings.heading)
				.attr('id', 'form.heading') // unable to set value if specify in select tag
	      .change(function(event) {
	    	  var heading = $(this).val();
	    	  var text = $(settings.heading, $formHeading).text();
	    	  var $heading = $('<' + heading + ' class="heading">' + text + '</' + heading + '>');
	    	  if (settings.fontStyles[0] == 0) {
	    		  $heading.css('fontWeight', 'normal');  
	    	  }
	    	  if (settings.fontStyles[1] == 1) {
	    		  $heading.css('fontStyle', 'italic');
	    	  }	    	  
	    	  if (settings.fontStyles[2] == 1) {
	    		  $heading.css('textDecoration', 'underline');
	    	  }	    		    	  
	    	  $(settings.heading, $formHeading).replaceWith($heading);
	    	  settings.heading = heading;
	    	  $this._updateSettings($this);
	            });
				
		var $horizontalAlignment = $fbWidget.horizontalAlignment('form.horizontalAlignment', settings.classes[0]);
		$('select', $horizontalAlignment).change(function(event) {
					var value = $(this).val();
					$formHeading.removeClass(settings.classes[0]).addClass(value);
					settings.classes[0] = value;
					$this._updateSettings($this);
				}).change();
		
		var names = ['form.bold', 'form.italic', 'form.underline'];
		var $fontStyles = $fbWidget.fontStyles(names, settings.fontStyles);
		$("input[id$='form.bold']", $fontStyles).change(function(event) {
			if ($(this).attr('checked')) {
				$(settings.heading, $formHeading).css('fontWeight', 'bold');
				settings.fontStyles[0] = 1;
			} else {
				$(settings.heading, $formHeading).css('fontWeight', 'normal');
				settings.fontStyles[0] = 0;
			}
			$this._updateSettings($this);
		}).change();
		$("input[id$='form.italic']", $fontStyles).change(function(event) {
			if ($(this).attr('checked')) {
				$(settings.heading, $formHeading).css('fontStyle', 'italic');
				settings.fontStyles[1] = 1;
			} else {
				$(settings.heading, $formHeading).css('fontStyle', 'normal');
				settings.fontStyles[1] = 0;
			}
			$this._updateSettings($this);
		}).change();		
		$("input[id$='form.underline']", $fontStyles).change(function(event) {
			if ($(this).attr('checked')) {
				$(settings.heading, $formHeading).css('textDecoration', 'underline');
				settings.fontStyles[2] = 1;
			} else {
				$(settings.heading, $formHeading).css('textDecoration', 'none');
				settings.fontStyles[2] = 0;
			}
			$this._updateSettings($this);
		}).change();
		
		var fontFamily = options.settings.styles.fontFamily;
		if (fontFamily == 'default') {
			fontFamily = options._fontFamily;
		}
		var $fontPicker = $fbWidget.fontPicker({ name: 'form.fontFamily', value: fontFamily });
		$("input[id$='form.fontFamily']", $fontPicker).change(function(event) {
			var value = $(this).val();
			$builderPanel.css('fontFamily', value);
			options.settings.styles.fontFamily = value;
			$this._updateSettings($this);
		}).change();		
		
		var fontSize = options.settings.styles.fontSize;
		if (fontSize == 'default') {
			fontSize = options._fontSize;
		}
		var $fontSize = $fbWidget.fontSize('Size', 'form.fontSize', fontSize);
		$("select[id$='form.fontSize']", $fontSize).change(function(event) {
			var value = $(this).val();
			$builderPanel.css('fontSize', value + 'px');
			options.settings.styles.fontSize = value;
			$this._updateSettings($this);
		}).change();		
		
		var $fontPanel = $fbWidget.twoColumns($fontPicker, $fontSize);
		$fontPanel.find('.col2').addClass('noPaddingBottom').css('marginLeft', '60%');
		
		var color = options.settings.styles.color;
		if (color == 'default') {
			color = options._color;
		}
		var backgroundColor = options.settings.styles.backgroundColor;
		if (backgroundColor == 'default') {
			backgroundColor = options._backgroundColor;
		}
		var $colorPanel = $fbWidget.colorPanel(color, backgroundColor, 'form.');
		
		$("input[id$='form.color']", $colorPanel).change(function(event) {
			var value = $(this).attr('title');
			$builderPanel.css('color','#' + value);
			options.settings.styles.color = value;
			$this._updateSettings($this);
		}).change();		

		$("input[id$='form.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).attr('title');
			$builderPanel.css('backgroundColor','#' + value);
			options.settings.styles.backgroundColor = value;
			$this._updateSettings($this);
		}).change();			
		
		$formSettingsLanguageSection.append($fbWidget.oneColumn($name))
		   .append($fbWidget.twoRowsOneRowLayout($heading, $horizontalAlignment, $fontStyles));
		$formSettingsGeneralSection.append($fbWidget.fieldset('Fonts').append($fontPanel))
		   .append($colorPanel);
	 
   },
 _languageChange:function() {
	 $.fb.formbuilder.prototype._log('languageChange(' + $(this).val() + ')');
	  var fbOptions = $.fb.fbWidget.prototype._getFbOptions();
	  var $ctrlHolders = $('.' + $.fb.fbWidget.prototype.options._styleClass + ':visible');
	  var language = $(this).val();
	  var formSettings = fbOptions.settings[language];
	  var $formHeading = $('.formHeading');
	  var $formSettingsLanguageSection = $(fbOptions._formSettingsLanguageSection);
	  var settings, type, $widget, selected;
	  
	  $("input[id$='form.name']", $formSettingsLanguageSection).val(formSettings.name);
	  
	  $("select[id$='form.heading'] option[value='" + formSettings.heading + "']", 
			  $formSettingsLanguageSection).attr('selected', 'true');
	  
	  var $heading = $('<' + formSettings.heading + ' class="heading">' + formSettings.name + '</' + formSettings.heading + '>')
	  .css('fontWeight', formSettings.fontStyles[0] == 1 ? 'bold' : 'normal')
	  .css('fontStyle', formSettings.fontStyles[1] == 1 ? 'italic' : 'normal')
	  .css('textDecoration', formSettings.fontStyles[2] == 1 ? 'underline' : 'none');
	  $('.heading', $formHeading).replaceWith($heading);
	  $.fb.formbuilder.prototype._log('formSettings.fontStyles[2] = ' + formSettings.fontStyles[2]);
	  $("input[id$='form.bold']", $formSettingsLanguageSection).attr('checked', formSettings.fontStyles[0]);
	  $("input[id$='form.italic']", $formSettingsLanguageSection).attr('checked', formSettings.fontStyles[1]);
	  $("input[id$='form.underline']", $formSettingsLanguageSection).attr('checked', formSettings.fontStyles[2]);
	  
	  $formHeading.removeClass('leftAlign centerAlign rightAlign').addClass(formSettings.classes[0]);
	  $("select[id$='form.horizontalAlignment'] option[value='" + formSettings.classes[0] + "']", 
			  $formSettingsLanguageSection).attr('selected', 'true');
	  
		$ctrlHolders.each(function(i) {
		    var $widget = $(this);
		    selected = $widget.attr('class').indexOf($.fb.fbWidget.prototype.options._selectedClass) > -1;
		    settings = $widget.data('fbWidget');
		    type = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].type']").val();
		    $.fb.formbuilder.prototype._log('type = ' + type);
		    $this = $('#' + type).data('fb' + type);
		    $this._languageChange($widget, settings[language], selected);
		});
   },
 _updateSettings: function($this) {
	 	$this._log('_updateSettings = ' + $.toJSON($this.options.settings));
	  $('#settings').val($.toJSON($this.options.settings)).change();
   } ,        
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

$.widget('fb.formbuilder', FormBuilder);