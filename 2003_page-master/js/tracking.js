$(document).ready(function() {
 
  // source url
  var source = document.referrer;

  if (source.trim() == "") {
    source = "default";
  } else {
    source = new URL(document.referrer).hostname;
  }

  sourceBody = { source: source };
  // sending the information
  $.ajax({
    url: "https://www.aisfexpo.com.au/api/source",
    type: "POST",
    dataType: "json",
    data: sourceBody,
    headers: {
      "Conent-Type": "application/x-www-form-urlencoded"
    },
    success: function(data, status, xhr) {
      console.log("data is obtained successfully");
    },
    error: function(xhr, status, err) {
      console.log(err);
    }
  });
});
