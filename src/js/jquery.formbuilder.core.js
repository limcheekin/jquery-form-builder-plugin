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
			  $.fb.formbuilder.prototype._log('helper.html() = ' + helper.html());
			  return helper;
		} ,
    drag: function(event, ui) {
			$.fb.formbuilder.prototype._log('ui.helper: w x h = ' + ui.helper.css('width') + " x " + ui.helper.css('height'));
			var $prevCtrlHolder = $.fb.formbuilder.prototype._getPreviousCtrlHolder(ui);
			var fbOptions = $.fb.formbuilder.prototype.options;
			// $.fb.formbuilder.prototype._log('rel: ' + $prevCtrlHolder.attr('rel') + " == " + ui.helper.attr('rel'));
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
	  		$.fb.formbuilder.prototype._log('drop executing. ui.helper.attr(rel) = ' + ui.helper.attr('rel') + ', ui.offset.top = ' + ui.offset.top);
	  		$.fb.formbuilder.prototype._log('ui.draggable.attr(id) = ' + ui.draggable.attr('id'));
	  		// to make sure the drop event is trigger by draggable instead of sortable
	  		if (ui.helper.attr('class').lastIndexOf(fbOptions._draggableClass) > -1) {
	  			 $('.' + fbOptions._dropPlaceHolderClass).remove();
	  			 var $widget = ui.draggable.data('fb' + ui.draggable.attr('id'));
		    	 var $prevCtrlHolder = $.fb.formbuilder.prototype._getPreviousCtrlHolder(ui);
		    	 var $ctrlHolder = $widget._createFbWidget(event); 
		    	 var $elements;
		    	 if ($prevCtrlHolder) {
	  			   $widget._log('$prevCtrlHolder.text() = ' + $prevCtrlHolder.text());
	  			   $ctrlHolder.insertAfter($prevCtrlHolder);
	  			   $elements = $prevCtrlHolder.next().nextAll(':visible'); // $ctrlHolder.next() not works. :visible to prevent select the invisible ctrlHolder and emptyBuilderPanel
	  		   } else {
	  			   $(fbOptions._emptyBuilderPanel + ':visible').hide();
	  			   $elements = $('.' + $.fb.fbWidget.prototype.options._styleClass + 
	  					   ':visible:not(.' + fbOptions._draggableClass + ')', $formControls);
	  				 $formControls.prepend($ctrlHolder).sortable('refresh');				  		        	   
	  		          }
		    	 $ctrlHolder.toggle('slide', {direction: 'up'}, 'slow');

		    	 if ($elements.length) {
						// set next widget's sequence as my sequence
		    		 $widget._log('$elements.first().text() = ' + $elements.first().text());
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
			$.fb.formbuilder.prototype._log(i + ') top = ' + $this.offset().top);
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
		
		$fbWidget._log('settings.name = ' + settings.name);
	  
		var $name = $fbWidget._label({ label: 'Name', name: 'form.name' })
		       .append('<input type="text" id="form.name" value="' + settings.name + '" />');
		$('input', $name).keyup(function(event) {
				var value = $(this).val();
				$fbWidget._log('options.disabledNameChange = ' + options.disabledNameChange);
				if (!options.disabledNameChange && 
						$.inArray($language.val(), options._languagesSupportIdGeneration) > -1) {
					var name = $fbWidget._propertyName(value);
		      $('#name',$builderForm).val(name).change();
				}
				$fbWidget._log('$(this).val() = ' + value);
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
			$this._log('background color change: value ' + value);
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
	 $.fb.formbuilder.prototype._log('languageChange(' + $(this).val() + ', ' + $('option:selected', this).text() +  ')');
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
	  $.fb.formbuilder.prototype._log('formSettings.fontStyles[2] = ' + formSettings.styles.fontStyles[2]);
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
		    $.fb.formbuilder.prototype._log(i + ') settings = ' + settings);
		    type = $widget.find("input[id$='fields[" + $widget.attr('rel') + "].type']").val();
		    $.fb.formbuilder.prototype._log('type = ' + type);
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
		$.fb.formbuilder.prototype._log('moveDown = ' + moveDown + ', ui.offset.top = ' + ui.offset.top + ", ui.item.originalOffsetTop = " + ui.item.originalOffsetTop);
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