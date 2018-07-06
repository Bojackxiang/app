$(document).ready(function() {
	new WOW().init(); // init WOW

	$('#flipCountDownBox').flipcountdown({
		size: 'md',
		beforeDateTime: '9/02/2017 12:00:00'
	}); // init countdown

	$(window).scroll(function() {
		if ($(window).width() > 990) {
			if ($(window).scrollTop() > 80) {
				if ($('.topbar').css('display') === 'none') {
					$('.topbar').css('display', 'inherit').animate({
						'opacity': 1
					}, 200);
				}
			} else {
				if ($('.topbar').css('display') === 'block') {
					$('.topbar').animate({
						'opacity': 0
					}, 200, function() {
						$(this).css('display', 'none');
					});
				}
			}
		}
	}); // listen to scroll to show/hide topbar on pc

	$(window).resize(function() {
		if ($(window).width() < 990) {
			$('.topbar').css('display', 'none');
			$('.topbar').css('opacity', '0');
		} else {
			$('.topbar').css('display', 'inherit');
		}
	}); // listen to resize to set topbar

	$('.btn-go-reg').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('html, body').animate({
			scrollTop: $('#regSection').offset().top
		}, 500);
	}); // scroll to reg form
});