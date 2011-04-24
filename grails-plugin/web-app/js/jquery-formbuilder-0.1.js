/*
* jquery-form-builder-plugin - JQuery WYSIWYG Web Form Builder
* http://code.google.com/p/jquery-form-builder-plugin/
*
* Revision: 124
* Version: 0.1
* Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
*
* Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
*
* Date: Sat Feb 19 18:16:59 GMT+08:00 2011 
*/

/*
 * Main component of JQuery Form Builder plugin, the Form Builder container itself 
 * consists of builder palette contains widgets supported by the form builder and 
 * builder panel where the constructed form display. 
 * 
 * Revision: 124
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 16-Jan-2011
 */

var FormBuilder = {
  options: { // default options. values are stored in prototype
		fields: 'PlainText, SingleLineText',
		tabSelected: 0,
		readOnly: false,
		tabDisabled: [],
		formCounter: 1,
		language: 'en',
		settings: {
			en: {
				name: 'Form',
				classes: ['leftAlign'],
				heading: 'h2',
				styles: {
					fontFamily: 'default', 
					fontSize: 'default',
					fontStyles: [1, 0, 0] // bold, italic, underline					
				}				
			},
			zh_CN: {
				name: '表格',
				classes: ['rightAlign'],
				heading: 'h2',
				styles: {
					fontFamily: 'default', 
					fontSize: 'default',
					fontStyles: [1, 0, 0] // bold, italic, underline					
				}			
			},			
			styles : {
				color : 'default', // browser default
				backgroundColor : 'default'	
			}
		},
		_id: '#container',
		_languages : [ 'en', 'zh_CN' ],
		_builderPanel: '#builderPanel',
		_builderForm: '#builderForm',
		_emptyBuilderPanel: '#emptyBuilderPanel',
		_paletteTabs: '#paletteTabs',
		_standardFieldsPanel: '#standardFields',
		_fancyFieldsPanel: '#fancyFields',
		_fieldSettingsPanel: '#fieldSettings',
    _fieldSettingsLanguageSection: '#fieldSettings fieldset.language:first',
    _fieldSettingsGeneralSection: '#fieldSettings div.general:first',
    _formSettingsLanguageSection: '#formSettings fieldset.language:first',
    _formSettingsGeneralSection: '#formSettings div.general:first',
    _languagesSupportIdGeneration: ['en'],
    _dragBoxCss: {
		  opacity: 0.6,
		  zIndex: 8888, 
		  border: "5px solid #cccccc"
	  },
		_formControls: '#builderPanel fieldset',
		_draggableClass: 'draggable',
		_dropPlaceHolderClass: 'dropPlaceHolder'
  },
  _create: function() {
    	// called on construction
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
		
		$(this.options._paletteTabs).tabs({
			selected: this.options.tabSelected, 
			disabled: this.options.tabDisabled,
			select: this._isFieldSettingsTabCanOpen 
		});
		
		var widgets = this.options.fields;
		widgets = widgets.split(',');
		var length = widgets.length;
		var widgetOptions;
		var widget;
		var i;
	  for (i = 0; i < length; i++) {
		  widgetOptions = $['fb']['fb' + $.trim(widgets[i])].prototype.options;
		  widget = $('<a id="' + widgetOptions._type +  '" href="#" class="fbWidget">' + widgetOptions.name + '</a>');
      widget.button()['fb' + widgetOptions._type]()
      .appendTo(widgetOptions.belongsTo);
      this._initDraggable(widget, widgetOptions._type);
	    }			  
   },
  _initDraggable: function(widget, type) {
	  widget.draggable({
		  cursor: 'move',
		  distance: 10,
		  helper: function (event, ui) {
			  var helper = $(this).data('fb' + type)
			    ._createFbWidget(event).css($.fb.formbuilder.prototype.options._dragBoxCss)
			    .css({width: $('.formHeading').css('width')})
			    .addClass($.fb.formbuilder.prototype.options._draggableClass);
			  return helper;
		} ,
    drag: function(event, ui) {
			var $prevCtrlHolder = $.fb.formbuilder.prototype._getPreviousCtrlHolder(ui);
			var fbOptions = $.fb.formbuilder.prototype.options;
			if ($prevCtrlHolder && $prevCtrlHolder.attr('rel') != ui.helper.attr('rel')) {
				ui.helper.attr('rel', $prevCtrlHolder.attr('rel'));
				$('.' + fbOptions._dropPlaceHolderClass).remove();
			  $('<div></div>').addClass(fbOptions._dropPlaceHolderClass)
			   .css('height', '30px').insertAfter($prevCtrlHolder);		  
			} else {
				var $ctrlHolder = $('.' + $.fb.fbWidget.prototype.options._styleClass + 
						   ':visible:not(.' + fbOptions._draggableClass + '):first');		
				
				if ($ctrlHolder.length && ui.offset.top < $ctrlHolder.offset().top) {
					$('.' + fbOptions._dropPlaceHolderClass).remove();
				}
			} 
         },
    stop: function(event, ui) {
	   $('.' + $.fb.formbuilder.prototype.options._dropPlaceHolderClass).remove();
        }
	  });	   
   },
   _isFieldSettingsTabCanOpen: function(event, ui) { 
		if (ui.index == 1) { // Field Settings tab selected
			var options = $.fb.formbuilder.prototype.options;
			var canOpen = true;
			if ($(options._emptyBuilderPanel).is(':visible')) {
				$(options._standardFieldsPanel).qtip({
					   content: 'No field was created. Please select standard field or fancy field.',
						 position: { my: 'bottom left', at: 'top center' },
							show: {
								event: false,
								ready: true,
								effect: function() { $(this).show('drop', { direction:'up'}); }
							},
							hide: {
								target: $(options._standardFieldsPanel + ', ' + options._fancyFieldsPanel)
							},
							style: {
								widget: true,
								classes: 'ui-tooltip-shadow ui-tooltip-rounded', 
								tip: true
							}								   
			    });
				canOpen = false;
			} else if ($(options._builderForm + ' .' + $.fb.fbWidget.prototype.options._selectedClass).length === 0) {
				$('.' + $.fb.fbWidget.prototype.options._styleClass + ':first').qtip({
					   content: "Please select field below to see it's Field Settings.",
						 position: { my: 'bottom center', at: 'top center' },
							show: {
								event: false,
								ready: true,
								effect: function() { $(this).show('drop', { direction:'up'}); }
							},
							hide: 'click',
							style: {
								widget: true,
								classes: 'ui-tooltip-shadow ui-tooltip-rounded', 
								tip: true
							}								   
			    });	
				canOpen = false;
			}
			if (!canOpen) {
				// activate Add Field tab
				$(this).tabs('select', 0);
			}
			return canOpen;
		} 
	 },
  _initBuilderPanel: function() {
	  this._initFormSettings();
	  if (!this.options.readOnly) {
	    this._initSortableWidgets();
      this._initDroppable();
	  } else {
			$('input:not(div.buttons input, #id)').attr("disabled", true);
			$('select:not(#language)').attr("disabled", true);
			$('textarea').attr("disabled", true);	    	
	    }
	  this._initWidgetsEventBinder();
   },
  _initDroppable: function() {
	  var fbOptions = this.options;
	  var $formControls = $(fbOptions._formControls);
	  $formControls.droppable({
	  	drop: function(event, ui) {
	  		// to make sure the drop event is trigger by draggable instead of sortable
	  		if (ui.helper.attr('class').lastIndexOf(fbOptions._draggableClass) > -1) {
	  			 $('.' + fbOptions._dropPlaceHolderClass).remove();
	  			 var $widget = ui.draggable.data('fb' + ui.draggable.attr('id'));
		    	 var $prevCtrlHolder = $.fb.formbuilder.prototype._getPreviousCtrlHolder(ui);
		    	 var $ctrlHolder = $widget._createFbWidget(event); 
		    	 var $elements;
		    	 if ($prevCtrlHolder) {
	  			   $ctrlHolder.insertAfter($prevCtrlHolder);
	  			   $elements = $prevCtrlHolder.next().nextAll(); // $ctrlHolder.next() not works
	  		   } else {
	  			   $(fbOptions._emptyBuilderPanel + ':visible').hide();
	  			   $elements = $('.' + $.fb.fbWidget.prototype.options._styleClass + 
	  					   ':visible:not(.' + fbOptions._draggableClass + ')', $formControls);
	  				 $formControls.prepend($ctrlHolder).sortable('refresh');				  		        	   
	  		          }
		    	 $ctrlHolder.toggle('slide', {direction: 'up'}, 'slow');

		    	 if ($elements.length) {
						// set next widget's sequence as my sequence
						$.fb.formbuilder.prototype._getSequence($ctrlHolder).val(
						    $.fb.formbuilder.prototype._getSequence($elements.first()).val()).change();
						$elements.each(function(index) {
						  $.fb.formbuilder.prototype._increaseSequence($(this));
						 });
			    	 } 
	  		    }
	  		}  		
	    });	   
   },
  _getPreviousCtrlHolder: function(ui) {
		var $ctrlHolders = $('.' + $.fb.fbWidget.prototype.options._styleClass + 
				   ':visible:not(.' + $.fb.formbuilder.prototype.options._draggableClass + ')');
		var $this, $prevCtrlHolder;
		  
		$ctrlHolders.each(function(i) {
			$this = $(this);
			if (ui.offset.top > $this.offset().top) {
				$prevCtrlHolder = $this;
			} else {
				return false;
			}
		});
		return $prevCtrlHolder;
  },  
  _initFormSettings: function() {
	  var $fbWidget = $.fb.fbWidget.prototype;
	  var options = this.options;
	  var $builderPanel = $(options._builderPanel);
	  var $builderForm = $(options._builderForm);
	  var $formSettingsLanguageSection = $(options._formSettingsLanguageSection);
	  var $formSettingsGeneralSection = $(options._formSettingsGeneralSection);
	  var defaultLanguage = $.inArray(options.language, options._languages) > -1 ? options.language : 'en';
	  var $language = $('#language', $formSettingsLanguageSection).val(defaultLanguage).change(this._languageChange);
	  var settings;
	  var $this = this;
	  var $formHeading = $('.formHeading', $builderPanel);
	  var $settings = $('#settings', $builderForm);
		// first creation
		if ($settings.val() == '') {
			settings = options.settings[$language.val()];
		  for (var i = 0; i < options._languages.length; i++) {
			   options.settings[options._languages[i]].name += ' ' + options.formCounter;
		    }
		  $formHeading.addClass(settings.classes[0]).append('<' + settings.heading + ' class="heading">' + settings.name + '</' + settings.heading + '>');
		  $('#name',$builderForm).val($fbWidget._propertyName(options.settings['en'].name));
		  $this._updateSettings($this);
		} else {
			options.settings = $.parseJSON(unescape($settings.val()));
			settings = options.settings[$language.val()];
		}	  
		
	  
		var $name = $fbWidget._label({ label: 'Name', name: 'form.name' })
		       .append('<input type="text" id="form.name" value="' + settings.name + '" />');
		$('input', $name).keyup(function(event) {
				var value = $(this).val();
				if (!options.disabledNameChange && 
						$.inArray($language.val(), options._languagesSupportIdGeneration) > -1) {
					var name = $fbWidget._propertyName(value);
		      $('#name',$builderForm).val(name).change();
				}
				settings.name = value;
				$(settings.heading, $formHeading).text(value);
				$this._updateSettings($this);
		 });			  
		

		 var $heading = $fbWidget._label({ 
			  label: 'Heading', 
			  name: 'form.heading' 
	    }).append('<select> \
				<option value="h1">Heading 1</option> \
				<option value="h2">Heading 2</option> \
				<option value="h3">Heading 3</option> \
				<option value="h4">Heading 4</option> \
				<option value="h5">Heading 5</option> \
				<option value="h6">Heading 6</option> \
			</select>');
		
		 $('select', $heading)
		    .val(settings.heading)
				.attr('id', 'form.heading') // unable to set value if specify in select tag
	      .change(function(event) {
	    	  var heading = $(this).val();
	    	  var text = $(settings.heading, $formHeading).text();
	    	  var $heading = $('<' + heading + ' class="heading">' + text + '</' + heading + '>');
	    	  if (settings.styles.fontStyles[0] === 0) {
	    		  $heading.css('fontWeight', 'normal');  
	    	  }
	    	  if (settings.styles.fontStyles[1] == 1) {
	    		  $heading.css('fontStyle', 'italic');
	    	  }	    	  
	    	  if (settings.styles.fontStyles[2] == 1) {
	    		  $heading.css('textDecoration', 'underline');
	    	  }	    		    	  
	    	  $(settings.heading, $formHeading).replaceWith($heading);
	    	  settings.heading = heading;
	    	  $this._updateSettings($this);
	            });
				
		var $horizontalAlignment = $fbWidget._horizontalAlignment({ name: 'form.horizontalAlignment', value: settings.classes[0] });
		$('select', $horizontalAlignment).change(function(event) {
					var value = $(this).val();
					$formHeading.removeClass(settings.classes[0]).addClass(value);
					settings.classes[0] = value;
					$this._updateSettings($this);
				});
			
		settings.styles.fontFamily = settings.styles.fontFamily == 'default' ? options._fontFamily : settings.styles.fontFamily;
		settings.styles.fontSize = settings.styles.fontSize == 'default' ? options._fontSize : settings.styles.fontSize;
		var $fontPanel = $fbWidget._fontPanel({ 
			      fontFamily: settings.styles.fontFamily, 
			      fontSize: settings.styles.fontSize, 
            fontStyles: settings.styles.fontStyles, 
            idPrefix: 'form.', nofieldset: true });

		$("input[id$='form.bold']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				$(settings.heading, $formHeading).css('fontWeight', 'bold');
				settings.styles.fontStyles[0] = 1;
			} else {
				$(settings.heading, $formHeading).css('fontWeight', 'normal');
				settings.styles.fontStyles[0] = 0;
			}
			$this._updateSettings($this);
		});
		$("input[id$='form.italic']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				$(settings.heading, $formHeading).css('fontStyle', 'italic');
				settings.styles.fontStyles[1] = 1;
			} else {
				$(settings.heading, $formHeading).css('fontStyle', 'normal');
				settings.styles.fontStyles[1] = 0;
			}
			$this._updateSettings($this);
		});		
		$("input[id$='form.underline']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				$(settings.heading, $formHeading).css('textDecoration', 'underline');
				settings.styles.fontStyles[2] = 1;
			} else {
				$(settings.heading, $formHeading).css('textDecoration', 'none');
				settings.styles.fontStyles[2] = 0;
			}
			$this._updateSettings($this);
		});
		
		$("input[id$='form.fontFamily']", $fontPanel).change(function(event) {
			var value = $(this).val();
			$builderPanel.css('fontFamily', value);
			settings.styles.fontFamily = value;
			$this._updateSettings($this);
		});		
		

		$("select[id$='form.fontSize']", $fontPanel).change(function(event) {
			var value = $(this).val();
			$builderPanel.css('fontSize', value + 'px');
			settings.styles.fontSize = value;
			$this._updateSettings($this);
		});	
				
		if (options.settings.styles.color == 'default') {
			options.settings.styles.color = options._color;
		}
		
		if (options.settings.styles.backgroundColor == 'default') {
			options.settings.styles.backgroundColor = options._backgroundColor;
		}
		var $colorPanel = $fbWidget._colorPanel({ color: options.settings.styles.color, 
			       backgroundColor: options.settings.styles.backgroundColor, idPrefix: 'form.' });
		
		$("input[id$='form.color']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			$builderPanel.css('color','#' + value);
			options.settings.styles.color = value;
			$this._updateSettings($this);
		});		

		$("input[id$='form.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			$builderPanel.css('backgroundColor','#' + value);
			options.settings.styles.backgroundColor = value;
			$this._updateSettings($this);
		});			
		
		$formSettingsLanguageSection.append($fbWidget._oneColumn($name))
		   .append($fbWidget._twoColumns($heading, $horizontalAlignment))
		   .append($fontPanel);
		$formSettingsGeneralSection.append($colorPanel);
	 
   },
 _languageChange:function(event) {
	  var fbOptions = $.fb.fbWidget.prototype._getFbOptions();
	  var $ctrlHolders = $('.' + $.fb.fbWidget.prototype.options._styleClass + ':visible');
	  var language = $(this).val();
	  var languageText = $('option:selected', this).text();
	  var formSettings = fbOptions.settings[language];
	  var $formHeading = $('.formHeading');
	  var $formSettingsLanguageSection = $(fbOptions._formSettingsLanguageSection);
	  var $builderPanel = $(fbOptions._builderPanel);
	  var settings, type, $widget, selected, fb;
	  
	  $("input[id$='form.name']", $formSettingsLanguageSection).val(formSettings.name);
	  
	  $("select[id$='form.heading'] option[value='" + formSettings.heading + "']", 
			  $formSettingsLanguageSection).attr('selected', 'true');
	  
	  var $heading = $('<' + formSettings.heading + ' class="heading">' + formSettings.name + '</' + formSettings.heading + '>')
	  .css('fontWeight', formSettings.styles.fontStyles[0] == 1 ? 'bold' : 'normal')
	  .css('fontStyle', formSettings.styles.fontStyles[1] == 1 ? 'italic' : 'normal')
	  .css('textDecoration', formSettings.styles.fontStyles[2] == 1 ? 'underline' : 'none');
	  $('.heading', $formHeading).replaceWith($heading);
	  $("input[id$='form.bold']", $formSettingsLanguageSection).attr('checked', formSettings.styles.fontStyles[0]);
	  $("input[id$='form.italic']", $formSettingsLanguageSection).attr('checked', formSettings.styles.fontStyles[1]);
	  $("input[id$='form.underline']", $formSettingsLanguageSection).attr('checked', formSettings.styles.fontStyles[2]);
	  
	  $formHeading.removeClass('leftAlign centerAlign rightAlign').addClass(formSettings.classes[0]);
	  $("select[id$='form.horizontalAlignment'] option[value='" + formSettings.classes[0] + "']", 
			  $formSettingsLanguageSection).attr('selected', 'true');
	  
	  formSettings.styles.fontFamily = formSettings.styles.fontFamily == 'default' ? fbOptions._fontFamily : formSettings.styles.fontFamily;
	  formSettings.styles.fontSize = formSettings.styles.fontSize == 'default' ? fbOptions._fontSize : formSettings.styles.fontSize;
		$builderPanel.css('fontFamily', formSettings.styles.fontFamily);
		$builderPanel.css('fontSize', formSettings.styles.fontSize + 'px');
		$("select[id$='form.fontSize']", $formSettingsLanguageSection).val(formSettings.styles.fontSize);
		$('.fontPicker', $formSettingsLanguageSection).fontPicker('fontFamily', formSettings.styles.fontFamily);
		
		$ctrlHolders.each(function(i) {
		    var $widget = $(this);
		    selected = $widget.attr('class').indexOf($.fb.fbWidget.prototype.options._selectedClass) > -1;
		    if (selected) {
		    	$(fbOptions._fieldSettingsLanguageSection + ' legend').text('Language: ' + languageText);
		       }
			  if (!$widget.data('fbWidget')) { // widgets loaded from server
					var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
					// settings is JavaScript encoded when return from server-side
					$widget.data('fbWidget', $.parseJSON(unescape($settings.val())));
				}		    
		    settings = $widget.data('fbWidget');
		    type = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].type']").val();
		    $this = $('#' + type).data('fb' + type);
		    fb = {target: $this, item: $widget, settings: settings[language]};
		    fb.item.selected = selected;
		    if (selected) { // refresh field settings tab
		      $this._createFieldSettings(event, $widget); 
		        }
		    $this._languageChange(event, fb);
		});
   },
 _updateSettings: function($this) {
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
			  $ctrlHolders.find(".closeButton").click($.fb.fbWidget.prototype._deleteWidget)
			    .mouseover(function () { $('span', this).removeClass('ui-icon-close').addClass('ui-icon-circle-close'); }) 
			    .mouseout(function () { $('span', this).removeClass('ui-icon-circle-close').addClass('ui-icon-close'); });
			}
		}
  },
  _initSortableWidgets: function() {
	  var $formControls = $(this.options._formControls);
	  $formControls.sortable({ 
			axis: 'y',
			cursor: 'move',
			distance: 10,
			helper: function (event, ui) {
				return $(ui).clone().css($.fb.formbuilder.prototype.options._dragBoxCss);
			},
			start: function (event, ui) {
				var $previousElement = $(ui.item).prev();
				if ($previousElement.attr('rel')) {
					ui.item.prevIndex = $previousElement.attr('rel');
					ui.item.originalOffsetTop = $previousElement.offset().top;
				}
			},
			update: $.fb.formbuilder.prototype._updateSequence
			});
		
		// Making text elements, or elements that contain text, not text-selectable.
	  $formControls.disableSelection();	  
  },
  _updateSequence: function (event, ui) {
		var $uiItem = $(ui.item);
		var $elements;
		var moveDown = ui.offset.top > ui.item.originalOffsetTop;
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
    }
};

