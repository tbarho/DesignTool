(function($) {

        var toolBoxCount = 0;
        
        // Adds all the toolboxes to a page
        $.fn.addToolboxes = function() {
                $('.toolbox').each(function() {
                        $(this).addToolbox();
                });
        }
        
        // Apply a toolbox to an element
        $.fn.addToolbox = function() {
        
                // Create the toolbox element
                var toolbox = $('<div class="design-toolbox">I am a toolbox</div>');
                                
                // Figure out which tools should be added
                var classList = this.attr('class').split(/\s/);
                
                // Add the tools to the toolbox if the class exists
                for(i = 0; i < classList.length; i++) {
                        
                        // This is where we define what "adding a tool" is
                        // Right now, its just text, whilest we get the actual toolbox going.
                        switch(classList[i])
                        {
                                case "color":
                                        $('<p> - I have color</p>').appendTo(toolbox);
                                        break;
                                case "y-position":
                                        $('<p> - I have position</p>').appendTo(toolbox);
                                        break;
                                case "height":
                                        $('<p> - I have height</p>').appendTo(toolbox);
                                        break;
                                case "upload":
                                        $('<p> - I have upload</p>').appendTo(toolbox);
                        }
                        
                }
                
                // Add to the count, so the selector number is right
                toolBoxCount++;
                
                
                // Add the toolbox selector
                this.addToolBoxSelector(toolBoxCount);
                
                // Set the id of the toolbox            
                toolbox.attr('id', 'toolbox-' + toolBoxCount);
                                
                // Append the toolbox
                $('body').append(toolbox);
                
                
        }
        
        $.fn.showToolBox = function(id) {
                $(id).fadeIn();
        }
        
        $.fn.addToolBoxSelector = function(count) {
                        
                // Now add the selector with the number
                var toolboxSelector = $('<div class="toolbox-selector"><span>' + count + '</span></div>');
                
                // Set the ID
                toolboxSelector.attr('id', 'toolbox-selector-' + count);
                
                // Set the position
                toolboxSelector.setPosition(this);
                
                var toolBoxID = '#toolbox-' + count;
                
                toolboxSelector.click(function() {
                        $('.design-toolbox').fadeOut();
                        $(toolBoxID).fadeIn();
                });
                
                // Append the selector
                $('body').append(toolboxSelector);

        }
        
        $.fn.setPosition = function(parent) {
                this.css('left', parent.offset().left + 10);
                this.css('top', parent.offset().top + 10);
        }
        
        
        
        
        
})(jQuery)


// This would typically be another file.
$(document).ready(function() {
        $('body').addToolboxes();
        $('#info').dialog();
});