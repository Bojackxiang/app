$(document).ready(function() {
	// get source
	var query_str = decodeURIComponent(window.location.search.substring(1));
	var url_vars = query_str.split('&');
	var source = 'default';
	url_vars.forEach(function(v, index) {
		var v_arr = v.split('=');
		if (v_arr[0] === 'source') {
			source = v_arr[1];
			return;
		}
	});
	source = source || 'default';	

	$.ajax({
		url: 'https://www.aisfexpo.com.au/api/pv-sources',
		type: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		dataType: 'json',
		data: JSON.stringify({
			sourceId: source,
			campaignId: 'austop_20170902_aisf' // for this campaign
		}),
		success: function(data, status, xhr) {
			if (typeof data === 'string') {
				data = JSON.parse(data);
			}
			if (data && data.success) {
				console.log('Source logged');
			} else {
				console.error(`Failed to log source: ${data ? data.message : ''}`);
			}
		},
		error: function(xhr, status, err) {
			console.error(`Failed to log source: status=${status}`);
			console.error(err);
		}
	});
});