$.widget('fb.formbuilder', FormBuilder);/*
 * Color picker created based on the work of Andreas Lagerkvist (andreaslagerkvist.com)
 * at http://andreaslagerkvist.com/jquery/colour-picker/ and customized for 
 * JQuery Form Builder plugin project at http://code.google.com/p/jquery-form-builder-plugin/
 * 
 * Revision: 124
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 16-Jan-2011
 */

var ColorPicker = {
	options : { // default options. values are stored in widget's prototype
		name: 'jquery-color-picker',
		value: '',
		ico:		  'ico.gif',				// SRC to color-picker icon
		disabledIco: 'ico.gif',
		title:		'Pick a colour',		// Default dialogue title
		inputBG:	true,					// Whether to change the input's background to the selected colour's
		showColorCode: false, // whether to display 6 digits color code in text box, value stored in title attr.
		speed:		500,					// Speed of dialogue-animation
		openTxt:	'Open colour picker',
		type: 'basic',  // color picker panel type: 'basic', 'webSafe' and 'custom' supported
		width: 180,
		basicColors: ["ffffff","ffccc9", "ffce93", "fffc9e", "ffffc7",
             "9aff99", "96fffb", "cdffff", "cbcefb", "cfcfcf",
             "fd6864", "fe996b", "fffe65", "fcff2f", "67fd9a",
             "38fff8", "68fdff", "9698ed", "c0c0c0", "fe0000",
             "f8a102", "ffcc67", "f8ff00", "34ff34", "68cbd0",
             "34cdf9", "6665cd", "9b9b9b", "cb0000", "f56b00",
             "ffcb2f", "ffc702", "32cb00", "00d2cb",  "3166ff",
             "6434fc", "656565", "9a0000", "ce6301", "cd9934",
             "999903", "009901", "329a9d", "3531ff", "6200c9",
                          "343434", "680100",  "963400", "986536", "646809",
             "036400",  "34696d", "00009b",  "303498", "000000",
                          "330001",  "643403", "663234", "343300", "013300", 
                          "003532", "010066", "340096"],
	  webSafeColors: ["000000","000033","000066","000099","0000CC","0000FF",
	                  "003300","003333","003366","003399","0033CC",
	                  "0033FF","006600","006633","006666","006699",
	                  "0066CC","0066FF","009900","009933","009966",
	                  "009999","0099CC","0099FF","00CC00","00CC33",
	                  "00CC66","00CC99","00CCCC","00CCFF","00FF00",
	                  "00FF33","00FF66","00FF99","00FFCC","00FFFF",
	                  "330000","330033","330066","330099","3300CC",
	                  "3300FF","333300","333333","333366","333399",
	                  "3333CC","3333FF","336600","336633","336666",
	                  "336699","3366CC","3366FF","339900","339933",
	                  "339966","339999","3399CC","3399FF","33CC00",
	                  "33CC33","33CC66","33CC99","33CCCC","33CCFF",
	                  "33FF00","33FF33","33FF66","33FF99","33FFCC",
	                  "33FFFF","660000","660033","660066","660099",
	                  "6600CC","6600FF","663300","663333","663366",
	                  "663399","6633CC","6633FF","666600","666633",
	                  "666666","666699","6666CC","6666FF","669900",
	                  "669933","669966","669999","6699CC","6699FF",
	                  "66CC00","66CC33","66CC66","66CC99","66CCCC",
	                  "66CCFF","66FF00","66FF33","66FF66","66FF99",
	                  "66FFCC","66FFFF","990000","990033","990066",
	                  "990099","9900CC","9900FF","993300","993333",
	                  "993366","993399","9933CC","9933FF","996600",
	                  "996633","996666","996699","9966CC","9966FF",
	                  "999900","999933","999966","999999","9999CC",
	                  "9999FF","99CC00","99CC33","99CC66","99CC99",
	                  "99CCCC","99CCFF","99FF00","99FF33","99FF66",
	                  "99FF99","99FFCC","99FFFF","CC0000","CC0033",
	                  "CC0066","CC0099","CC00CC","CC00FF","CC3300",
	                  "CC3333","CC3366","CC3399","CC33CC","CC33FF",
	                  "CC6600","CC6633","CC6666","CC6699","CC66CC",
	                  "CC66FF","CC9900","CC9933","CC9966","CC9999",
	                  "CC99CC","CC99FF","CCCC00","CCCC33","CCCC66",
	                  "CCCC99","CCCCCC","CCCCFF","CCFF00","CCFF33",
	                  "CCFF66","CCFF99","CCFFCC","CCFFFF","FF0000",
	                  "FF0033","FF0066","FF0099","FF00CC","FF00FF",
	                  "FF3300","FF3333","FF3366","FF3399","FF33CC",
	                  "FF33FF","FF6600","FF6633","FF6666","FF6699",
	                  "FF66CC","FF66FF","FF9900","FF9933","FF9966",
	                  "FF9999","FF99CC","FF99FF","FFCC00","FFCC33",
	                  "FFCC66","FFCC99","FFCCCC","FFCCFF","FFFF00",
	                  "FFFF33","FFFF66","FFFF99","FFFFCC","FFFFFF"],
		customColors:[],
		disabled: false
	},
	_init : function() {
		// called on construction and re-initialization
		var ico = this.options.disabled ? this.options.disabledIco : this.options.ico;
		// Add the colour-picker dialogue if not added
		this.element.append('<input type="text" id="' + this.options.name + '" name="' + this.options.name + '" /> \
				<a class="floatLeft" href="#" rel="' + this.options.name + '"> \
				<img border="0" src="' + ico + '" alt="' + this.options.openTxt + '"/></a>');
		var $colorPickerInput = $('input', this.element).attr('readonly', true);
		var $this = this.element.data('colorPicker');
		var id = "colorpicker_" + this.options.type;
		
		if ($this.options.showColorCode) {
			  $colorPickerInput.val(this.options.value);
	  } else {
				$colorPickerInput.attr('disabled', 'true');
		}
		
		$colorPickerInput.data('colorPicker', { color: this.options.value });
		
		var $colorPickerPanel = $('#' + id);

		if ($colorPickerPanel.length == 0 && !this.options.disabled) {
			var loc = '';
			var colors = this.options[this.options.type + 'Colors'];
			var color;
			for (var i = 0; i < colors.length; i++) {
				color = colors[i];
		    if (color!='')
					loc += '<li><a href="#" title="' 
							+ color 
							+ '" rel="' 
							+ color 
							+ '" style="background: #' 
							+ color 
							+ '; color: ' 
							+ this._hexInvert(color) 
							+ ';">' 
							+ color 
							+ '</a></li>';		
			}			
			var heading	= this.options.title ? '<h2>' + this.options.title + '</h2>' : '';
			$colorPickerPanel = $('<div id="' + id + '" class="colorPicker">' + heading + '<ul>' + loc + '</ul>' + '</div>').appendTo(document.body).hide();
	
			// Remove the colour-picker panel if you click outside it (on body)
			$(document.body).click(function(event) {
				if (!($(event.target).is('.colorPicker') || $(event.target).parents('.colorPicker').length)) {
					$colorPickerPanel.hide($this.options.speed);
				}
			});
		}

		if (this.options.inputBG) {
			var colorCode = this.options.value;
			if (colorCode.length == 6) colorCode = '#' + colorCode;
			$colorPickerInput.css({background: colorCode, color: '#' + this._hexInvert(colorCode)});
		}		
		
		if (!this.options.disabled) {
			var $colorPickerIcon = $('a', this.element);
			$colorPickerIcon.click(function () {
				// Show the colour-picker next to the icon and fill it with the colours in the select that used to be there
				var iconPos	= $colorPickerIcon.offset();	
				$colorPickerPanel.css({
					position: 'absolute', 
					left: iconPos.left + 'px', 
					top: iconPos.top + 'px',
					width: $this.options.width + 'px'
				}).show($this.options.speed).attr('rel', $colorPickerIcon.attr('rel'));
				return false;
			});
		}

		// When you click a color in the color picker panel
		$('a', $colorPickerPanel).click(function (event) {
			// The hex is stored in the link's rel-attribute
			  var $colorInput = $("input[id$='" + $colorPickerPanel.attr('rel') + "']");
				var hex = $(this).attr('rel');
				var options = $colorInput.parent().data('colorPicker').options;
				if (options.showColorCode) {
					$colorInput.val(hex);
				} 
					
				$colorInput.data('colorPicker', { color: hex });

				// If user wants to, change the input's BG to reflect the newly selected colour
				if (options.inputBG) {
					$colorInput.css({background: '#' + hex, color: '#' + $this._hexInvert(hex)});
				}

				// Trigger change-event on input
				$colorInput.change();

			  // Hide the colour-picker and return false
			  $colorPickerPanel.hide($this.options.speed);
			  event.stopImmediatePropagation();
			  return false;
		});

	},
	// logging to the firebug's console, put in 1 line so it can be removed
	// easily for production
	_hexInvert: function (hex) {
		var r = hex.substr(0, 2);
		var g = hex.substr(2, 2);
		var b = hex.substr(4, 2);

		return 0.212671 * r + 0.715160 * g + 0.072169 * b < 0.5 ? 'ffffff' : '000000';
	}
};

