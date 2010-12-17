jQuery.fn.gallSlide = function(_options){
	// defaults options	
	var _options = jQuery.extend({
		duration: 700,
		autoSlide: 5000
	},_options);

	return this.each(function(){
		var _hold = $(this);
		var _speed = _options.duration;
		var _timer = _options.autoSlide;
		var _wrap = _hold.find('ul.slider');
		var _el = _hold.find('ul.slider > li');
		var _next = _hold.find('a.link-next');
		var _prev = _hold.find('a.link-prev');
		var _count = _el.index(_el.filter(':last'));
		var _w = _el.outerWidth();
		var _wrapHolderW = Math.ceil(_wrap.parent().width()/_w);
		var _active = 0;
		
		var _btn = $('<ul class="splash-btn"></ul>');
		_hold.append(_btn);
		_el.each(function(_i){
			_btn.append('<li><a href="#">'+(_i+1)+'</a></li>');
		});
		_btn = _btn.find('a');
		_btn.eq(_active).addClass('active');
		function scrollEl(){
			_wrap.eq(0).animate({
				marginLeft: -(_w * _active) + "px"
			}, {queue:false, duration: _speed});
			_btn.removeClass('active');
			_btn.eq(_active).addClass('active');
		}
		_btn.click(function(){
			if(_t) clearTimeout(_t);
			_active = _btn.index($(this));
			scrollEl();
			runTimer();
			return false;
		});
		
		function runTimer(){
			_t = setInterval(function(){
				_active++;
				if (_active > (_count - _wrapHolderW + 1)) _active = 0;
				scrollEl();
			}, _timer);
		}
		runTimer();
	});
}

$(document).ready(function(){
	$('div.visual').gallSlide({
		duration: 700,
		autoSlide: 4000
	});
});
