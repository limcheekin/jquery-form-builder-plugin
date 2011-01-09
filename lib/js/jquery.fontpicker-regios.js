/***
@title:
Font Picker Regios

@version:
1.0

@author:
Sergey Alekseyev

@date:
2010-11-17

@url:
http://www.regios.org/jquery-font-picker-plugin

@license:
http://creativecommons.org/licenses/by/3.0/

@copyright:
2010 Regios GmbH (regios.org)

@requires:
jquery, jquery.fontpicker-regios.js, fontpickerdemo.htm, fontpickerdemo.css

@does:
This plugin generates a minimalistic font selector out of an empty div. It
accepts various parameters for styling and behavior of the selector. A basic
set of web-safe fonts is provided directly within the plugin, if you need more
you can add them yourself.

@exampleJS:
$('#fontselector').fontPickerRegios({ 
	defaultFont: 'Tahoma',	
	callbackFunc: changeFont
});

***/

(function( $ ){
jQuery.fn.fontPickerRegios = function(settings) {

var fonts = new Array(
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
'Verdana,Geneva,sans-serif' );

return this.each(function() {

		var config = $.extend({
		    defaultFont: 'Tahoma',              // default font to display in selector
			id:			 'fontbox',				// id of font picker container
			selid:		 'fontselector',		// id of font selector field
			fontclass:   'singlefont',			// class for the font divs
			speed:		 100,					// speed of dialog animation, default is fast
			hoverColor:  '#efefff',				// background color of font div on mouse hover
			bgColor:     '#ffffee'              // regular background color of font div 
		}, settings);

		var fontPicker = $('#' + config.id);		

		if (!fontPicker.length) {
			fontPicker = $('<div id="'+config.id+'" ></div>').appendTo(document.body).hide();

			// Remove the font-picker if you click outside it (on body)
			$(document.body).click(function(event) {									
					if ($(event.target).is('#'+config.selid) || $(event.target).is('#'+config.id)) return;					
					fontPicker.slideUp(config.speed);		
			});
		}

		$(this).click(function () {
			// toggle the font picker 
			if (fontPicker.is(':hidden'))
			{
				fontPicker.css({
					position: 'absolute', 
					left: $(this).offset().left + 'px', 
					top: ($(this).offset().top + $(this).height() + 3) + 'px'
				}); 			
				fontPicker.slideDown(config.speed);
			}
			else
				fontPicker.slideUp(config.speed);		
		});
		
		// select initial value
		if (config.defaultFont.length)
		{
		   $(this).css('fontFamily', config.defaultFont);
		   $(this).text(config.defaultFont);
		}

		/* add individual font divs to fontbox */
		$.each(fonts, function(i, item) {
			
			fontPicker.append('<div class="singlefont" onmouseover="this.style.backgroundColor=\''+config.hoverColor
			+'\'" onmouseout="this.style.backgroundColor=\''+config.bgColor+'\'" style="font-family: '+item+';" value="' + item + '"> ' + item.split(',')[0] + '</div>');
		});
		
		$('.'+config.fontclass).click(function() {				
		  $('#'+config.selid).text($(this).text());
		  var fontFamily = ($(this).attr('value'));		  
		  $('#'+config.selid).css('fontFamily', fontFamily);
		  
		  config.callbackFunc(fontFamily);
		});
		
	});	
}
})( jQuery );