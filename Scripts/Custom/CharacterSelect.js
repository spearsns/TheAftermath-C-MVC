$(document).ready(function () {

	var dead = false;

	$.ajax({
		type: 'GET',
		url: 'Characters/GetCharacters',
		dataType: 'json',
		success:
			function (results) {

				if (results.length == 0) $("#characterList").html("<h2 class='text-red text-center font-weight-bold'>NO RECORDS FOUND! BUILD A CHARACTER ALREADY!</div>") 

				for (var i = 0; i < results.length; i++) {

					var obj = results[i];
					if (obj.Status != "DECEASED") {
						$("#characterList").append(
							"<div class='row'>" +
							"<div class='col-md-1'></div>" +
							"<div class='col-12 col-md-2'>" +
							"<a href='/Characters/CharacterManagement?name="+ obj.Name +"' class='btn btn-block btn-warning font-weight-bold my-2 px-0 charSelectBtn' data-name='" + obj.Name + "' type='button' >" + obj.Name + "</a>" +
							"</div>" +
							"<div class='col-12 col-md-2'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Status + "</h5>" +
							"</div>" +
							"<div class='col-12 col-md-2'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Background + "</h5>" +
							"</div>" +
							"<div class='col-6 d-md-none'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>TOTAL EXP:</h5>" +
							"</div>" +
							"<div class='col-6 col-md-2'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.TotalExp + "</h5>" +
							"</div>" +
							"<div class='col-6 d-md-none'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>EXP POOL:</h5>" +
							"</div>" +
							"<div class='col-6 col-md-2'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.AvailableExp + "</h5>" +
							"</div>" +
							"<div class='col-md-1'></div>" +
							"</div>" +
							"<hr class='d-md-none'>"
						);
					}
					else { // DEAD
						dead = true;
						$("#characterGraveyard").append(
							"<div class='row'>" +
							"<div class='col-12 col-md-4'>" +
							"<a class='btn btn-block btn-warning font-weight-bold my-1 px-0 charSelectBtn' data-name='" + obj.Name + "' type='button' >" + obj.Name + "</a>" +
							"</div>" +
							"<div class='col-12 col-md-4'>" +
							"<h5 class='font-weight-bold my-1 px-0 text-uppercase text-center text-white'>" + obj.Background + "</h5>" +
							"</div>" +
							"<div class='col-6 d-md-none'>" +
							"<h5 class='font-weight-bold my-3 px-0 text-center text-white'>TOTAL EXP:</h5>" +
							"</div>" +
							"<div class='col-6 col-md-4'>" +
							"<h5 class='font-weight-bold my-1 px-0 text-center text-white'>" + obj.TotalExp + "</h5>" +
							"</div>" +
							"</div>" +
							"<hr class='d-md-none'>"
						);
                    }
				}
			}
	});

	if (dead == false) $(".graveyard").addClass("d-none");
});