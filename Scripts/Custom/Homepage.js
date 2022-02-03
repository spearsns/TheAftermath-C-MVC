$(document).ready(function () {
	var client;
	if ($("#sessionUsername").length > 0) client = $("#sessionUsername").html();

	function getActiveList() {
		$.ajax({
			type: 'GET',
			url: 'Home/GetActiveList',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success:
				function (results) {
					for (var i = 0; i < results.length; i++) {
						var user = results[i];
						var css;

						if (user.Username == client) continue;

						if (user.Play == true) css = "text-success";
						else if (user.Admin == true) css = "text-danger";
						else if (user.Tell == true) css = "text-primary";
						else css = "text-dark";

						$("#userList").append("<li class=" + css + ">" + user.Username + "</li>");
					}
				}
		});
	}
	getActiveList();
});