$.widget('fb.colorPicker', ColorPicker);/*
 * This font picker created based on the work of Sergey Alekseyev
 * at http://plugins.jquery.com/project/fontpicker-regios and customized for 
 * JQuery Form Builder plugin project at http://code.google.com/p/jquery-form-builder-plugin/
 * 
 * Revision: 124
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 20-Jan-2011
 */

var FontPicker = {
	fonts: new Array(
				'Arial,Arial,Helvetica,sans-serif',
				'Arial Black,Arial Black,Gadget,sans-serif',
				'Comic Sans MS,Comic Sans MS,cursive',
				'Courier New,Courier New,Courier,monospace',
				'Georgia,Georgia,serif',
				'Impact,Charcoal,sans-serif',
				'Lucida Console,Monaco,monospace',
				'Lucida Sans Unicode,Lucida Grande,sans-serif',
				'Palatino Linotype,Book Antiqua,Palatino,serif',
				'Tahoma,Geneva,sans-serif',
				'Times New Roman,Times,serif',
				'Trebuchet MS,Helvetica,sans-serif',
				'Verdana,Geneva,sans-serif' ),		
	options : { // default options. values are stored in widget's prototype
	  defaultFont: 'Tahoma',              // default font to display in selector
		id:			 'fontbox',				// id of font picker container
		name:    'fontPickerInput',
		selClass:		 'fontPicker',		// class of font selector field
		fontclass:   'singlefont',			// class for the font divs
		speed:		 100,					// speed of dialog animation, default is fast
		hoverColor:  '#efefff',				// background color of font div on mouse hover
		bgColor:     '#ffffee',              // regular background color of font div
		disabled: false
	},
	// logging to the firebug's console, put in 1 line so it can be removed
	// easily for production
	_init : function() {
		var options = this.options;
		var fontPicker = $('#' + options.id);		
		this.element.parent().append('<input type="hidden" id="' + options.name + '" />');
		if (!fontPicker.length && !options.disabled) {
			fontPicker = $('<div id="'+options.id+'" ></div>').appendTo(document.body).hide();

			/* add individual font divs to fontbox */
			$.each(this.fonts, function(i, item) {
				
				fontPicker.append('<div class="singlefont" onmouseover="this.style.backgroundColor=\''+options.hoverColor
				+'\'" onmouseout="this.style.backgroundColor=\''+options.bgColor+'\'" style="font-family: '+item+';" value="' + item + '"> ' + item.split(',')[0] + '</div>');
			});
			
			// Remove the font-picker if you click outside it (on body)
			$(document.body).click(function(event) {									
					if ($(event.target).is('.'+options.selClass) || $(event.target).is('#'+options.id)) return;					
					fontPicker.slideUp(options.speed);		
			});
		}
		
    if (!options.disabled) {
			this.element.click(function () {
				// toggle the font picker 
				if (fontPicker.is(':hidden'))
				{
					var $this = $(this);
					fontPicker.css({
						position: 'absolute', 
						left: $this.offset().left + 'px', 
						top: ($this.offset().top + $this.height() + 3) + 'px'
					}).attr('rel', $this.attr('rel')); 			
					fontPicker.slideDown(options.speed);
				}
				else
					fontPicker.slideUp(options.speed);		
			});
       }
		// select initial value
		if (options.defaultFont.length)
		{
			this.fontFamily(options.defaultFont);
		}
		
		$('.'+options.fontclass).click(function(event) {
			var $this = $(this);
			var $fontPickerInput = $("input[id$='" + $this.parent().attr('rel') + "']");
			var fontFamily = $this.attr('value');	

			$fontPickerInput.prev().text($this.text()).css('fontFamily', fontFamily);
			$fontPickerInput.val(fontFamily).change();
			fontPicker.slideUp(options.speed);
		  event.stopImmediatePropagation();
		});

	},
	fontFamily : function(value) {
	   var fontFamilyValue = value.replace(/'/gi, ''); // remove single quote for chrome browser
		 var fontFamilyText = fontFamilyValue.split(',', 1)[0]; // taking the 1st font type
		 this.element.text(fontFamilyText).css('fontFamily', fontFamilyValue);
		 $('input', this.element.parent()).val(fontFamilyValue);
	}
};

$.widget('fb.fontPicker', FontPicker);/*
 * Base widget plugin of JQuery Form Builder plugin, all Form Builder widgets should extend from this plugin. 
 * 
 * Revision: 124
 * Version: 0.1
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
	_create: function() {
    },
  _init: function() {
    this.element.click(this._createFbWidget);
    },        
	destroy: function() {
	  this.element.button('destroy');

	  // call the base destroy function.
		$.Widget.prototype.destroy.call(this);

    },
  _getFbOptions: function() {
	  return $($.fb.formbuilder.prototype.options._id).formbuilder('option');  
  },
  _getFbLocalizedSettings: function() {
	  return $($.fb.formbuilder.prototype.options._id).formbuilder('option').settings[$('#language').val()];  
  },  
  _createField: function(name, widget, options, settings) {
	  var fbOptions = $.fb.formbuilder.prototype.options;
	  var index = $('#builderForm div.ctrlHolder').size();
	  
	  $('<a class="ui-corner-all closeButton" href="#"><span class="ui-icon ui-icon-close">delete this widget</span></a>')
	  .prependTo(widget).click($.fb.fbWidget.prototype._deleteWidget)
	  .mouseover(function () { $('span', this).removeClass('ui-icon-close').addClass('ui-icon-circle-close'); }) 
	  .mouseout(function () { $('span', this).removeClass('ui-icon-circle-close').addClass('ui-icon-close'); });
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
	  if ($widget.parent().find('input:first').val() != 'null') {
	    $widget.parent().find('input:last').val('U');
	    }
  },
	_createFbWidget: function(event) {
		var $this;
		if (this.options) { // from draggable, event.type == 'mousedown'
			$this = this;
		} else { // from click event
			var type = 'fb' + $(this)['fbWidget']('option', '_type');
			$this = $(this).data(type);
		}
		// Clone an instance of plugin's option settings.
		// From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
		var settings = jQuery.extend(true, {}, $this.options.settings); 
		var counter = $this._getCounter($this);
		var languages = $this.options._languages;
		for (var i=0; i < languages.length; i++) {
			settings[languages[i]][$this.options._counterField] += ' ' + counter;
		}
		var $ctrlHolder = $('<div class="' + $this.options._styleClass + '"></div>').hide();
		// store settings to be used in _createFieldSettings() and _languageChange()
		$ctrlHolder.data('fbWidget', settings); 
		var fb = {target: $this, item: $ctrlHolder, settings: settings[$('#language').val()], _settings: settings};
		var $widget = $this._getWidget(event, fb);
		$ctrlHolder.append($widget);
		if (event.type == 'click' || event.type == 'drop') {
			var name = $this._propertyName($this.options._type + counter);
			$widget.click($this._createFieldSettings);
			$this._createField(name, $ctrlHolder, $this.options, settings);
			if (event.type == 'click') {
				$($.fb.formbuilder.prototype.options._formControls).append($ctrlHolder).sortable('refresh');				
				$ctrlHolder.toggle('slide', {direction: 'up'}, 'slow');
				$this._scroll(event);
				event.preventDefault();
			} else {
				return $ctrlHolder;
			}
		} else {
			return $ctrlHolder.show();
		}
    },
  _scroll: function(event) {
		 var $builderPanel = $($.fb.formbuilder.prototype.options._builderPanel); 
		 var minHeight = $builderPanel.css('minHeight');
		 var height = $builderPanel.css('height');
		 minHeight = minHeight.substring(0, minHeight.lastIndexOf('px')) * 1;
		 height = height.substring(0, height.lastIndexOf('px')) * 1;
		 
		 if (height > minHeight) {
			 var y = height - minHeight;
			 //window.scrollTo(0, y);
			 // From: http://tympanus.net/codrops/2010/06/02/smooth-vertical-or-horizontal-page-scrolling-with-jquery/
			 $('html, body').stop().animate({
				 scrollTop: y
			 }, 1500,'easeInOutExpo');			 
		 }
    },
  _createFieldSettings: function(event, $widget) { 
	  if (!$widget) { // calling from click event
		  $widget = $(this);
	    }
		var selectedClass = $.fb.fbWidget.prototype.options._selectedClass;
		$widget = $widget.attr('class').indexOf($.fb.fbWidget.prototype.options._styleClass) > -1 ? $widget : $widget.parent();
		$widget.parent().find('.' + selectedClass).removeClass(selectedClass);
		$widget.addClass(selectedClass);
		var type = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].type']").val();
		var $this = $('#' + type).data('fb' + type);
		var fbOptions = $this._getFbOptions();
		
		if (!$widget.data('fbWidget')) { // widgets loaded from server
			var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
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
		var $generalSection = $(fbOptions._fieldSettingsGeneralSection); 
		// remote all child nodes
		$generalSection.children().remove();  	
		for (var i=0; i<fieldSettings.length; i++) {
		  $generalSection.append(fieldSettings[i]);
		}
		
		if (fbOptions.readOnly) {
		  var $fieldSettingsPanel = $(fbOptions._fieldSettingsPanel);
		  $('input', $fieldSettingsPanel).attr("disabled", true);
		  $('select', $fieldSettingsPanel).attr("disabled", true);
		  $('textarea', $fieldSettingsPanel).attr("disabled", true);
		}
		
		if (event.type == 'click') {
		  // activate field settings tab
		  $(fbOptions._paletteTabs).tabs('select', 1);
		
		  // highlight and select the 1st input component
		  $('input:first', $fieldSettingsPanel).select();	
		}
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
					    	if (widgetCounter > counter) {
					    		counter = widgetCounter;
					    	}
					    }
					});
					if (widgetCounter > 0) counter++;
		     }
		  return counter;
	},    
  _updateSettings: function($widget) {
	  var settings = $widget.data('fbWidget');
  	var $settings = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].settings']");
  	$settings.val($.toJSON(settings)).change();
   	} ,          
  _updateName: function($widget, value) {
	  var fbOptions = this._getFbOptions();
	  // disabledNameChange option for edit view.
	  var disabledNameChange = fbOptions.disabledNameChange;
	  var index = $widget.attr('rel');
	  if (disabledNameChange) { 
		  // disabledNameChange apply for fields loaded from server-side only
		  disabledNameChange = $widget.find("input[id$='fields[" + index + "].id']").val() != 'null';
	  }
		if (!disabledNameChange && 
				$.inArray($('#language').val(), fbOptions._languagesSupportIdGeneration) > -1) {
			var name = this._propertyName(value);
			$widget.find("input[id$='fields[" + index + "].name']").val(name).change();
		}
    } ,
  _threeColumns: function($e1, $e2, $e3) {
  	  return $('<div class="threeCols"></div>')
  	        .append($e1.addClass('col1'))
  	        .append($e2.addClass('col2'))
  	        .append($e3.addClass('col3'));
   	} ,        
  _twoColumns: function($e1, $e2) {
	  return $('<div class="twoCols"></div>')
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
		var $colorPicker;
		if (options.label) {
			$colorPicker = this._label(options);	
		} else {
			$colorPicker = $('<div></div>');
		}
		
 		if (!options.type || options.type == 'basic') {
			$colorPicker.colorPicker({
				name: options.name,
				value: options.value,
				ico: '../images/jquery.colourPicker.gif',
				disabledIco: '../../images/jquery.colourPicker.disabled.gif',				
			  title: 'Basic Colors',
			  disabled: this._getFbOptions().readOnly
			});		
		} else {
			$colorPicker.colorPicker({
				name: name,
				value: value,
				ico: '../images/jquery.colourPicker.gif',				
				disabledIco: '../../images/jquery.colourPicker.disabled.gif',	
			  title: 'Web Safe Colors',
			  type: 'webSafe',
			  width: 360,
			  disabled: this._getFbOptions().readOnly
			});		
		}
	  return $colorPicker;
 	},
 	_fontPicker: function(options) {
 		var o = $.extend({}, options);
 		o.value = o.value != 'default' ? o.value : this._getFbOptions()._fontFamily;
 		if (!o.label) o.label = 'Font';
		var $fontPicker = this._label(o).append('<div class="fontPicker" rel="' + o.name + '"></div>'); 		

		$('.fontPicker', $fontPicker).fontPicker({ 
			name: o.name,
			defaultFont: o.value,
			disabled: this._getFbOptions().readOnly
		});
 		return $fontPicker;
 	},	
 	_fontSize: function(options) {
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
  _twoRowsOneRow: function(row1col1, row2col1, row1col2) {
	  var $twoRowsOneRow = $('<div class="twoRowsOneRow"> \
			    <div class="row1col1"> \
			      <div class="row2col1"> \
			      </div> \
			    </div> \
			    <div class="row1col2"> \
			    </div> \
			  </div>');
		$('.row1col1',$twoRowsOneRow).prepend(row1col1);
		$('.row2col1',$twoRowsOneRow).append(row2col1);
		$('.row1col2',$twoRowsOneRow).append(row1col2);			    
		return $twoRowsOneRow;	    
  },
  _fieldset: function(options) {
	  return $('<fieldset><legend>' + options.text + '</legend></fieldset>');
  },
  _fontPanel:function(options) {
	  //fontFamily, fontSize, styles.fontStyles
	  var idPrefix = options.idPrefix ? options.idPrefix : '';
	  var names = [idPrefix + 'bold', idPrefix + 'italic', idPrefix + 'underline'];
	  var fontPanel = this._twoRowsOneRow(
			  this._fontPicker({ name: idPrefix + 'fontFamily', value: options.fontFamily }),
			  this._fontSize({ label: 'Size', name: idPrefix + 'fontSize', value: options.fontSize }),
			  this._fontStyles({ names: names, checked: options.fontStyles }).css('paddingLeft', '2em')
	    );
	  if (options.nofieldset)
		  return fontPanel;
	  else
	    return this._fieldset({ text: 'Fonts' }).append(fontPanel);
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
  //label.color, label.backgroundColor, value.color, value.backgroundColor, description.color, description.backgroundColor
  _labelValueDescriptionColorPanel: function(options) {
	  var o = $.extend({}, options);
	  var fbStyles = this._getFbOptions().settings.styles;
	  if (o.label.color == 'default') {
		  o.label.color = fbStyles.color;
	    } 	  
	  if (o.label.backgroundColor == 'default') {
		  o.label.backgroundColor = fbStyles.backgroundColor;
	    } 	 
	  if (o.description.color == 'default') {
		  o.description.color = fbStyles.color;
	    } 	  
	  if (o.description.backgroundColor == 'default') {
		  o.description.backgroundColor = fbStyles.backgroundColor;
	    } 	 	  
	  var $colorPanel = this._fieldset({ text: 'Colors' })
	  .append(this._threeColumns($('<div></div>'), $('<div>Text</div>'), $('<div>Background</div>')).css('paddingBottom', '2px'))
		.append(this._threeColumns($('<div>Label</div>'),
				    this._colorPicker({ name: 'field.label.color', value: o.label.color }),
			      this._colorPicker({ name: 'field.label.backgroundColor', value: o.label.backgroundColor })))
		.append(this._threeColumns($('<div>Value</div>'),
				    this._colorPicker({ name: 'field.value.color', value: o.value.color }),
			      this._colorPicker({ name: 'field.value.backgroundColor', value: o.value.backgroundColor })))
		.append(this._threeColumns($('<div>Description</div>'),
				    this._colorPicker({ name: 'field.description.color', value: o.description.color }),
			      this._colorPicker({ name: 'field.description.backgroundColor', value: o.description.backgroundColor })));
	  $colorPanel.css('paddingTop', '0.5em');
	  $('input', $colorPanel).addClass('floatClearLeft');
	  $('.col1', $colorPanel).css('verticalAlign', 'top');
	  return $colorPanel;
  },
  _getWidget: function(event, fb) {
   },
  _getFieldSettingsLanguageSection: function(event, fb) {
	},
	_getFieldSettingsGeneralSection: function(event, fb) {
	} , 
	_languageChange : function(event, fb) {
	}
};

$.widget('fb.fbWidget', FbWidget);/*
 * JQuery Form Builder - Plain Text plugin.
 * 
 * Revision: 124
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
		_languages : [ 'en', 'zh_CN' ],
		settings : {
			en : {
				text : 'Plain Text',
				classes : [ 'leftAlign', 'topAlign' ],
				styles: {
					fontFamily: 'default', // form builder default
					fontSize: 'default',
					fontStyles: [0, 0, 0] // bold, italic, underline					
				}
			},
			zh_CN : {
				text : '无格式文字',
				classes : [ 'rightAlign', 'middleAlign' ],
				styles: {
					fontFamily: 'default', // form builder default
					fontSize: 'default',
					fontStyles: [0, 0, 0] // bold, italic, underline					
				}				
			},
			styles : {
				color : 'default',
				backgroundColor : 'default'
			}
		}
	},
	_init : function() {
		$.fb.fbWidget.prototype._init.call(this); 
		this.options = $.extend({}, $.fb.fbWidget.prototype.options, this.options);
	},
	_getWidget : function(event, fb) {
		fb.item.addClass(fb.settings.classes[1]); // vertical alignment
		return $(fb.target.options._html).text(fb.settings.text)
				.addClass(fb.settings.classes[0]);
	},
	_getFieldSettingsLanguageSection : function(event, fb) {
		var $text = fb.target._label({ label: 'Text', name: 'field.text', 
			                 description: 'Text entered below will display in the form.' })
		           .append('<input type="text" id="field.text" />');
				$('input', $text).val(fb.settings.text)
				.keyup(function(event) {
					var value = $(this).val();
					fb.item.find('div.PlainText').text(value);
					fb.settings.text = value;
					fb.target._updateSettings(fb.item);
				});
		var $verticalAlignment = fb.target._verticalAlignment({name: 'field.verticalAlignment', value: fb.settings.classes[1]})
        .change(function(event) {
        	// $(this).val() not work for select id that has '.'
					var value = $('option:selected', this).val(); 
					fb.item.removeClass(fb.settings.classes[1]).addClass(value);
					fb.settings.classes[1] = value;
					fb.target._updateSettings(fb.item);
				});
		var $horizontalAlignment = fb.target._horizontalAlignment({ name: 'field.horizontalAlignment', value: fb.settings.classes[0] })
				   .change(function(event) {
							var $text = fb.item.find('div.PlainText');
							var value = $('option:selected', this).val();
							$text.removeClass(fb.settings.classes[0]).addClass(value);
							fb.settings.classes[0] = value;
							fb.target._updateSettings(fb.item);
						});
		
    var styles = fb.settings.styles;
    var fbStyles = fb.target._getFbLocalizedSettings().styles;
    var fontFamily = styles.fontFamily != 'default' ? styles.fontFamily : fbStyles.fontFamily ;
	  var fontSize = styles.fontSize != 'default' ? styles.fontSize : fbStyles.fontSize;	  
		var $fontPanel = fb.target._fontPanel({ fontFamily: fontFamily, fontSize: fontSize, 
				                           fontStyles: styles.fontStyles, idPrefix: 'field.', nofieldset: true });
		
		$("input[id$='field.bold']", $fontPanel).change(function(event) {
			var item = fb.item.find('.PlainText');
			if ($(this).attr('checked')) {
				item.css('fontWeight', 'bold');
				styles.fontStyles[0] = 1;
			} else {
				item.css('fontWeight', 'normal');
				styles.fontStyles[0] = 0;
			}
			fb.target._updateSettings(fb.item);
		});
		$("input[id$='field.italic']", $fontPanel).change(function(event) {
			var item = fb.item.find('.PlainText');
			if ($(this).attr('checked')) {
				item.css('fontStyle', 'italic');
				styles.fontStyles[1] = 1;
			} else {
				item.css('fontStyle', 'normal');
				styles.fontStyles[1] = 0;
			}
			fb.target._updateSettings(fb.item);
		});	
		$("input[id$='field.underline']", $fontPanel).change(function(event) {
			var item = fb.item.find('.PlainText');
			if ($(this).attr('checked')) {
				item.css('textDecoration', 'underline');
				styles.fontStyles[2] = 1;
			} else {
				item.css('textDecoration', 'none');
				styles.fontStyles[2] = 0;
			}
			fb.target._updateSettings(fb.item);
		});
		
		$("input[id$='field.fontFamily']", $fontPanel).change(function(event) {
			var value = $(this).val();
			fb.item.find('.PlainText').css('fontFamily', value);
			styles.fontFamily = value;
			fb.target._updateSettings(fb.item);
		});		
		
		$("select[id$='field.fontSize']", $fontPanel).change(function(event) {
			var value = $(this).val();
			fb.item.find('.PlainText').css('fontSize', value + 'px');
			styles.fontSize = value;
			fb.target._updateSettings(fb.item);
		});		
		
		return [fb.target._oneColumn($text),
				fb.target._twoColumns($horizontalAlignment, $verticalAlignment), $fontPanel];
	},
	_getFieldSettingsGeneralSection : function(event, fb) {
    var styles = fb.settings.styles;
    var fbStyles = fb.target._getFbOptions().settings.styles;
    var color = styles.color != 'default' ? styles.color : fbStyles.color;
	  var backgroundColor = styles.backgroundColor != 'default' ? styles.backgroundColor : fbStyles.backgroundColor;
		var $colorPanel = fb.target._colorPanel({ color: color, backgroundColor: backgroundColor, idPrefix: 'field.' });
	  		
		$("input[id$='field.color']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			fb.item.css('color','#' + value);
			styles.color = value;
			fb.target._updateSettings(fb.item);
		});		

		$("input[id$='field.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			fb.item.css('backgroundColor','#' + value);
			styles.backgroundColor = value;
			fb.target._updateSettings(fb.item);
		});			
		return [$colorPanel];
	}, 
	_languageChange : function(event, fb) {
	  var styles = fb.settings.styles;
	  var fbStyles = fb.target._getFbLocalizedSettings().styles;
	  var fontFamily = styles.fontFamily != 'default' ? styles.fontFamily : fbStyles.fontFamily;
	  var fontSize = styles.fontSize != 'default' ? styles.fontSize : fbStyles.fontSize;
		fb.item.find('.PlainText').text(fb.settings.text)
		       .removeClass('leftAlign centerAlign rightAlign')
		       .addClass(fb.settings.classes[0]);
		fb.item.css('fontWeight', styles.fontStyles[0] == 1 ? 'bold' : 'normal')
	         .css('fontStyle', styles.fontStyles[1] == 1 ? 'italic' : 'normal')
	         .css('textDecoration', styles.fontStyles[2] == 1 ? 'underline' : 'none')
		       .css('fontFamily', fontFamily)
		       .css('fontSize', fontSize + 'px')	         
		       .removeClass('topAlign middleAlign bottomAlign')
		       .addClass(fb.settings.classes[1]);
	}
});

$.widget('fb.fbPlainText', FbPlainText);
/*
 * JQuery Form Builder - Single Line Text plugin.
 * 
 * Revision: 124
 * Version: 0.1
 * Copyright 2011 Lim Chee Kin (limcheekin@vobject.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: 10-Feb-2011
 */

var FbSingleLineText = $.extend({}, $.fb.fbWidget.prototype, {
	options: { // default options. values are stored in widget's prototype
		name: 'Single Line Text',
		belongsTo: $.fb.formbuilder.prototype.options._standardFieldsPanel,
		_type: 'SingleLineText',
		_html : '<div><label><em></em><span></span></label> \
		      <input type="text" class="textInput" /> \
	        <p class="formHint"></p></div>',
		_counterField: 'label',
		_languages: [ 'en', 'zh_CN' ],
		settings: {
			en: {
				label: 'Single Line Text',
				value: '',
				description: '',
				styles: {
					fontFamily: 'default', // form builder default
					fontSize: 'default',
					fontStyles: [0, 0, 0] // bold, italic, underline					
				}				
			},
			zh_CN : {
				label: '单行文字输入',
				value: '',
				description: '',				
				styles: {
					fontFamily: 'default', // form builder default
					fontSize: 'default',
					fontStyles: [0, 0, 0] // bold, italic, underline					
				}				
			},
			_persistable: true,
			required: true,
			restriction: 'no',
			styles : {
				label: {
				  color : 'default',
				  backgroundColor : 'default'
				},
			  value: {
				  color : 'default',
				  backgroundColor : 'default'
				},
				description: {
					color : '777777',
					backgroundColor : 'default'
			    }				
			}
		}
	},
	_init : function() {
		// calling base plugin init
		$.fb.fbWidget.prototype._init.call(this);
		// merge base plugin's options
		this.options = $.extend({}, $.fb.fbWidget.prototype.options, this.options);
	},
	_getWidget : function(event, fb) {
		var $jqueryObject = $(fb.target.options._html);
		$('label span', $jqueryObject).text(fb.settings.label);
		if (fb._settings.required) {
			$('label em', $jqueryObject).text('*');	
		}
		$('input', $jqueryObject).val(fb.settings.value);
		$('.formHint', $jqueryObject).text(fb.settings.description);
		return $jqueryObject;
	},
	_getFieldSettingsLanguageSection : function(event, fb) {
		var $label = fb.target._label({ label: 'Label', name: 'field.label' })
                         .append('<input type="text" id="field.label" />');
    $('input', $label).val(fb.settings.label)
     .keyup(function(event) {
 	      var value = $(this).val();
	      fb.item.find('label span').text(value);
	      fb.settings.label = value;
	      fb.target._updateSettings(fb.item);
	      fb.target._updateName(fb.item, value);
         });
	  var $value = fb.target._label({ label: 'Value', name: 'field.value' })
		                      .append('<input type="text" id="field.value" />');
		$('input', $value).val(fb.settings.value)
		 .keyup(function(event) {
		  var value = $(this).val();
		  fb.item.find('.textInput').val(value);
		  fb.settings.value = value;
		  fb.target._updateSettings(fb.item);
		});    
		
		var $description = fb.target._label({ label: 'Description', name: 'field.description' })
          .append('<textarea id="field.description" rows="2"></textarea>');
		$('textarea', $description).val(fb.settings.description)
			.keyup(function(event) {
			  var value = $(this).val();
			  fb.item.find('.formHint').text(value);
			  fb.settings.description = value;
			  fb.target._updateSettings(fb.item);
		});    		
		
    var styles = fb.settings.styles;
    var fbStyles = fb.target._getFbLocalizedSettings().styles;
    var fontFamily = styles.fontFamily != 'default' ? styles.fontFamily : fbStyles.fontFamily ;
	  var fontSize = styles.fontSize != 'default' ? styles.fontSize : fbStyles.fontSize;	  
		var $fontPanel = fb.target._fontPanel({ fontFamily: fontFamily, fontSize: fontSize, 
				                           fontStyles: styles.fontStyles, idPrefix: 'field.', nofieldset: true });
		
		$("input[id$='field.bold']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				fb.item.find('label').css('fontWeight', 'bold');
				fb.item.find('.textInput').css('fontWeight', 'bold');
				styles.fontStyles[0] = 1;
			} else {
				fb.item.find('label').css('fontWeight', 'normal');
				fb.item.find('.textInput').css('fontWeight', 'normal');				
				styles.fontStyles[0] = 0;
			}
			fb.target._updateSettings(fb.item);
		});
		$("input[id$='field.italic']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				fb.item.find('label').css('fontStyle', 'italic');
				fb.item.find('.textInput').css('fontStyle', 'italic');				
				styles.fontStyles[1] = 1;
			} else {
				fb.item.find('label').css('fontStyle', 'normal');
				fb.item.find('.textInput').css('fontStyle', 'normal');					
				styles.fontStyles[1] = 0;
			}
			fb.target._updateSettings(fb.item);
		});	
		$("input[id$='field.underline']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				fb.item.find('label span').css('textDecoration', 'underline');
				fb.item.find('.textInput').css('textDecoration', 'underline');					
				styles.fontStyles[2] = 1;
			} else {
				fb.item.find('label span').css('textDecoration', 'none');
				fb.item.find('.textInput').css('textDecoration', 'none');					
				styles.fontStyles[2] = 0;
			}
			fb.target._updateSettings(fb.item);
		});
		
		$("input[id$='field.fontFamily']", $fontPanel).change(function(event) {
			var value = $(this).val();
			fb.item.css('fontFamily', value);
			fb.item.find('.textInput').css('fontFamily', value);	
			styles.fontFamily = value;
			fb.target._updateSettings(fb.item);
		});		
		
		$("select[id$='field.fontSize']", $fontPanel).change(function(event) {
			var value = $(this).val();
			fb.item.find('label').css('fontSize', value + 'px');
			fb.item.find('.textInput').css('fontSize', value + 'px');					
			styles.fontSize = value;
			fb.target._updateSettings(fb.item);
		});				
		return [fb.target._twoColumns($label, $value), fb.target._oneColumn($description), $fontPanel];
	},
	_getFieldSettingsGeneralSection : function(event, fb) {
		var $required = $('<div><input type="checkbox" id="field.required" />&nbsp;Required</div>');
		var $restriction = $('<div><select id="field.restriction" style="width: 99%"> \
				<option value="no">any character</option> \
				<option value="alphanumeric">alphanumeric only</option> \
				<option value="letterswithbasicpunc">letters or punctuation only</option> \
				<option value="lettersonly">letters only</option> \
			</select></div>');
		var $valuePanel = fb.target._fieldset({ text: 'Value'})
		                  .append(fb.target._twoColumns($required, $restriction));
		$('.col1', $valuePanel).css('width', '32%').removeClass('labelOnTop');
		$('.col2', $valuePanel).css('marginLeft', '34%').removeClass('labelOnTop');
		
		$('input', $required).attr('checked', fb.settings.required)
		 .change(function(event) {
			if ($(this).attr('checked')) {
				fb.item.find('em').text('*');
				fb.settings.required = true;
			} else {
				fb.item.find('em').text('');		
				fb.settings.required = false;
			}
			fb.target._updateSettings(fb.item);
		});		
		
		$("select option[value='" + fb.settings.restriction + "']", $restriction).attr('selected', 'true');
		$('select', $restriction).change(function(event) {
			fb.settings.restriction = $(this).val();
			fb.target._updateSettings(fb.item);
		});			
		
		var $textInput = fb.item.find('.textInput');
		var styles = fb.settings.styles;
		if (styles.value.color == 'default') {
			styles.value.color = $textInput.css('color');
		}
		if (styles.value.backgroundColor == 'default') {
			styles.value.backgroundColor = $textInput.css('backgroundColor');
		}		
		var $colorPanel = fb.target._labelValueDescriptionColorPanel(styles);
		
		$("input[id$='field.label.color']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			fb.item.css('color','#' + value);
			styles.label.color = value;
			fb.target._updateSettings(fb.item);
		});		

		$("input[id$='field.label.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			fb.item.css('backgroundColor','#' + value);
			styles.label.backgroundColor = value;
			fb.target._updateSettings(fb.item);
		});				
		
		$("input[id$='field.value.color']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			$textInput.css('color','#' + value);
			styles.value.color = value;
			fb.target._updateSettings(fb.item);
		});		

		$("input[id$='field.value.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			$textInput.css('backgroundColor','#' + value);
			styles.value.backgroundColor = value;
			fb.target._updateSettings(fb.item);
		});					
		
		$("input[id$='field.description.color']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			fb.item.find('.formHint').css('color','#' + value);
			styles.description.color = value;
			fb.target._updateSettings(fb.item);
		});		

		$("input[id$='field.description.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).data('colorPicker').color;
			fb.item.find('.formHint').css('backgroundColor','#' + value);
			styles.description.backgroundColor = value;
			fb.target._updateSettings(fb.item);
		});				
		return [$valuePanel, $colorPanel];
	}, 
	_languageChange : function(event, fb) {
		var styles = fb.settings.styles;
		var fbStyles = fb.target._getFbLocalizedSettings().styles;
		var fontFamily = styles.fontFamily != 'default' ? styles.fontFamily : fbStyles.fontFamily;
		var fontSize = styles.fontSize != 'default' ? styles.fontSize : fbStyles.fontSize;
		var fontWeight = styles.fontStyles[0] == 1 ? 'bold' : 'normal';
    var fontStyle = styles.fontStyles[1] == 1 ? 'italic' : 'normal';
    var textDecoration = styles.fontStyles[2] == 1 ? 'underline' : 'none';
		
    fb.item.css('fontFamily', fontFamily);
		fb.item.find('label span').text(fb.settings.label)
		  .css('textDecoration', textDecoration);

		fb.item.find('label').css('fontWeight', fontWeight)
		  .css('fontStyle', fontStyle)
		  .css('fontSize', fontSize + 'px');
			
		fb.item.find('.textInput').val(fb.settings.value)
		  .css('fontWeight', fontWeight)
		  .css('fontStyle', fontStyle)
		  .css('textDecoration', textDecoration)
		  .css('fontFamily', fontFamily)
		  .css('fontSize', fontSize + 'px');

		fb.item.find('.formHint').text(fb.settings.description);
		
	}
});

$.widget('fb.fbSingleLineText', FbSingleLineText);
