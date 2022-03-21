$(document).ready(function () {
	// GLOBAL VARIABLES
	var username = $("#sessionUsername").html();
	
	// PLAY BUTTON
	$("body").on("click", ".playBtn", function () {
		var gameName = $(this).data("name");
		var gameID = $(this).data("id");
		$(".gameHeader").html("PLAY " + gameName);
		$(".submitBtn").attr("data-target", gameName).attr("data-id", gameID);
		$("#passwordModal").modal("toggle");
	});
	// INFO BUTTON
	$("body").on("click", ".descriptionBtn", function () {
		var gameName = $(this).data("name");
		var gameID = $(this).data("id");

		$.ajax({
			type: 'POST',
			url: 'Games/GetGameData',
			data: '{Name: "' + gameName + '" }',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success:
				function (result) {
					$("#descSeason").val(result.Season);
					$("#descYear").val(result.Year);
					$("#descText").html(result.Description);
				}
		});

		$(".gameHeader").html(gameName + " DESCRIPTION");
		$("#descriptionModal").modal("toggle");
	});
	// TELL BUTTON
	$("body").on("click", ".tellBtn", function () {
		var gameName = $(this).data("name");
		var gameID = $(this).data("id");
		$(".gameHeader").html("TELL " + gameName);
		$(".submitBtn").attr("data-target", gameName).attr("data-id", gameID);
		$("#passwordModal").modal("toggle");
	});
	// ADMIN BUTTON
	$("body").on("click", ".adminBtn", function () {
		var gameName = $(this).data("name");
		var gameID = $(this).data("id");
		$(".gameHeader").html("ADMIN " + gameName);
		$(".submitBtn").attr("data-target", gameName).attr("data-id", gameID);
		$("#passwordModal").modal("toggle");
	});

	// SUBMIT BUTTON & PW VALIDATION
	$("body").on("click", ".submitBtn", function () {
		var header = $(".gameHeader").html();
		var gameName = $(this).data("target");
		var gameID = $(this).data("id");
		var enteredPW = $("#passwordInput").val();

		$.ajax({
			type: 'POST',
			url: 'Games/GetGamePW',
			data: '{Id: "' + gameID + '" }',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success:
				function (result) {
					if (header.indexOf("PLAY") >= 0) {
						if (enteredPW === result.PlayerPassword) {
							$(".gameHeader").html("PLAY " + gameName);

							$.ajax({
								type: 'GET',
								url: 'Characters/GetCharacters',
								dataType: 'json',
								success:
									function (results) {

										if (results.length === 0) $("#characterList").html("<h2 class='text-red text-center font-weight-bold'>NO RECORDS FOUND! BUILD A CHARACTER ALREADY!</div>");

										for (var i = 0; i < results.length; i++) {

											var obj = results[i];
											if (obj.Status !== "DECEASED") {
												$("#characterList").append(
													"<div class='row'>" +
													"<div class='col-lg-1'></div>" +
													"<div class='col-12 col-lg-2'>" +
													"<a href='Games/Play?game="+ gameName +"&char="+ obj.Name +"&user="+ username +"' class='btn btn-block btn-warning font-weight-bold my-2 px-0 charSelectBtn' data-name='" + obj.Name + "' type='button' >" + obj.Name + "</a>" +
													"</div>" +
													"<div class='col-12 col-lg-2'>" +
													"<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Status + "</h5>" +
													"</div>" +
													"<div class='col-12 col-lg-2'>" +
													"<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Background + "</h5>" +
													"</div>" +
													"<div class='col-6 d-lg-none'>" +
													"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>TOTAL EXP:</h5>" +
													"</div>" +
													"<div class='col-6 col-lg-2'>" +
													"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.TotalExp + "</h5>" +
													"</div>" +
													"<div class='col-6 d-lg-none'>" +
													"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>EXP POOL:</h5>" +
													"</div>" +
													"<div class='col-6 col-lg-2'>" +
													"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.AvailableExp + "</h5>" +
													"</div>" +
													"<div class='col-lg-1'></div>" +
													"</div>" +
													"<hr class='d-md-none'>"
												);
											}
										}
									}
							});

							$("#passwordModal").modal("hide");
							$("#charSelectModal").modal("toggle");
						}
						else {
							$("#errorMsg").html("INVALID PASSWORD").removeClass("d-none");
							playerPW = null;
							adminPW = null;
						}
					}
					else if (header.indexOf("TELL") >= 0) {
						if (enteredPW === result.AdminPassword) {
							location.href = "Games/Tell?game=" + gameName + "&user=" + username;
						}
						else {
							$("#errorMsg").html("INVALID PASSWORD").removeClass("d-none");
							playerPW = null;
							adminPW = null;
						}
					}
					else { // ADMIN
						if (enteredPW === result.AdminPassword) {
							location.href = "Games/Admin?game=" + gameName + "&user=" + username;
						}
						else {
							$("#errorMsg").html("INVALID PASSWORD").removeClass("d-none");
							playerPW = null;
							adminPW = null;
						}
					}
				}
		});		
	});
	// CANCEL BUTTONS
	$("body").on("click", ".cancelBtn", function () {
		$("#passwordInput").val(null);
		$("#errorMsg").html("").addClass("d-none");
	});
});