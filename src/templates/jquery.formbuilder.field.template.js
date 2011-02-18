/*
 * JQuery Form Builder - Field Name plugin.
 * 
 * Revision: @REVISION
 * Version: @VERSION
 * Copyright 2011 Author Name (email@domain.com)
 *
 * Licensed under Apache v2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * Date: DD-MMM-2011
 */

var FbFieldName = $.extend({}, $.fb.fbWidget.prototype, {
	options: { // default options. values are stored in widget's prototype
		name: 'Field Name',
		belongsTo: $.fb.formbuilder.prototype.options._fancyFieldsPanel,
		_type: 'FieldName',
		_html: '<div></div>',
		_counterField: 'field1',
		_languages: [ 'en', 'zh_CN' ],
		settings: {
			en: {
				field1: 'Value',
				classes: [],
				styles: {
					fontFamily: 'default', // form builder default
					fontSize: 'default',
					fontStyles: [0, 0, 0] // bold, italic, underline					
				}				
			},
			zh: {
				field1: '文字',
				classes: [],
				styles: {
					fontFamily: 'default', // form builder default
					fontSize: 'default',
					fontStyles: [0, 0, 0] // bold, italic, underline					
				}				
			},
			styles: {
				color: 'default',
				backgroundColor: 'default'
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
		var $jqueryObject;
		fb.target._log('fbFieldName._getWidget executing...');
		// write your code here
		fb.target._log('fbFieldName._getWidget executed.');
		return $jqueryObject;
	},
	_getFieldSettingsLanguageSection : function(event, fb) {
		var $jqueryObjects = [];
		fb.target._log('fbFieldName._getFieldSettingsLanguageSection executing...');
		// write your code here
		fb.target._log('fbFieldName._getFieldSettingsLanguageSection executed.');
		return $jqueryObjects;
	},
	_getFieldSettingsGeneralSection : function(event, fb) {
		var $jqueryObjects = [];
		fb.target._log('fbFieldName._getFieldSettingsGeneralSection executing...');
		// write your code here
		fb.target._log('fbFieldName._getFieldSettingsGeneralSection executed.');
		return $jqueryObjects;
	}, 
	_languageChange : function(event, fb) {
		fb.target._log('fbFieldName.languageChange executing...');
		// write your code here
		fb.target._log('fbFieldName.languageChange executed.');
	}
});

$.widget('fb.fbFieldName', FbFieldName);
