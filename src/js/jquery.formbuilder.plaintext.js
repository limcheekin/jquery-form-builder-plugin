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
					fb.target._log('field.verticalAlignment value = ' + value);
					fb.item.removeClass(fb.settings.classes[1]).addClass(value);
					fb.settings.classes[1] = value;
					fb.target._updateSettings(fb.item);
				});
		var $horizontalAlignment = fb.target._horizontalAlignment({ name: 'field.horizontalAlignment', value: fb.settings.classes[0] })
				   .change(function(event) {
					   fb.target._log('$horizontalAlignment change trigger');
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
		this._log('languageChange = ' + $.toJSON(fb.settings));
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
