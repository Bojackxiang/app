var regex_email = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/**
 * Validate email
 */
var validate_email = function(email) {
	if (!email)
		return false;
		
	if(email.length>254)
		return false;

	var valid = regex_email.test(email);
	if(!valid)
		return false;

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if(parts[0].length>64)
		return false;

	var domain_parts = parts[1].split(".");
	if(domain_parts.some(function(part) { return part.length>63; }))
		return false;

	return true;
};

/**
 * Validate form
 */
var validate_form = function(name, phone, email, interests) {
	var validate_pass = true;
	if (!name) {
		validate_pass = false;
		$('#errorMsgName').removeClass('hidden');
		$('input[name="regName"]').addClass('input-err');
	} else {
		$('#errorMsgName').addClass('hidden');
		$('input[name="regName"]').removeClass('input-err');
	}
	if (!phone) {
		validate_pass = false;
		$('#errorMsgPhone').removeClass('hidden');
		$('input[name="regPhone"]').addClass('input-err');
	} else {
		$('#errorMsgPhone').addClass('hidden');
		$('input[name="regPhone"]').removeClass('input-err');
	}
	if (!validate_email(email)) {
		validate_pass = false;
		$('#errorMsgEmail').removeClass('hidden');
		$('input[name="regEmail"]').addClass('input-err');
	} else {
		$('#errorMsgEmail').addClass('hidden');
		$('input[name="regEmail"]').removeClass('input-err');
	}
	if (!interests || interests.length <= 0) {
		validate_pass = false;
		$('#errorMsgInterest').removeClass('hidden');
	} else {
		$('#errorMsgInterest').addClass('hidden');
	}
	return validate_pass;
};

var save_form_mock = function(response) {
	return function(params) {
		params.success(response);
	};
}

$(document).ready(function() {
	$('#register').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		var name = $('input[name="regName"]').val() ? $('input[name="regName"]').val().trim() : '';
		var phone = $('input[name="regPhone"]').val() ? $('input[name="regPhone"]').val().trim() : '';
		var email = $('input[name="regEmail"]').val() ? $('input[name="regEmail"]').val().trim() : '';
		var interests = [];
		$('input:checkbox[name="regInterest"]:checked').each(function() {
			interests.push($(this).val().trim());
		});
		if (!validate_form(name, phone, email, interests)) {
			return;
		}

		// validation passed, post data to api
		var body = {
			name: name,
			phone: phone,
			email: email,
			interests: interests
		};
		$.ajax({
			url: 'https://www.aisfexpo.com.au/api/form-results',
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			dataType: 'json',
			data: JSON.stringify(body),
			success: function(data, status, xhr) {
				console.log(data);
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}
				if (data && data.success) {
					console.log('Form submitted');
					$('#regForm').fadeOut(300);
					$('#formSubmitMsg').removeClass('alert-danger').html('恭喜您，报名成功！感谢您的参与。').addClass('alert-success').fadeIn(300);
				} else {
					console.error(`Failed to submit form: ${data ? data.message : ''}`);
					$('#formSubmitMsg').removeClass('alert-success').html('您的报名暂时无法提交，请您稍后重试！').addClass('alert-danger');
				}
			},
			error: function(xhr, status, err) {
				console.log(xhr);
				console.log(err);
				$('#formSubmitMsg').removeClass('alert-success').html('您的报名暂时无法提交，请您稍后重试！').addClass('alert-danger');
			}
		});
	});
});
