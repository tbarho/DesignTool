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
                                
                // Figure out which tools should be added
                var classList = this.attr('class').split(/\s/);
                
                // Add the tools to the toolbox if the class exists
                for(i = 0; i < classList.length; i++) {
                        
                        // This is where we define what "adding a tool" is
                        // Right now, its just text, whilest we get the actual toolbox going.
                        switch(classList[i])
                        {
                                case "color":
                                        var colorHolder = $('<div class="colorChoose"></div>');
                                        colorHolder.ColorPicker({
                                        	flat: true,
                                        	onChange: function(hsb, hex, rgb) {
                                        		element.setColor(hex);
                                        	}
                                        });
                                        colorHolder.appendTo(toolbox);
                                        break;
                                case "y-position":
                                        //$('<p> - Position Tool</p>').appendTo(toolbox);
                                        break;
                                case "height":
                                        //$('<p> - Height Tool</p>').appendTo(toolbox);
                                        break;
                                case "upload":
                                        //$('<p> - Upload Tool</p>').appendTo(toolbox);
                                        break;
                        }
                        
                }
                
                // Add to the count, so the selector number is right
                toolBoxCount++;

                // Set the id of the toolbox            
                toolbox.attr('id', 'toolbox-' + toolBoxCount);
                
                // Set the dialog width
                var dialogWidth = 400;
                
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
                
                toolboxSelector.click(function() {
                		$('.ui-dialog:visible').dialog('close');
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
        
        
        $.fn.addColorPicker = function (element) {
        	
        }
        
        $.fn.setColor = function (hex) {
			this.css('backgroundColor', '#' + hex);
		}
        
        
        
        
})(jQuery)


// This would typically be another file.
$(document).ready(function() {
        $('body').addToolboxes();
        
});