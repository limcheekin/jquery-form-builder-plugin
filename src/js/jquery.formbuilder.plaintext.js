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
