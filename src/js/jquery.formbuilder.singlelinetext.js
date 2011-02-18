/*
 * JQuery Form Builder - Single Line Text plugin.
 * 
 * Revision: @REVISION
 * Version: @VERSION
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
		fb.target._log('fbSingleLineText._getWidget executing...');
		$('label span', $jqueryObject).text(fb.settings.label);
		if (fb._settings.required) {
			$('label em', $jqueryObject).text('*');	
		}
		$('input', $jqueryObject).val(fb.settings.value);
		$('.formHint', $jqueryObject).text(fb.settings.description);
		fb.target._log('fbSingleLineText._getWidget executed.');
		return $jqueryObject;
	},
	_getFieldSettingsLanguageSection : function(event, fb) {
		fb.target._log('fbSingleLineText._getFieldSettingsLanguageSection executing...');
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
		fb.target._log('fbSingleLineText._getFieldSettingsLanguageSection executed.');
		return [fb.target._twoColumns($label, $value), fb.target._oneColumn($description), $fontPanel];
	},
	_getFieldSettingsGeneralSection : function(event, fb) {
		fb.target._log('fbSingleLineText._getFieldSettingsGeneralSection executing...');
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
			fb.target._log('fb.settings.restriction = ' + fb.settings.restriction);
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
		fb.target._log('fbSingleLineText._getFieldSettingsGeneralSection executed.');
		return [$valuePanel, $colorPanel];
	}, 
	_languageChange : function(event, fb) {
		fb.target._log('fbSingleLineText.languageChange executing...');
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
		
		fb.target._log('fbSingleLineText.languageChange executed.');
	}
});

$.widget('fb.fbSingleLineText', FbSingleLineText);
