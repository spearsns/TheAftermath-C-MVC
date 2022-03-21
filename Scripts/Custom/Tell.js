$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var gameName = urlParams.get("game");
	$("#campaignName").val(gameName);

    $("#adminBtn").click(function () {
		$.ajax({
			type: 'POST',
			url: 'GetGameData',
			data: '{Name: "' + gameName + '" }',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success:
				function (result) {
					$("#season").val(result.Season);
					$("#year").val(result.Year);
					$("#description").html(result.Description);
					$("#adminModal").modal("toggle");
				}
		});
	});

	$("#lockBtn").on("click", function () {
		if ($(this).hasClass("unlock")) {
			$.ajax({
				type: 'POST',
				url: 'UnlockGame',
				data: '{Name: "' + gameName + '" }',
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				success:
					function (result) {
						if (result === "Success") $("#lockBtn").removeClass("btn-light border-dark").addClass("btn-secondary border-light").html("LOCK GAME");
					}
			});
		}
		else {
			$.ajax({
				type: 'POST',
				url: 'LockGame',
				data: '{Name: "' + gameName + '" }',
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				success:
					function (result) {
						if (result === "Success") $("#lockBtn").removeClass("btn-secondary border-light").addClass("btn-light border-dark unlock").html("UNLOCK GAME");
					}
			});
        }
	});

	$("#dateBtn").click(function () {
		var season = $("#season").val();
		var year = $("#year").val();

		$.ajax({
			type: 'POST',
			url: 'UpdateDate',
			data: JSON.stringify({ Name: gameName, Season: season, Year: year }),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success:
				function (result) {
					if (result === "Success") {
						$("#adminMsg").html("DATE UPDATED");
						$("#adminAlert").removeClass("d-none");
					}
				}
		});
	});

	$("#descriptionBtn").click(function () {
		var input = $("#description").val();

		$.ajax({
			type: 'POST',
			url: 'UpdateDescription',
			data: JSON.stringify({ Name: gameName, Input: input }),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success:
				function (result) {
					if (result === "Success") {
						$("#adminMsg").html("DESCRIPTION UPDATED");
						$("#adminAlert").removeClass("d-none");
                    }
				}
		});
	});

});