$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
    var gameName = urlParams.get("game");

	$.ajax({
		type: 'POST',
		url: 'GetGameData',
		data: '{Name: "' + gameName + '" }',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		success:
			function (result) {
				$("#gameName").val(gameName);
				$("#season").val(result.Season);
				$("#year").val(result.Year);
				$("#description").html(result.Description);
			}
	});
});