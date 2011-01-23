/*
 * JQuery Form Builder - Plain Text plugin.
 * 
 * Revision: @REVISION
 * Version: @VERSION
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
				classes : [ 'rightAlign', 'middleAlign' ]
			},
			styles : {
				fontFamily: 'default', // form builder default
				fontSize: 'default',
				fontStyles: [0, 0, 0],
				color : 'default',
				backgroundColor : 'default'
			}
		}
	},
	_init : function() {
		$.fb.fbWidget.prototype._init.call(this); 
		this.options = $.extend({}, $.fb.fbWidget.prototype.options, this.options);
		this._log('FbPlainText._create called. this.options.text = ' + this.options.settings.en.text);
		this._log('FbPlainText._init called.');
	},
	_getWidget : function($this, settings, $ctrlHolder) {
		$ctrlHolder.addClass(settings.classes[1]); // vertical alignment
		return $($this.options._html).text(settings.text)
				.addClass(settings.classes[0]);
	},
	_getFieldSettingsLanguageSection : function($this, $widget, settings) {
		var $text = $('<label for="field.text">Text (?)</label><br /> \
     <input type="text" id="field.text" />')
				.val($widget.find('div.PlainText').text())
				.keyup(function(event) {
					var value = $(this).val();
					$widget.find('div.PlainText').text(value);
					settings.text = value;
					$this._updateSettings($widget);
				});
		var $verticalAlignment = $this._verticalAlignment({name: 'field.verticalAlignment', value: settings.classes[1]})
        .change(function(event) {
        	// $(this).val() not work for select id that has '.'
					var value = $('option:selected', this).val(); 
					$this._log('field.verticalAlignment value = ' + value);
					$widget.removeClass(settings.classes[1]).addClass(value);
					settings.classes[1] = value;
					$this._updateSettings($widget);
				});
		var $horizontalAlignment = $this._horizontalAlignment({ name: 'field.horizontalAlignment', value: settings.classes[0] })
				   .change(function(event) {
							var $text = $widget.find('div.PlainText');
							var value = $('option:selected', this).val();
							$text.removeClass(settings.classes[0]).addClass(value);
							settings.classes[0] = value;
							$this._updateSettings($widget);
						});
		return [$this._oneColumn($text),
				$this._twoColumns($horizontalAlignment, $verticalAlignment) ];
	},
	_getFieldSettingsGeneralSection : function($this, $widget, settings) {
    var styles = settings.styles;
    var fbStyles = $this._getFbOptions().settings.styles;
    var fontFamily = styles.fontFamily != 'default' ? styles.fontFamily : fbStyles.fontFamily ;
	  var fontSize = styles.fontSize != 'default' ? styles.fontSize : fbStyles.fontSize;	  
    var color = styles.color != 'default' ? styles.color : fbStyles.color;
	  var backgroundColor = styles.backgroundColor != 'default' ? styles.backgroundColor : fbStyles.backgroundColor;
		var $fontPanel = $this._fontPanel({ fontFamily: fontFamily, fontSize: fontSize, 
			                           fontStyles: styles.fontStyles, idPrefix: 'field.' });
		var $colorPanel = $this._colorPanel({ color: color, backgroundColor: backgroundColor, idPrefix: 'field.' });
	  
		$("input[id$='field.bold']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				$widget.css('fontWeight', 'bold');
				styles.fontStyles[0] = 1;
			} else {
				$widget.css('fontWeight', 'normal');
				styles.fontStyles[0] = 0;
			}
			$this._updateSettings($widget);
		});
		$("input[id$='field.italic']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				$widget.css('fontStyle', 'italic');
				styles.fontStyles[1] = 1;
			} else {
				$widget.css('fontStyle', 'normal');
				styles.fontStyles[1] = 0;
			}
			$this._updateSettings($widget);
		});	
		$("input[id$='field.underline']", $fontPanel).change(function(event) {
			if ($(this).attr('checked')) {
				$widget.css('textDecoration', 'underline');
				styles.fontStyles[2] = 1;
			} else {
				$widget.css('textDecoration', 'none');
				styles.fontStyles[2] = 0;
			}
			$this._updateSettings($widget);
		});
		
		$("input[id$='field.fontFamily']", $fontPanel).change(function(event) {
			var value = $(this).val();
			$widget.css('fontFamily', value);
			styles.fontFamily = value;
			$this._updateSettings($widget);
		});		
		
		$("select[id$='field.fontSize']", $fontPanel).change(function(event) {
			var value = $(this).val();
			$widget.css('fontSize', value + 'px');
			styles.fontSize = value;
			$this._updateSettings($widget);
		});		
		
		$("input[id$='field.color']", $colorPanel).change(function(event) {
			var value = $(this).attr('title');
			$widget.css('color','#' + value);
			styles.color = value;
			$this._updateSettings($widget);
		});		

		$("input[id$='field.backgroundColor']", $colorPanel).change(function(event) {
			var value = $(this).attr('title');
			$widget.css('backgroundColor','#' + value);
			styles.backgroundColor = value;
			$this._updateSettings($widget);
		});			
		return [$fontPanel, $colorPanel];
	}, 
	_languageChange : function($widget, settings, selected) {
		this._log('languageChange = ' + $.toJSON(settings));
		$widget.find('div.PlainText').text(settings.text).removeClass('leftAlign centerAlign rightAlign').addClass(settings.classes[0]);
		$widget.removeClass('topAlign middleAlign bottomAlign').addClass(settings.classes[1]);
		if (selected) {
			var $fieldSettingsLanguageSection = $(this._getFbOptions()._fieldSettingsLanguageSection);
			$("input[id$='field.text']", $fieldSettingsLanguageSection).val(settings.text);
			$("select[id$='field.horizontalAlignment'] option[value='" + settings.classes[0] + "']", 
			    $fieldSettingsLanguageSection).attr('selected', 'true');
			$("select[id$='field.verticalAlignment'] option[value='" + settings.classes[1] + "']", 
			    $fieldSettingsLanguageSection).attr('selected', 'true');			  
		}
	}
});

$.widget('fb.fbPlainText', FbPlainText);
