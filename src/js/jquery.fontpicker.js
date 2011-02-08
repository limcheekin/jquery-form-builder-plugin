/*
 * This font picker created based on the work of Sergey Alekseyev
 * at http://plugins.jquery.com/project/fontpicker-regios and customized for 
 * JQuery Form Builder plugin project at http://code.google.com/p/jquery-form-builder-plugin/
 * 
 * Revision: @REVISION
 * Version: @VERSION
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
	_log : function($message) { if (window.console && window.console.log) window.console.log($message);},	
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
	   this._log('fontFamily(' + value + ')');	
	   var fontFamilyValue = value.replace(/'/gi, ''); // remove single quote for chrome browser
		 var fontFamilyText = fontFamilyValue.split(',', 1)[0]; // taking the 1st font type
		 this._log('fontFamilyValue = ' + fontFamilyValue + ', fontFamilyText = ' + fontFamilyText);	
		 this.element.text(fontFamilyText).css('fontFamily', fontFamilyValue);
		 $('input', this.element.parent()).val(fontFamilyValue);
	}
};

$.widget('fb.fontPicker', FontPicker);