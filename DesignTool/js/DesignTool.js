(function($) {

		// Variable used for tying selectors to toolboxes
        var toolBoxCount = 0;
        
        
        /**
		 * extension function addToolboxes
		 * 
		 * Adds the intro modal and adds all of the toolboxes
		 *
		 */
        $.fn.addToolboxes = function() {
        		
        		$('body').addIntroModal();
        
        		$('.toolbox').each(function() {
                        $(this).addToolbox();
                });
        }
        
        
        /**
		 * extension function addToolbox
		 * 
		 * Adds toolboxes to elements based on the classes that element has.
		 *  // color 	  	- adds color picker
		 *  // y-position 	- adds slider for vertical positioning
		 *  // height     	- adds slider for height
		 *  // upload		- adds file uploader
		 *
		 */
        $.fn.addToolbox = function() {
        		
        		// Get the current element
        		var element = $(this);
        		
                // Create the toolbox element
                var toolbox = $('<div></div>');
                
                // Call the buildToolBox function to get all the tools for the toolbox
                toolbox.buildToolBox(this.attr('class'), element);
                                
                                
                // Add to the count, so the selector number is right
                toolBoxCount++;

                // Set the id of the toolbox
                var toolboxID = 'toolbox-' + toolBoxCount;            
                toolbox.attr('id', toolboxID);
                
                // Set the dialog width
                var dialogWidth = 380;
                
                // Use the dialog width to create the dialog X position
                var dialogX = $('body').width() - dialogWidth - 30;
                
                // Make dialog
                toolbox.dialog({ 
                	autoOpen: false, 
                	title: 'Tool Box',
                	show: 'fade',
                	hide: 'fade',
                	closeText: 'Close',
                	width: dialogWidth,
                	position: [dialogX, 10]
                });
                
                // Add the toolbox selector
                this.addToolBoxSelector(toolBoxCount);
                
                // Add an identifier to the parent element
                this.addClass('tb-' + toolBoxCount);
                
        }
        
        
        /**
		 * extension function buildToolBox
		 * 
		 * The controls to the toolbox based on the classes of the editable HTML element
		 *
		 */
        $.fn.buildToolBox = function(classesArray, parentElement) {
        
        	var toolbox = this;
        	var tools = classesArray.split(/\s/);
        	
        	// Favor jQuery for over standard javascript for (for state, context)
        	$(tools).each(function() {
        		switch(this.toString())
        		{
        			case 'color':
        				toolbox.addColorPicker(parentElement);
        				break;
        			case 'y-position':
        				toolbox.addPositionSlider(parentElement);
        				break;
        			case 'upload':
        				toolbox.addUploader(parentElement);
        				break;
        		}
        	});
        }
        
                
        /**
		 * extension function addToolBoxSelection
		 * 
		 * Adds the selectors to elements and connects them to toolboxes
		 *
		 */
        $.fn.addToolBoxSelector = function(count) {
                        
                // Now add the selector with the number
                var toolboxSelector = $('<div class="toolbox-selector"><span>' + count + '</span></div>');
                
                // Set the ID
                toolboxSelector.attr('id', 'toolbox-selector-' + count);
                
                // Set the position
                toolboxSelector.setPosition(this);
                
                var toolBoxID = '#toolbox-' + count;
                
                toolboxSelector.bind('click', function(event) {
                	$('.ui-widget-content').dialog('close').delay(400);
                	$(toolBoxID).dialog('open');
                });
                
                // Append the selector
                $('body').append(toolboxSelector).delay(1000).fadeIn();

        }
        
        
        /**
		 * extension function setPosition
		 * 
		 * Extension for setting positions of elements
		 *
		 */
        
        $.fn.setPosition = function(parent) {
                this.css('left', parent.offset().left + 10);
                this.css('top', parent.offset().top + 10);
        }
        
        
        /**
		 * extension function addIntroModal
		 * 
		 * Creates the intro modal, and provides the sequential fading in of selectors on modal close
		 *
		 */
        $.fn.addIntroModal = function() {
        	var info = $('<div id="info">Use the <div class="info-selector" style="position: relative; display: inline-block; margin: 0; padding: 0; top: 0; left: 0;"><span>#</span></div>\'s to edit things.</div>');
        	info.dialog({ 
        		modal: true,
        		buttons: {
        			Ok: function () {
        				$(this).dialog('close');
        			}
        		},
        		close: function() {
        		
        			// Fade in the toolboxes
        			var delay = 500;
        			var selectors = $('.toolbox-selector');

        			for(i = 0; i < selectors.length; i++) {
        				$(selectors[i]).delay(delay).fadeIn();
        				delay = delay + 500;
        			}
        		}
        	});
        }
        
        
        /**
		 * extension function addColorPicker
		 * 
		 * Adds a color picker to a toolbox
		 *
		 */
        $.fn.addColorPicker = function (colorizedElement) {
        	
        	// ToDo
        	
			// 1 - Find the color of the colorized element (set to white if none)
			
			var defaultColor = (colorizedElement.css('backgroundColor') != 'transparent') ? colorizedElement.css('backgroundColor') : 'rgb(255, 255, 255)';
			
			
			
			// Parse the RGB String to Hex, since Hex seems to work better with the ColorPicker plugin
			
			defaultColor = defaultColor.toString();
			defaultColor = defaultColor.replace('rgb(','');
			defaultColor = defaultColor.replace(')', '');
			defaultColor = defaultColor.split(', ');
			
			var defaultHex = "";
			
			// Use the jQuery for equivalent to persist state and allow for nested for's
			$(defaultColor).each(function () {
				defaultHex += toHex(this.toString().replace(/^\s*|\s*$/g,""));
				
			});
			
			

			// 2 - Create the swatch (with default color)
			
			var swatch = $('<div class="colorTool"><ul><li><div class="colorSelector"><div style="background-color:#' + 
							defaultHex + '"></div></div></li><li class="colorTool-title">Background</li></ul></div>');
			
			
			// 3 - Create the colorpicker
			
			var colorChooser = $('<div class="colorChooser"></div>');
			
			colorChooser.ColorPicker({
				flat: true,
				color: defaultHex,
				onChange: function(hsb, hex, rgb) {
					colorizedElement.setColor(hex);
					$('.colorSelector>div',swatch).setColor(hex);
				},
				onSubmit: function(hsb, hex, rgb) {
					colorizedElement.setColor(hex);
					$('.colorSelector>div',swatch).setColor(hex);
					colorChooser.slideUp();
				}
			});
			
			
			// 4 - Wire the show / hide functionality to the swatch
			
			swatch.bind('click', function () {
				if(colorChooser.is(':visible')) {
					colorChooser.stop().slideUp();
				} else {
					colorChooser.stop().slideDown();
				}
			});
			
			
			// 5 - Add all this stuff to the toolbox

            swatch.appendTo(this);
            colorChooser.appendTo(this);
        }
        
        
        /**
		 * extension function setColor
		 * 
		 * Sets background color of an element
		 *
		 */
        $.fn.setColor = function (hex) {
			this.css('backgroundColor', '#' + hex);
		}
		
		
		/**
		 * function toHex
		 * 
		 * Parses RGB value to Hex Value (e.g. 255 to FF)
		 *
		 */
		function toHex(N) {
			if (N==null) return "00";
			N=parseInt(N); 
			if (N==0 || isNaN(N)) return "00";
			N=Math.max(0,N); 
			N=Math.min(N,255); 
			N=Math.round(N);
			return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
		}
		
		
		/**
		 * function addPositionSlider
		 * 
		 * Adds a position slider to a toolbox that controls a parentElement
		 *
		 */
		$.fn.addPositionSlider = function(parentElement) {
			var slider = $('<div class="slider"><ul><li class="sliderBar"></li><li class="sliderTool-title">Position</li></ul></div>');
			$('.sliderBar', slider).slider({
				min: -50,
				max: 50,
				value: 0,
				slide: function(event, ui) {
					parentElement.css('margin-top', ui.value.toString() + 'px');
				}
			});
			slider.appendTo(this);
		}
		
		
		/**
		 * function addUploader
		 * 
		 * Adds an Uploadify uploader to a toolbox
		 * Matches the colors of a page to the colors found in the logo
		 * Set the background image of the parentElement to the uploaded file
		 *
		 */
		$.fn.addUploader = function(parentElement) {
			// Create an id based on the toolbox id
			var id = 'uploader-' + toolBoxCount;
			
			// Form the HTML for the uploader
			var uploader = $('<div class="upload"><input type="file" /><div id="queue-' + toolBoxCount + '"></div><a href="javascript:$(\'#' + id + '\').uploadifyUpload();">Upload Files</a></div>');
			
			// Create a random number to save the image with
			var randomNumber = Math.floor(Math.random()*1000000001);
			
			// Set the name and ID
			$('input', uploader).attr('id', id);
			$('input', uploader).attr('name', id);
			
			// Add uploadify
			$('input', uploader).uploadify({
				'uploader'			: '../DesignTool/js/uploadify/uploadify.swf',
				'script'			: '../DesignTool/php/uploadify.php',
				'cancelImg'			: '../DesignTool/js/uploadify/cancel.png',
				'folder'			: '../uploads',
				'auto'				: false,
				'wmode'				: 'transparent',
				'multi'				: false,
				'queueID'			: 'queue-' + toolBoxCount,
				'removeCompleted' 	: false,
				'scriptData'		: {'uniqueFileID':randomNumber},
				'onComplete'		: function(event, ID, fileObj, response, data) {
					
					// parse the serialized result to JSON
					var colorItem = jQuery.parseJSON(response);
					
					// Set the background image to the image that was uploaded
					parentElement.changeImage(colorItem.image);
					
					// Loop through the returned colors, setting any "weight-i" class in the template to the color (this)
					$.each(colorItem.colors, function(i) {
					
						// Get the class name
						var colorElement = $('.weight-' + i);
						
						// Set the background color of that element
						colorElement.css('background-color', this);
						
						// Find out if the element has a background changer
						// If it does, set the color of the color picker
						
					});
				}
			});
			
			// Append the uploader to the toolbox
			uploader.appendTo(this);
		}
		
		
		/**
		 * function changeImage
		 * 
		 * Changes the background image of the element
		 *
		 */
		$.fn.changeImage = function(imagePath) {
			// Set the image
			this.css('background-image', "url('" + imagePath + "')");
			// Set to no background repeating
			this.css('background-repeat', 'no-repeat');
			// Indent the text to hide it, but keep in the page for SEO
			this.css('text-indent', '-9999px');
		}
        
        
        
        
})(jQuery)


// This would typically be another file.
$(document).ready(function() {
        $('body').addToolboxes();
        
});