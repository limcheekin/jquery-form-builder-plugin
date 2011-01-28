/*
 * Color picker created based on the work of Andreas Lagerkvist (andreaslagerkvist.com)
 * at http://andreaslagerkvist.com/jquery/colour-picker/ and customized for 
 * JQuery Form Builder plugin project at http://code.google.com/p/jquery-form-builder-plugin/
 * 
 * Revision: @REVISION
 * Version: @VERSION
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
		this._log('ColorPicker._init called.');
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
				$.fb.colorPicker.prototype._log('colorPicker. input id = ' + $colorPickerPanel.attr('rel') + ', hex = ' + hex + ', title = ' + $(this).attr('title') + ', text = ' + $(this).text());
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
	_log : function($message) { if (window.console && window.console.log) window.console.log($message);},
	_hexInvert: function (hex) {
		var r = hex.substr(0, 2);
		var g = hex.substr(2, 2);
		var b = hex.substr(4, 2);

		return 0.212671 * r + 0.715160 * g + 0.072169 * b < 0.5 ? 'ffffff' : '000000';
	}
};

$.widget('fb.colorPicker', ColorPicker);