(function($) {

	/*
		Design Tool Key Components
		
		Simple Integration
		
		- Add .js files to template
		- Add $.designTool() to document.ready
		- Use CSS classes to determine which tools to add
		
		
		Output
		
		- Output existing + modified DOM, CSS, and images to named folder
		- Integrate with S3 or other Cloud Storage service
		- Allow for standalone ZIP folder output (ie, Wordpress theme designer)
		
		
		Available Tools
		
		- Upload Logo & Color Match
		- Change element color (foreground or background)
		- Move element vertically
		- Adjust width
		- Image (Splash) upload; include cropping, resizing
		
	*/
	
	
	/**
	 * function editable
	 * 
	 * Finds DOM elements based on the CSS class "editable"
	 * Adds the tooltip and the design tool
	 *
	 */
	$.fn.editable = function() {
	
		// Iterate through the editable items
		$('.editable').not('body').each(function() {
			$(this).glow();
		});		
	}
	
	/**
	 * function bgGlowTip
	 * 
	 * Replacement for glow and tooltip, which I could not get working consistently
	 *
	 */
	$.fn.bgGlowTip = function() {
		
		// Get the default color of the element
		var defaultColor = (this.css('backgroundColor') != 'transparent') ? this.css('backgroundColor') : '#FFFFFF';
		
		// Create the click tip HTML
		var clickTip = $('<div class="clickTip">&nbsp;</div>');
		
		var eOffset = this.offset();
		var eTop = eOffset.top;
		var eLeft = eOffset.left;
		var eHeight = this.outerHeight();
		var eWidth = this.outerWidth();
		
		var clickLeft = eLeft + eWidth;
				
		var clickTop = eTop + (eHeight / 2) - 22.5;
		
		clickTip.css({'top' : clickTop + 'px', 'left' : clickLeft + 'px'});
		
		clickTip.unbind('mouseover mouseout');
		this.unbind('mouseover mouseout');
			
		// Add the animation to glow the element
		$(this).hover(function() {
			$(this).animate({ backgroundColor: "#b4d9ff" }, "fast");
			clickTip.hide().appendTo('body').show();
		}, function() {
			$(this).animate({ backgroundColor: defaultColor }, "fast");
			clickTip.hide().remove();
		});
		
		
		
	}
	
	
	/**
	 * function glow [deprecated]
	 * 
	 * Supposed to add nice glow effect to element on selection.  Doesn't work.
	 *
	 */
	$.fn.glow = function(options) {
		var defaults = {};		
		var options = $.extend(defaults, options);
		
		var shown = false;
		
		// Get the glow HTML
		var glowHTML = '<div class="glow">' +
							'<div class="tr">' +
								'<div class="tl">' +
									'<div class="tm">&nbsp;</div>' +
								'</div>' +
							'</div>' +
							'<div class="mr">' +
								'<div class="ml">&nbsp;</div>' +
							'</div>' +
							'<div class="br">' +
								'<div class="bl">' +
									'<div class="bm">&nbsp;</div>' +
								'</div>' +
							'</div>' +
						'</div>';
		
		// Make the HTML a jQuery DOM object
		var glow = $(glowHTML);
		
		// Get the offset and dimensions of the element to glow
		var eOffset = this.offset();
		var eLeft = eOffset.left - 6.5;
		var eTop = eOffset.top - 6;
		var eHeight = this.outerHeight() - 12;
		var eWidth = this.outerWidth() + 13;
		
		// Set the height, width & position of the glow
		glow.css({ 'width': eWidth + 'px', 'top': eTop + 'px', 'left': eLeft + 'px' });
		$('.ml', glow).css('height', eHeight + 'px');
		
		glow.hide().appendTo('body');
		
		glow.mouseout(function () {
			$(this).fadeOut();
		});
		
		var element = this;
		
		element.add(this.children());
		
		element.mouseover(function() {
			glow.fadeIn();
		});		
		
		
		
	}
	
	
	/**
	 * function toolTip [deprecated]
	 * 
	 * Binds showing of tool tip on hover
	 *
	 */
	$.fn.toolTip = function(options) {
		var defaults = {
			distance: 10,
			time: 300,
			hideDelay: 450,
			text: "Click this item to edit it.",
			id: ''
		};
		
		var options = $.extend(defaults, options);
		
		var hideDelayTimer = null;
		
		var beingShown = false;
		var shown = false;
		var trigger = this;
		
		// Set up the tooltip HTML and attributes	
		var tooltip = $('<div class="tooltip"><div class="tooltipMid"></div><div class="tooltipBtm"></div></div>');
		tooltip.attr('id', defaults.id);
		$('.tooltipMid', tooltip).html(defaults.text);
		
		// Hide the tooltip
		tooltip.css('opacity', 0);
		
		// Append to the body
		$('body').append(tooltip);
		
		// Need the element position
		var eOffset = this.offset();
		var eTop = eOffset.top;
		var eLeft = eOffset.left;
				
		var tTop = eTop - tooltip.height() + defaults.distance;
		var tLeft = eLeft + 10;
		
		
		$(this).mouseover(function () {
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			if (beingShown || shown) {
			    // don't trigger the animation again
			    return;
			} else {
			    // reset position of info box
			    beingShown = true;
			
			    tooltip.css({
			        top: tTop,
			        left: tLeft,
			        display: 'block'
			    }).animate({
			        top: '-=' + defaults.distance + 'px',
			        opacity: 1
			    }, defaults.time, 'swing', function() {
			        beingShown = false;
			        shown = true;
			    });
			}
			
			return false;
		}).mouseout(function () {
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			hideDelayTimer = setTimeout(function () {
			    hideDelayTimer = null;
			    tooltip.animate({
			        top: '-=' + defaults.distance + 'px',
			        opacity: 0
			    }, defaults.time, 'swing', function () {
			        shown = false;
			        tooltip.css('display', 'none');
			    });
			
			}, defaults.hideDelay);
			
			return false;
		});	
	
	}
		
	
	/**
	 * function toolBox
	 * 
	 * Builds a toolbox with tools based on css classes (e.g. class="editable-upload-position-background")
	 * Figures out which elements it needs to add based on DOM?
	 *
	 */
	$.fn.toolBox = function() {
	
	}
	
	
	/**
	 * function colorTool
	 * 
	 * Adds a color picker tool.  Takes in isBackground boolean
	 *
	 */
	$.fn.colorTool = function(isBackground) {
	
	}
	
	
	/**
	 * function uploadTool
	 * 
	 * Adds an uploadify uploader tool.  Use boolean colorMatch to add color matching controls
	 *
	 */
	$.fn.uploadTool = function(colorMatch) {
	
	}
	


})(jQuery)
$(document).ready(function() {
	$('html').editable();
});