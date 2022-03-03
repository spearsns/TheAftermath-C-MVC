$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var charName = urlParams.get("char");
	var userName = urlParams.get("user");
	var gameName = urlParams.get("game");
	var charSex = $("#sex").val();

	$("#campaignName").val(gameName);
	if (charSex == "Female") {
		$("#idMarksBG").css("background-image", "url('../../Content/Images/Embed/VirtruvianWoman-1200x1200-50o.png')");
		$(".facialHairSlot").html("");
	}

	// BUTTONS
	$("#IDMarksBtn").click(function () {
		$.ajax({
			type: 'POST',
			url: 'GetIDMarks',
			data: JSON.stringify({ Name: charName, User: userName }),
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {
					//console.log(results);

					$("#status").val(results.Status);
					$("#hairStyle-ID").val(results.HairStyle);
					$("#Hairstyle").val(results.HairStyle);
					$("#facialHair-ID").val(results.FacialHair);
					$("#facialHair").val(results.FacialHair);
					$("#head").val(results.Head);
					$("#face").val(results.Face);
					$("#neck").val(results.Neck);
					$("#leftShoulder").val(results.LeftShoulder);
					$("#rightShoulder").val(results.RightShoulder);
					$("#leftRibs").val(results.LeftRibs);
					$("#rightRibs").val(results.RightRibs);
					$("#stomach").val(results.Stomach);
					$("#lowerBack").val(results.LowerBack);
					$("#groin").val(results.Groin);
					$("#rear").val(results.Rear);
					$("#leftBicep").val(results.LeftBicep);
					$("#rightBicep").val(results.RightBicep);
					$("#leftForearm").val(results.LeftForearm);
					$("#rightForearm").val(results.RightForearm);
					$("#leftHand").val(results.LeftHand);
					$("#rightHand").val(results.RightHand);
					$("#leftThigh").val(results.LeftThigh);
					$("#rightThigh").val(results.RightThigh);
					$("#leftCalf").val(results.LeftCalf);
					$("#rightCalf").val(results.RightCalf);
					$("#leftFoot").val(results.LeftFoot);
					$("#rightFoot").val(results.RightFoot);
				}
		});
		$("#idMarksModal").modal("toggle");
	});

	// LAYOUT STANDARDS
	var combatSlot = 12;
	var socialSlot = 5;
	var covertSlot = 4;
	var survivalSlot = 4;
	var medicalSlot = 3;
	var scienceSlot = 1;
	var craftsmanSlot = 2;
	var constructionSlot = 2;
	var technologySlot = 1;
	var transportationSlot = 1;

	// CURRENT SKILLS
	function getCurrentSkills() {
		$.ajax({
			type: 'POST',
			url: '../Characters/GetCurrentSkills',
			data: '{Name: "' + charName + '" }',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {

					for (i = 0; i < results.length; i++) {
						// SORT DATA
						var skill = results[i].Name;
						var skillClass = results[i].Class;
						var skillType = results[i].Type;
						var skillValue = results[i].Value;

						if (skillType == "Standard") continue;
						// DETERMINE SLOT
						var slotNum;
						if (skillClass == "Combat") slotNum = combatSlot;
						else if (skillClass == "Affiliation") { skillClass = "Social"; slotNum = socialSlot; }
						else if (skillClass == "Languages") { skillClass = "Social"; slotNum = socialSlot; }
						else if (skillClass == "Social") slotNum = socialSlot;
						else if (skillClass == "Covert") slotNum = covertSlot;
						else if (skillClass == "Survival") slotNum = survivalSlot;
						else if (skillClass == "Craftsman") slotNum = craftsmanSlot;
						else if (skillClass == "Construction") slotNum = constructionSlot;
						else if (skillClass == "Medical") slotNum = medicalSlot;
						else if (skillClass == "Science") slotNum = scienceSlot;
						else if (skillClass == "Technology") slotNum = technologySlot;
						else if (skillClass == "Transportation") slotNum = transportationSlot;
						
						var nextSlot
						if (skillClass == "Combat") nextSlot = slotNum + 2;
						else nextSlot = slotNum + 1;
						// RENDER HTML FOR NEXT SKILL SLOT
						$("#" + skillClass.toLowerCase() + "-" + slotNum).html(
							'<h6 class="font-weight-bold text-center my-3 text-uppercase">' + skill + '</h6>'
						);
						$("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
							'<div class="input-group my-2">' +
							'<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skill + '" value="' + skillValue + '" readonly />' +
							'</div>'
						);
						// INCREASE COUNT ON APPROPRIATE SLOT
						if (skillClass == "Combat") combatSlot += 1;
						else if (skillClass == "Social") socialSlot += 1;
						else if (skillClass == "Covert") covertSlot += 1;
						else if (skillClass == "Survival") survivalSlot += 1;
						else if (skillClass == "Medical") medicalSlot += 1;
						else if (skillClass == "Science") scienceSlot += 1;
						else if (skillClass == "Technology") technologySlot += 1;
						else if (skillClass == "Transportation") transportationSlot += 1;
					}
				}
		});
	}
	getCurrentSkills();

	// CURRENT ABILITIES
	function getCurrentAbilities() {
		$.ajax({
			type: 'POST',
			url: '../Characters/GetCurrentAbilities',
			data: '{Name: "' + charName + '" }',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {
					for (i = 0; i < results.length; i++) {
						// SORT DATA
						var ability = results[i].Name;
						var description = results[i].Description;
						var effects = results[i].Effects;
						var slot = i + 1;

						// RENDER HTML FOR ABILITY SLOT
						$("#ability-" + slot).html(
							"<div class='input-group my-2'>" +
							"<input class='form-control text-center px-0 py-0 font-weight-bold' name='Ability-" + slot + "' data-description='" + description + "' data-effect='" + effects + "' type='text' value='" + ability + "' readonly>" +
							"</div>"
						);
					}
				}
		});
	}
	getCurrentAbilities();	
});