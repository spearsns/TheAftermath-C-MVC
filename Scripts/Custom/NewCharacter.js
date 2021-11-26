$(document).ready(function () {
	// MOBILE VIEW
	$("#submitBtn").prop("disabled", true);
	var lg = window.matchMedia("(min-width: 992px)");

	function altText(lg) {
		if (lg.matches) {
			$("h6[data-longTxt], h5[data-longTxt], h4[data-longTxt], button[data-longTxt]").each(function () {
				var text = $(this).attr("data-longTxt");
				$(this).html(text);
			});
			$("#sexBtn, #strategyBtn").removeClass("btn-block").addClass("w-75 mx-auto");
		} else {
			$("h6[data-longTxt], h5[data-longTxt], h4[data-longTxt], button[data-longTxt]").each(function () {
				var text = $(this).attr("data-shortTxt");
				$(this).html(text);
			});
			$("#sexBtn, #strategyBtn").removeClass("w-75 mx-auto").addClass("btn-block");
		}
	}
	altText(lg);
	lg.addListener(altText);

	/* -- GLOBAL VARIABLES -- */
	// INITIAL ATTRIBUTES
	var memory = parseInt( $("#memory").val() );
	var logic = parseInt( $("#logic").val() );
	var perception = parseInt( $("#perception").val() );
	var willpower = parseInt( $("#willpower").val() );
	var charisma = parseInt( $("#charisma").val() );

	var strength = parseInt( $("#strength").val() );
	var endurance = parseInt( $("#endurance").val() );
	var agility = parseInt( $("#agility").val() );
	var speed = parseInt( $("#speed").val() );
	var beauty = parseInt( $("#beauty").val() );

	var strategy = $("input[name='Strategy']").val();
	var ethnicity = $("input[name='Ethnicity']").val();
	var background = rollBG();
	var hairColor = rollHC();

	// ORIGINAL ATTRIBUTE VALUES
	var omemory = memory;
	var ologic = logic;
	var operception = perception;
	var owillpower = willpower;
	var ocharisma = charisma;
	var ostrength = strength;
	var oendurance = endurance;
	var oagility = agility;
	var ospeed = speed;
	// DERIVED ATTRIBUTES
	var actions = Math.floor(speed / 2);
	var sequence = Math.floor( (perception + speed) / 2 );
	var attrPts = Math.floor(willpower / 2);
	var skillPts = willpower;

	/* -- DEMOGRAPHIC INFORMATION -- */
	function rollBG() {
		var bgRoll = (roll(0, 9) * 10) + roll(1, 10);
		if (strategy == "Order") {
			if (bgRoll <= 20) return "Soldier";
			else if (bgRoll >= 21 && bgRoll <= 40) return "Cop";
			else if (bgRoll >= 41 && bgRoll <= 60) return "Militia";
			else return "Guard"; 
		}
		else if (strategy == "Exchange") {
			if (bgRoll <= 10) return "Medic";
			else if (bgRoll >= 11 && bgRoll <= 25) return "Technician";
			else if (bgRoll >= 26 && bgRoll <= 45) return "Craftsman";
			else if (bgRoll >= 46 && bgRoll <= 70) return "Courier";
			else return "Trader";
		}
		else if (strategy == "Independence") {
			if (bgRoll <= 20) return "Outdoorsman";
			else if (bgRoll >= 21 && bgRoll <= 40) return "Handyman";
			else if (bgRoll >= 41 && bgRoll <= 80) return "Scavenger";
			else return "Farmer";
		}
		else {
			if (bgRoll <= 20) return "Bandit";
			else if (bgRoll >= 21 && bgRoll <= 50) return "Gangster";
			else if (bgRoll >= 51 && bgRoll <= 90) return "Opportunist";
			else return "Prisoner";
        }
	}

	function rollHC() {
		var hairRoll = (roll(0, 9) * 10) + roll(1, 10);
		if (ethnicity == "Caucasian") {
			if (hairRoll <= 25) return "Black";
			else if (hairRoll >= 26 && hairRoll <= 40) return "Dark Brown";
			else if (hairRoll >= 41 && hairRoll <= 65) return "Brown";
			else if (hairRoll >= 66 && hairRoll <= 90) return "Dirty Blonde";
			else if (hairRoll >= 91 && hairRoll <= 99) return "Blonde";
			else return "Red";
		}
		else if (ethnicity == "Middle-Eastern") {
			if (hairRoll <= 80) return "Black";
			else if (hairRoll >= 81 && hairRoll <= 90) return "Dark Brown";
			else if (hairRoll >= 91 && hairRoll <= 99) return "Brown";
			else return "Red";
		}
		else if (ethnicity == "Hispanic") {
			if (hairRoll <= 70) return "Black";
			else if (hairRoll >= 71 && hairRoll <= 90) return "Dark Brown";
			else if (hairRoll >= 91 && hairRoll <= 99) return "Brown";
			else return "Red";
		}
		else if (ethnicity == "Asian") {
			if (hairRoll <= 75) return "Black";
			else if (hairRoll >= 76 && hairRoll <= 90) return "Dark Brown";
			else return "Brown";
		}
		else if (ethnicity == "African-American") {
			if (hairRoll <= 92) return "Black";
			else if (hairRoll >= 93 && hairRoll <= 99) return "Brown";
			else return "Red";
		}
		else {
			if (hairRoll <= 95) return "Black";
			else return "Brown";
		}
	}

	if ($("#willpower").val() >= 12) $("#strategyBtn").prop("disabled", false);

	$("#background").val(background);
	$("#hairColor").val(hairColor);
	$("#sequence").val(sequence);
	$("#actions").val(actions);
	$(".attrPtsVal").val(attrPts);
	$("#skillPts").val(skillPts);

	/* -- GLOBAL FUNCTIONS -- */
	function roll(min, max) {
		return Math.round(Math.random() * (max - min)) + min;
	}
	// CHECKS
	function checkAttrPts() {
		if (attrPts == 0) {
			$(".attrPtsLbl").addClass("d-none");
			$(".attrPtsVal").addClass("d-none");
			$("#attrPtsRow").addClass("d-none");
			$(".attributeBtn").prop("disabled", true);
			$("#sexBtn").prop("disabled", true);
			$("#strategyBtn").prop("disabled", true);
			$(".trainGenBtn").prop("disabled", false);
			$(".trainAdvBtn").prop("disabled", false);
			$(".addSkillBtn").prop("disabled", false);
			getSkills();
		}
		else {
			$(".attrPtsVal").val(attrPts);
			$(".addSkillBtn").prop("disabled", true);
		}
	}

	function checkChoices() {
		if (combatChoices == 0) $("#combatChoiceLbl, #combatChoiceVal").addClass("d-none");
		if (covertChoices == 0) $("#covertChoiceLbl, #covertChoiceVal").addClass("d-none");
		if (socialChoices == 0) $("#socialChoiceLbl, #socialChoiceVal").addClass("d-none");
		if (survivalChoices == 0) $("#survivalChoiceLbl, #survivalChoiceVal").addClass("d-none");
		if (medicalChoices == 0) $("#medicalChoiceLbl, #medicalChoiceVal").addClass("d-none");
		if (scienceChoices == 0) $("#scienceChoiceLbl, #scienceChoiceVal").addClass("d-none");
		if (craftsmanChoices == 0) $("#craftsmanChoiceLbl, #craftsmanChoiceVal").addClass("d-none");
		if (constructionChoices == 0) $("#constructionChoiceLbl, #constructionChoiceVal").addClass("d-none");
		if (technologyChoices == 0) $("#technologyChoiceLbl, #technologyChoiceVal").addClass("d-none");
		if (transportationChoices == 0) $("#transportationChoiceLbl, #transportationChoiceVal").addClass("d-none");
	}

	function checkSkillPts() {
		if (skillPts == 0) {
			$("#skillPtsLbl").addClass("d-none");
			$("#skillPtsVal").addClass("d-none");
			$("button").prop("disabled", true);
			$("#submitBtn").prop("disabled", false);
			$("#submitSlot").removeClass("d-none");
		}
	}

	/* -- ATTRIBUTES MANIPULATION --*/
	// -- SEX --
	$("#sexBtn").click(function () {
		var sex = $("#sex").val();
		$("#sexBtn").prop("disabled", true);
		if (sex == "Male") {
			$("#sex").val("Female");
			attrPts -= 1;
			checkAttrPts();
		}
		else if (sex == "Female"){
			$("#sex").val("Male");
			attrPts -= 1;
			checkAttrPts();
        }
	});
	// -- STRATEGY --
	$("#strategyBtn").click(function () { $("#strategyModal").modal("toggle"); });

	$(".strategyChoice").click(function () {
		var obackground = $("#background").val();
		strategy = $(this).data("choice");
		background = rollBG();
		attrPts -= 1;
		function resetChoices() {
			combatChoices = 0;
			$("#combatChoices").val(combatChoices);
			$("#combatChoiceLbl").addClass("d-none");
			$("#combatChoiceVal").addClass("d-none");
			covertChoices = 0;
			$("#covertChoices").val(covertChoices);
			$("#covertChoiceLbl").addClass("d-none");
			$("#covertChoiceVal").addClass("d-none");
			craftsmanChoices = 0;
			$("#craftsmanChoices").val(craftsmanChoices);
			$("#craftsmanChoiceLbl").addClass("d-none");
			$("#craftsmanChoiceVal").addClass("d-none");
			constructionChoices = 0;
			$("#constructionChoices").val(constructionChoices);
			$("#constructionChoiceLbl").addClass("d-none");
			$("#constructionChoiceVal").addClass("d-none");
			socialChoices = 0;
			$("#socialChoices").val(socialChoices);
			$("#socialChoiceLbl").addClass("d-none");
			$("#socialChoiceVal").addClass("d-none");
			survivalChoices = 0;
			$("#survivalChoices").val(survivalChoices);
			$("#survivalChoiceLbl").addClass("d-none");
			$("#survivalChoiceVal").addClass("d-none");
			medicalChoices = 0;
			$("#medicalChoices").val(medicalChoices);
			$("#medicalChoiceLbl").addClass("d-none");
			$("#medicalChoiceVal").addClass("d-none");
			scienceChoices = 0;
			$("#scienceChoices").val(scienceChoices);
			$("#scienceChoiceLbl").addClass("d-none");
			$("#scienceChoiceVal").addClass("d-none");
			technologyChoices = 0;
			$("#technologyChoices").val(technologyChoices);
			$("#technologyChoiceLbl").addClass("d-none");
			$("#technologyChoiceVal").addClass("d-none");
			transportationChoices = 0;
			$("#transportationChoices").val(transportationChoices);
			$("#transportationChoiceLbl").addClass("d-none");
			$("#transportationChoiceVal").addClass("d-none");
        }
		resetChoices();
		resetBG(obackground);
		$("#strategy").val(strategy);
		$("#background").val(background);
		checkAttrPts();
		$("#strategyModal").modal("toggle");
	});
	// RESET BACKGROUND
	function resetBG(obackground) {
		$.ajax({
			type: 'POST',
			url: '/Characters/GetBackgroundSkills',
			data: '{Background: "' + obackground + '" }',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (result) {
					var skillsArr = result.Skills.split(", ");
					for (i = 0; i < skillsArr.length; i++) {
						var skillName = skillsArr[i];
						$.ajax({
							type: 'POST',
							url: 'GetSkillData',
							data: '{Name: "' + skillName + '" }',
							dataType: 'json',
							contentType: "application/json; charset=utf-8",
							success:
								function (results) {
									var skill = results.Name;
									var parentID = String($("input[name = '" + skill + "'").parent().parent().attr("id"));
									var skillClass = results.Class;
									if (skillClass == "Affiliation" || skillClass == "Languages") skillClass = "Social";
									var slotNum = parseInt(parentID.split("-")[1]);
									var nextSlot = parseInt(slotNum + 1);
									$("*[data-skill='" + skill + "']").parent().parent().html(
										'<button class="btn btn-block btn-info border border-dark text-center font-weight-bold addSkillBtn my-2 mx-auto bgAdd" data-target="' + skillClass + "Skills" + '" type="button" disabled>ADD</button>'
									);
									$("input[name = '" + skill + "'").parent().parent().html(
										'<div class="input-group my-2">' +
										'<input class="form-control text-center px-0 py-0" name="" value="" readonly />' +
										'</div>'
									);
									$("#" + skillClass.toLowerCase() + "-" + nextSlot).html("&nbsp;");
									$("#" + skillClass.toLowerCase() + "Val-" + nextSlot).html("&nbsp;");
								}
						});
					}
				}

		});
	}

	// -- ATTRIBUTES --
	var original;
	// POPULATE MODAL
	$(".attributeBtn").click(function () {
		var choice = $(this).data("attr");
		if (choice == "memory") $("#currentAttr").attr("data-shorttxt", "MEM").attr("data-longtxt", "MEMORY");
		if (choice == "logic") $("#currentAttr").attr("data-shorttxt", "LOG").attr("data-longtxt", "LOGIC");
		if (choice == "perception") $("#currentAttr").attr("data-shorttxt", "PER").attr("data-longtxt", "PERCEPTION");
		if (choice == "willpower") $("#currentAttr").attr("data-shorttxt", "WILL").attr("data-longtxt", "WILLPOWER");
		if (choice == "charisma") $("#currentAttr").attr("data-shorttxt", "CHA").attr("data-longtxt", "CHARISMA");
		if (choice == "strength") $("#currentAttr").attr("data-shorttxt", "STR").attr("data-longtxt", "STRENGTH");
		if (choice == "endurance") $("#currentAttr").attr("data-shorttxt", "END").attr("data-longtxt", "ENDURANCE");
		if (choice == "agility") $("#currentAttr").attr("data-shorttxt", "AGL").attr("data-longtxt", "AGILITY");
		if (choice == "speed") $("#currentAttr").attr("data-shorttxt", "SPD").attr("data-longtxt", "SPEED");
		original = parseInt(eval("o" + choice));
		$("#originalAttrVal").val(original);
		$("#currentAttr").html(String(choice) + ":");
		$("#currentAttrVal").val(eval(choice));
		$("#attrConfirmBtn").data("attr", choice);
		$("#attributeModal").modal("toggle");
		altText(lg);
	});
	// BUTTONS
	$("#incAttrBtn").click(function () {
		var value = parseInt($("#currentAttrVal").val());
		if (attrPts >= 1 && value < 20) {
			attrPts -= 1;
			value += 1;
			$("#currentAttrVal").val(value);
			$(".attrPtsVal").val(attrPts);
		}
		else alert("Cannot Increase Furthers");
	});

	$("#decAttrBtn").click(function () {
		var value = parseInt($("#currentAttrVal").val());
		if (attrPts >= 0 && value > original) {
			attrPts += 1;
			value -= 1;
			$(".attrPtsVal").val(attrPts);
			$("#currentAttrVal").val(value);
		}
		else alert("Cannot Decrease Further");
	});

	$("#attrConfirmBtn").click(function () {
		var choice = $(this).data("attr");
		var value = $("#currentAttrVal").val();
		$("#" + choice).val(value);
		setAttributes();
		checkAttrPts();
		$("#attributeModal").modal("toggle");
	});

	$("#attrCancelBtn").click(function () {
		$(".attrPtsVal").val(attrPts);
		$("#attributeModal").modal("toggle");
	});
	// SET ATTRIBUTES
	function setAttributes() {
		memory = parseInt($("#memory").val());
		logic = parseInt($("#logic").val());
		perception = parseInt($("#perception").val());
		willpower = parseInt($("#willpower").val());
		charisma = parseInt($("#charisma").val());

		strength = parseInt($("#strength").val());
		endurance = parseInt($("#endurance").val());
		agility = parseInt($("#agility").val());
		speed = parseInt($("#speed").val());
		beauty = parseInt($("#beauty").val());

		actions = Math.floor(speed / 2);
		sequence = Math.floor((perception + speed) / 2);

		skillPts = willpower;
		$("#skillPts").val(skillPts);
		$("#sequence").val(sequence);
		$("#actions").val(actions);
		if ($("#willpower").val() >= 12) $("#strategyBtn").prop("disabled", false);
	}
	
	/* -- SKILL MANIPULATION -- */
	// GET SKILLS
	function getSkills() {
		promise = getStandards().then(getBackgroundData);
	}
	// GET STANDARD SKILLS
	function getStandards() {
		d = new $.Deferred();
		$.ajax({
			type: 'GET',
			url: '/Characters/GetStandards',
			dataType: 'json',
			success:
				function (results) {
					for (var i = 0; i < results.length; i++) {

						var obj = results[i];
						var value = parseInt(eval(obj.Formula) + roll(1, 10));
						$(".standardSkill").each(function () {
							if ($(this).attr("name") == "Skill-" + obj.Name) $(this).val(value);
						});
					}
				}
		});
		d.resolve();
		return d.promise()
	}

	// BACKGROUND SKILL VARIABLES
	var combatChoices;
	var covertChoices;
	var craftsmanChoices;
	var constructionChoices;
	var socialChoices;
	var survivalChoices;
	var medicalChoices;
	var scienceChoices;
	var technologyChoices;
	var transportationChoices;
	var skillsArr = [];
	
	// GET BACKGROUND DATA
	function getBackgroundData() {
		// LOCAL VARIABLES
		var combatSlot = 10;
		var socialSlot = 5;
		var covertSlot = 4;
		var survivalSlot = 4;
		var medicalSlot = 3;
		var scienceSlot = 1;
		var craftsmanSlot = 2;
		var constructionSlot = 2;
		var technologySlot = 1;
		var transportationSlot = 1;

		d = new $.Deferred();

		$.ajax({
			type: 'POST',
			url: '/Characters/GetBackgroundData',
			data: '{Background: "' + background + '" }',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {
					if (results.Combat != 0) {
						combatChoices = results.Combat;
						$("#combatChoices").val(combatChoices);
						$("#combatChoiceLbl").removeClass("d-none");
						$("#combatChoiceVal").removeClass("d-none");
					}
					if (results.Covert != 0) {
						covertChoices = results.Covert;
						$("#covertChoices").val(covertChoices);
						$("#covertChoiceLbl").removeClass("d-none");
						$("#covertChoiceVal").removeClass("d-none");
					}
					if (results.Construction != 0) {
						constructionChoices = results.Construction;
						$("#constructionChoices").val(constructionChoices);
						$("#constructionChoiceLbl").removeClass("d-none");
						$("#constructionChoiceVal").removeClass("d-none");
					}
					if (results.Craftsman != 0) {
						craftsmanChoices = results.Craftsman;
						$("#craftsmanChoices").val(craftsmanChoices);
						$("#craftsmanChoiceLbl").removeClass("d-none");
						$("#craftsmanChoiceVal").removeClass("d-none");
					}
					if (results.Social != 0) {
						socialChoices = results.Social;
						$("#socialChoices").val(socialChoices);
						$("#socialChoiceLbl").removeClass("d-none");
						$("#socialChoiceVal").removeClass("d-none");
					}
					if (results.Survival != 0) {
						survivalChoices = results.Survival;
						$("#survivalChoices").val(survivalChoices);
						$("#survivalChoiceLbl").removeClass("d-none");
						$("#survivalChoiceVal").removeClass("d-none");
					}
					if (results.Technology != 0) {
						technologyChoices = results.Technology;
						$("#technologyChoices").val(technologyChoices);
						$("#technologyChoiceLbl").removeClass("d-none");
						$("#technologyChoiceVal").removeClass("d-none");
					}
					if (results.Science != 0) {
						scienceChoices = results.Science;
						$("#scienceChoices").val(scienceChoices);
						$("#scienceChoiceLbl").removeClass("d-none");
						$("#scienceChoiceVal").removeClass("d-none");
					}
					if (results.Transportation != 0) {
						transportationChoices = results.Transportation;
						$("#transportChoices").val(transportationChoices);
						$("#transportChoiceLbl").removeClass("d-none");
						$("#transportChoiceVal").removeClass("d-none");
					}
					// BACKGROUND TRAINING
					if (results.Training != null) {
						var trainArr = results.Training.split(", ");
						for (i = 0; i < trainArr.length; i++) {
							var skillName = String(trainArr[i]);
							var ovalue = parseInt($("input[name='Skill-" + skillName + "']").val());
							var value = parseInt(ovalue) + parseInt(roll(1, 10) + roll(1, 10));
							$("input[name='Skill-" + skillName + "']").val(value);
							console.log("BG Training: "+ skillName + ": " + ovalue + " => " + value);
						}
					}
					// BACKGROUND SKILLS
					if (results.Skills != null) {
						console.log(results.Skills);
						for (i = 0; i < results.Skills.length; i++) {
							var skillName = results.Skills[i].Name;
							var skillType = results.Skills[i].Type;
							var skillClass = results.Skills[i].Class;
							var shortTxt = results.Skills[i].ShortTxt;
							var longTxt = results.Skills[i].LongTxt;
							var skillFormula = results.Skills[i].Formula;

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

							var border;
							var training;
							if (skillType == "General") { border = "border-warning"; training = "trainGenBtn"; }
							else if (skillType == "Advanced") { border = "border-danger"; training = "trainAdvBtn"; }
							else { border = "border-secondary"; training = "trainGenBtn"; } // skillClass == "Focus"

							var nextSlot
							if (skillClass == "Combat") nextSlot = slotNum + 2;
							else nextSlot = slotNum + 1;

							var skillValue = eval(skillFormula) + roll(1, 10);

							console.log("BG Skill: " + skillName + " => " + skillValue);
							// RENDER HTML FOR NEW SKILL
							$("#" + skillClass.toLowerCase() + "-" + slotNum).html(
								'<div class="input-group my-0">' +
								'<button class="btn btn-block border ' + border + ' bw-thick font-weight-bold my-1 px-0 ' + training + ' " data-skill="' + skillName + '" data-skillclass="' + skillClass + '" data-shortTxt="' + shortTxt + '" data-longTxt="' + longTxt + '" type="button">' + skillName + '</button>' +
								'</div>'
							);
							$("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
								'<div class="input-group my-2">' +
								'<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skillName + '" value="' + skillValue + '" readonly />' +
								'</div>'
							);
							// RENDER HTML FOR NEW ADD SKILL BTN
							$("#" + skillClass.toLowerCase() + "-" + nextSlot).html(
								'<button class="btn btn-block btn-info border border-dark text-center font-weight-bold addSkillBtn my-2 mx-auto" data-target="' + skillClass + "Skills" + '" type="button">ADD</button>'
							);
							$("#" + skillClass.toLowerCase() + "Val-" + nextSlot).html(
								'<div class="input-group my-2">' +
								'<input class="form-control text-center px-0 py-0" value="" readonly />' +
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
				}
		});
		altText(lg);
		d.resolve();
		return d.promise()
	}
	/*
	function getBackgroundSkills() {
		d = new $.Deferred();
		// HARD-CODED FOR STANDARD SKILLS
		var combatSlot = 10;
		var socialSlot = 5;
		var covertSlot = 4;
		var survivalSlot = 4;
		var medicalSlot = 3;
		var scienceSlot = 1;
		var craftsmanSlot = 2;
		var constructionSlot = 2;
		var technologySlot = 1;
		var transportationSlot = 1;

		if (typeof skillsArr != "undefined" && Array.isArray(skillsArr) && skillsArr.length > 0) {
			for (i = 0; i < skillsArr.length; i++) {
				var skill = skillsArr[i];
				console.log(skill);
				$.ajax({
					type: 'POST',
					traditional: true,
					url: '/Characters/GetSkillData',
					data: '{Name: "' + skill + '" }',
					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					success:
						function (results) {
							for (i = 0; i < results.length; i++) {

								var skillName = results.Name;
								var skillType = results.Type;
								var skillClass = results.Class;
								var shortTxt = results.ShortTxt;
								var longTxt = results.LongTxt;
								var skillFormula = results.Formula;

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

								var border;
								var training;
								if (skillType == "General") { border = "border-warning"; training = "trainGenBtn"; }
								else if (skillType == "Advanced") { border = "border-danger"; training = "trainAdvBtn"; }
								else { border = "border-secondary"; training = "trainGenBtn"; } // skillClass == "Focus"

								var nextSlot
								if (skillClass == "Combat") nextSlot = slotNum + 2;
								else nextSlot = slotNum + 1;

								var skillValue = eval(skillFormula) + roll(1, 10);

								console.log("BG Skill: " + skillName + " => " + skillValue);
								// RENDER HTML FOR NEW SKILL
								$("#" + skillClass.toLowerCase() + "-" + slotNum).html(
									'<div class="input-group my-0">' +
									'<button class="btn btn-block border ' + border + ' bw-thick font-weight-bold my-1 px-0 ' + training + ' " data-skill="' + skillName + '" data-skillclass="' + skillClass + '" data-shortTxt="' + shortTxt + '" data-longTxt="' + longTxt + '" type="button">' + skillName + '</button>' +
									'</div>'
								);
								$("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
									'<div class="input-group my-2">' +
									'<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skillName + '" value="' + skillValue + '" readonly />' +
									'</div>'
								);
								// RENDER HTML FOR NEW ADD SKILL BTN
								$("#" + skillClass.toLowerCase() + "-" + nextSlot).html(
									'<button class="btn btn-block btn-info border border-dark text-center font-weight-bold addSkillBtn my-2 mx-auto" data-target="' + skillClass + "Skills" + '" type="button">ADD</button>'
								);
								$("#" + skillClass.toLowerCase() + "Val-" + nextSlot).html(
									'<div class="input-group my-2">' +
									'<input class="form-control text-center px-0 py-0" value="" readonly />' +
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
		}
		d.resolve();
		return d.promise()
	}
	*/
	// CLIENT SIDE SKILL SELECTIONS
	// TRAIN GEN BUTTONS
	$("body").on("click", ".trainGenBtn", function () {
		var skill = $(this).data("skill");
		var skillClass = $(this).data("skillclass");
		var value = parseInt($("input[name='Skill-" + skill + "']").val());
		var skillType;

		if ($(this).hasClass("border-secondary")) skillType = "Focus";
		else skillType = "General";

		if (value < 150 && skillType == "General") {
			if (skillClass == "Combat" && combatChoices > 0) { combatChoices -= 1; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices > 0) { socialChoices -= 1; $("#socialChoices").val(socialChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices > 0) { covertChoices -= 1; $("#covertChoices").val(covertChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices > 0) { survivalChoices -= 1; $("#survivalChoices").val(survivalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices > 0) { medicalChoices -= 1; $("#medicalChoices").val(medicalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices > 0) { scienceChoices -= 1; $("#scienceChoices").val(scienceChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices > 0) { craftsmanChoices -= 1; $("#craftsmanChoices").val(craftsmanChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices > 0) { constructionChoices -= 1; $("#constructionChoices").val(constructionChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices > 0) { technologyChoices -= 1; $("#technologyChoices").val(technologyChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices > 0) { transportationChoices -= 1; $("#transportationChoices").val(transportationChoices); checkChoices(); checkSkillPts(); }
			else if (skillPts > 0) { skillPts -= 1; $('#skillPts').val(skillPts); checkSkillPts(); }
			else { throw new Error("Cannot Increase this skill further"); }

			value = value + roll(1, 10) + roll(1, 10);
			if (value > 150) value = 150;
			$("input[name='Skill-"+ skill +"']").val(value);
		}
		else if (value < 50 && skillType == "Focus") {
			if (skillClass == "Combat" && combatChoices > 0) { combatChoices -= 1; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices > 0) { socialChoices -= 1; $("#socialChoices").val(socialChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices > 0) { covertChoices -= 1; $("#covertChoices").val(covertChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices > 0) { survivalChoices -= 1; $("#survivalChoices").val(survivalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices > 0) { medicalChoices -= 1; $("#medicalChoices").val(medicalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices > 0) { scienceChoices -= 1; $("#scienceChoices").val(scienceChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices > 0) { craftsmanChoices -= 1; $("#craftsmanChoices").val(craftsmanChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices > 0) { constructionChoices -= 1; $("#constructionChoices").val(constructionChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices > 0) { technologyChoices -= 1; $("#technologyChoices").val(technologyChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices > 0) { transportationChoices -= 1; $("#transportationChoices").val(transportationChoices); checkChoices(); checkSkillPts(); }
			else if (skillPts > 0) { skillPts -= 1; $('#skillPts').val(skillPts); checkSkillPts(); }
			else { throw new Error("Cannot Increase this skill further"); }

			value = value + roll(1, 10) + roll(1, 10);
			if (value > 50) value = 50;
			$("input[name='Skill-" + skill + "']").val(value);
        }
		else alert("Cannot Increase this skill further");
	});
	// TRAIN ADV BUTTONS
	$("body").on("click", ".trainAdvBtn", function () {
		var skill = $(this).data("skill");
		var skillClass = $(this).data("skillclass");
		var value = parseInt($("input[name='Skill-" + skill + "']").val());

		if (skill == "OffHand") {
			if (value < 0) {
				if (combatChoices >= 2) { combatChoices -= 2; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
				else if (combatChoices == 1) { combatChoices -= 1; $("#combatChoices").val(combatChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
				else if (skillPts > 1) { skillPts -= 2; $('#skillPts').val(skillPts); checkSkillPts(); }
				else { throw new Error("Cannot Increase this skill further"); }
				value = value + roll(1, 10);
				if (value > 0) value = 0;
				$("input[name='Skill-" + skill + "']").val(value);
			}
			else alert("Cannot Increase this skill further");
		}
		if (skill == "Dodge") {
			if (value < 50) {
				if (combatChoices >= 2) { combatChoices -= 2; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
				else if (combatChoices == 1) { combatChoices -= 1; $("#combatChoices").val(combatChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
				else if (skillPts > 1) { skillPts -= 2; $('#skillPts').val(skillPts); checkSkillPts(); }
				else { throw new Error("Cannot Increase this skill further"); }
				value = value + roll(1, 10);
				if (value > 50) value = 50;
				$("input[name='Skill-" + skill + "']").val(value);
			}
			else alert("Cannot Increase this skill further");
		}
		else if (value < 150) {
			if (skillClass == "Combat" && combatChoices >= 2) { combatChoices -= 2; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Combat" && combatChoices == 1) { combatChoices -= 1; $("#combatChoices").val(combatChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices >= 2) { socialChoices -= 2; $("#socialChoices").val(socialChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices == 1) { socialChoices -= 1; $("#socialChoices").val(socialChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices >= 2) { covertChoices -= 2; $("#covertChoices").val(covertChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices == 1) { covertChoices -= 1; $("#covertChoices").val(covertChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices >= 2) { survivalChoices -= 2; $("#survivalChoices").val(survivalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices == 1) { survivalChoices -= 1; $("#survivalChoices").val(survivalChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices >= 2) { medicalChoices -= 2; $("#medicalChoices").val(medicalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices == 1) { medicalChoices -= 1; $("#medicalChoices").val(medicalChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices >= 2) { scienceChoices -= 2; $("#scienceChoices").val(scienceChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices == 1) { scienceChoices -= 1; $("#scienceChoices").val(scienceChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices >= 2) { craftsmanChoices -= 2; $("#craftsmanChoices").val(craftsmanChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices == 1) { craftsmanChoices -= 1; $("#craftsmanChoices").val(craftsmanChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices >= 2) { constructionChoices -= 2; $("#constructionChoices").val(constructionChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices == 1) { constructionChoices -= 1; $("#constructionChoices").val(constructionChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices >= 2) { technologyChoices -= 2; $("#technologyChoices").val(technologyChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices == 1) { technologyChoices -= 1; $("#technologyChoices").val(technologyChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices >= 2) { transportationChoices -= 2; $("#transportationChoices").val(transportationChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices == 1) { transportationChoices -= 1; $("#transportationChoices").val(transportationChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillPts > 1) { skillPts -= 2; $('#skillPts').val(skillPts); checkSkillPts(); }
			else { throw new Error("Cannot Increase this skill further"); }
			value = value + roll(1, 10);
			if (value > 150) value = 150;
			$("input[name='Skill-" + skill + "']").val(value);
		}
		else alert("Cannot Increase this skill further");
	});

	// ADD SKILL BUTTONS (POPULATE MODAL)
	$("body").on("click", ".addSkillBtn", function () {
		var parentID = $(this).parent().attr("id");
		var number = parentID.split("-")[1];
		var target = $(this).data("target");
		var skillClass = target.substring(0, target.length - 6);
		var slotID = String(skillClass).toLowerCase() + "-";

		if (skillClass == "Social") {
			$("#NSM-begin").append(
				"<div class='row bg-white'>" +
					"<div class='col-6'>" +
						"<div class='input-group my-1'>" +
				"<button class='btn btn-block btn-info border border-dark font-weight-bold my-1 px-0 addSubskillBtn' data-target='Languages' data-number='" + number +"' data-dismiss='modal' type='button'>LANGUAGES</button>" +
						"</div>" +
					"</div>" +
					"<div class='col-6'>" +
						"<div class='input-group my-1'>" +
				"<button class='btn btn-block btn-info border border-dark font-weight-bold my-1 px-0 addSubskillBtn' data-target='Affiliation' data-number='" + number +"' data-dismiss='modal' type='button'>AFFILIATIONS</button>" +
						"</div>" +
					"</div>" +
				"</div>"
			);
		}

		// GET EXISTING SKILLS
		var skillsArr = [];
		for (i = 0; i < 16; i++) {
			if ($("#" + slotID + i).children.length > 0) {
				var skill = String( $("#" + slotID + i).children().children().data("skill") );
				if (skill != "Undefined") skillsArr.push(skill);
			}
		}
		// GET JSON RETURN & RENDER HTML
		$.ajax({
			type: 'POST',
			url: 'Characters/GetNewSkills',
			data: '{SkillClass: "' + skillClass + '"}',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (skillsList) {
					
					for (var i = 0; i < skillsList.length; i++) {
						var obj = skillsList[i];
						// COMPARE EXISTING TO RETURN AND OMIT RESULTS WHERE NECESSARY
						if (skillsArr.includes(obj.Name)) continue;
						else {
							var button;
							if (obj.Type == "General") button = "btn-warning";
							else if (obj.Type == "Advanced") button = "btn-danger";
							else button = "btn-secondary";

							// HTML
							$("#NSM-begin").append( 
							"<div class='row bg-white'>" +
								"<div class='col-4'>" +
									"<div class='input-group my-1'>" +
										"<button class='btn btn-block "+ button +" border border-dark font-weight-bold my-1 px-0 selectSkillBtn'" + "data-skillclass='"+ skillClass +"'" +
								"data-number='" + number + "' data-type='" + obj.Type + "' data-skill='" + obj.Name + "' data-formula='" + obj.Formula + "' data-reqs='"+ obj.Requirements +"' data-shortTxt='"+ obj.ShortTxt +"' data-longTxt='"+ obj.LongTxt +"' type='button'>"+ obj.Name +"</button>" +
									"</div>" +
								"</div>" +
								"<div class='col-8'>" +
									"<p class='text-center my-2'>"+ obj.Description +"</p>" +
								"</div>" +
							"</div>" 
							);
						}
					}
					$("#newSkillsModal").modal("toggle");
				}
		});
	});

	// ADD SUBSKILLS BUTTONS (POPULATE MODAL)
	$("body").on("click", ".addSubskillBtn", function () {
		var skillClass = $(this).data("target");
		var slotID = "social-";
		var number = $(this).data("number");

		// GET EXISTING SKILLS
		var skillsArr = [];
		for (i = 0; i < 16; i++) {
			if ($("#" + slotID + i).children.length > 0) {
				var skill = String($("#" + slotID + i).children().children().data("skill"));
				var thisSkillClass = String($("#" + slotID + i).children().children().data("skillclass"));
				if (skill != "Undefined" && thisSkillClass == skillClass ) skillsArr.push(skill);
			}
		}
		// GET JSON RETURN & RENDER HTML
		$.ajax({
			type: 'POST',
			url: 'Characters/GetNewSkills',
			data: '{SkillClass: "' + skillClass + '"}',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (skillsList) {

					for (var i = 0; i < skillsList.length; i++) {
						var obj = skillsList[i];
						// COMPARE EXISTING TO RETURN AND OMIT RESULTS WHERE NECESSARY
						if (skillsArr.includes(obj.Name)) continue;
						else {
							var button;
							if (obj.Type == "General") button = "btn-warning";
							else if (obj.Type == "Advanced") button = "btn-danger";
							else button = "btn-secondary";

							// HTML
							$("#SSM-begin").append(
								"<div class='row bg-white'>" +
								"<div class='col-4'>" +
								"<div class='input-group my-1'>" +
								"<button class='btn btn-block " + button + " border border-dark font-weight-bold my-1 px-0 selectSkillBtn'" + "data-skillclass='" + skillClass + "'" +
								"data-number='" + number + "' data-type='" + obj.Type + "' data-skill='" + obj.Name + "' data-formula='" + obj.Formula + "' data-reqs='" + obj.Requirements + "' data-shortTxt='"+ obj.ShortTxt +"' data-longTxt='"+ obj.LongTxt +"' type='button'>"+ obj.Name +"</button>" +
								"</div>" +
								"</div>" +
								"<div class='col-8'>" +
								"<p class='text-center my-2'>" + obj.Description + "</p>" +
								"</div>" +
								"</div>"
							);
						}
					}
				}
		});
		$("#subSkillsModal").modal("toggle");
	});

	// SELECT SKILL BUTTON
	$("body").on("click", ".selectSkillBtn", function () {
		var skill = $(this).data("skill");
		var skillClass = $(this).data("skillclass");
		var skillType = $(this).data("type");
		var skillReqs = $(this).data("reqs");
		var skillFormula = $(this).data("formula");
		var slotNum = $(this).data("number");
		var shortTxt = $(this).data("shorttxt");
		var longTxt = $(this).data("longtxt");
		

		if (skillReqs != null) {
			var reqs = $(this).data("reqs");

			var Biology = $("input[name='Skill-Biology']").val();
			var Digital = $("input[name='Skill-Digital']").val();
			var Mechanical = $("input[name='Skill-Mechanical']").val();
			var Driving = $("input[name='Skill-Driving']").val();
			var Craftsman = $("input[name='Skill-Craftsman']").val();
			var Deception = $("input[name='Skill-Deception']").val();
			var Chemistry = $("input[name='Skill-Chemistry']").val();
			var Electrical = $("input[name='Skill-Electrical']").val();
			var AnimalHandling = $("input[name='Skill-AnimalHandling'").val();
			var Persuasion = $("input[name='Skill-Persuasion']").val();
			var Boating = $("input[name='Skill-Boating']").val();

			if (eval(reqs) == false) {
				alert("Minimum Requirements not met: " + reqs);
				throw new Error("Minimum Requirements not met: " + reqs);
			}
        }

		var border;
		var training;
		if (skillType == "General") { border = "border-warning"; training = "trainGenBtn"; }
		else if (skillType == "Advanced") { border = "border-danger"; training = "trainAdvBtn"; }
		else { border = "border-secondary"; training = "trainGenBtn"; } // skillClass == "Focus"

		if (skillClass == "Affiliation" || skillClass == "Languages") skillClass = "Social";

		var nextSlot
		if (skillClass == "Combat") nextSlot = slotNum + 2;
		else nextSlot = slotNum + 1;

		var skillValue = eval(skillFormula) + roll(1, 10);

		if (skillType == "Focus" || skillType == "General") {
			if (skillClass == "Combat" && combatChoices > 0) { combatChoices -= 1; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices > 0) { socialChoices -= 1; $("#socialChoices").val(socialChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices > 0) { covertChoices -= 1; $("#covertChoices").val(covertChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices > 0) { survivalChoices -= 1; $("#survivalChoices").val(survivalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices > 0) { medicalChoices -= 1; $("#medicalChoices").val(medicalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices > 0) { scienceChoices -= 1; $("#scienceChoices").val(scienceChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices > 0) { craftsmanChoices -= 1; $("#craftsmanChoices").val(craftsmanChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices > 0) { constructionChoices -= 1; $("#constructionChoices").val(constructionChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices > 0) { technologyChoices -= 1; $("#technologyChoices").val(technologyChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices > 0) { transportationChoices -= 1; $("#transportationChoices").val(transportationChoices); checkChoices(); checkSkillPts(); }
			else if (skillPts > 0) { skillPts -= 1; $('#skillPts').val(skillPts); checkSkillPts(); }
			else { throw new Error("Cannot Increase this skill further"); }
		}
		else if (skillType == "Advanced"){
			if (skillClass == "Combat" && combatChoices >= 2) { combatChoices -= 2; $("#combatChoices").val(combatChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Combat" && combatChoices == 1) { combatChoices -= 1; $("#combatChoices").val(combatChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices >= 2) { socialChoices -= 2; $("#socialChoices").val(socialChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Social" && socialChoices == 1) { socialChoices -= 1; $("#socialChoices").val(socialChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices >= 2) { covertChoices -= 2; $("#covertChoices").val(covertChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Covert" && covertChoices == 1) { covertChoices -= 1; $("#covertChoices").val(covertChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices >= 2) { survivalChoices -= 2; $("#survivalChoices").val(survivalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Survival" && survivalChoices == 1) { survivalChoices -= 1; $("#survivalChoices").val(survivalChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices >= 2) { medicalChoices -= 2; $("#medicalChoices").val(medicalChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Medical" && medicalChoices == 1) { medicalChoices -= 1; $("#medicalChoices").val(medicalChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices >= 2) { scienceChoices -= 2; $("#scienceChoices").val(scienceChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Science" && scienceChoices == 1) { scienceChoices -= 1; $("#scienceChoices").val(scienceChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices >= 2) { craftsmanChoices -= 2; $("#craftsmanChoices").val(craftsmanChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Craftsman" && craftsmanChoices == 1) { craftsmanChoices -= 1; $("#craftsmanChoices").val(craftsmanChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices >= 2) { constructionChoices -= 2; $("#constructionChoices").val(constructionChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Construction" && constructionChoices == 1) { constructionChoices -= 1; $("#constructionChoices").val(constructionChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices >= 2) { technologyChoices -= 2; $("#technologyChoices").val(technologyChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Technology" && technologyChoices == 1) { technologyChoices -= 1; $("#technologyChoices").val(technologyChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices >= 2) { transportationChoices -= 2; $("#transportationChoices").val(transportationChoices); checkChoices(); checkSkillPts(); }
			else if (skillClass == "Transportation" && transportationChoices == 1) { transportationChoices -= 1; $("#transportationChoices").val(transportationChoices); skillPts -= 1; $('#skillPts').val(skillPts); checkChoices(); checkSkillPts(); }
			else if (skillPts > 1) { skillPts -= 2; $('#skillPts').val(skillPts); checkSkillPts(); }
			else { throw new Error("Cannot Increase this skill further"); }
		}
		// RENDER HTML FOR NEW SKILL
		$("#" + skillClass.toLowerCase() + "-" + slotNum).html(
			'<div class="input-group my-0">' +
			'<button class="btn btn-block border ' + border + ' bw-thick font-weight-bold my-1 px-0 ' + training + ' " data-skill="' + skill + '" data-skillclass="' + skillClass + '" data-shortTxt="' + shortTxt + '" data-longTxt="' + longTxt +'" type="button">' + skill + '</button>' +
			'</div>'
		);
		$("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
			'<div class="input-group my-2">' +
				'<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skill + '" value="' + (skillValue) + '" readonly />' +
			'</div>'
		);
		// RENDER HTML FOR NEW ADD SKILL BTN
		$("#" + skillClass.toLowerCase() + "-" + nextSlot).html(
			'<button class="btn btn-block btn-info border border-dark text-center font-weight-bold addSkillBtn my-2 mx-auto" data-target="'+ skillClass + "Skills" +'" type="button">ADD</button>'
		);
		$("#" + skillClass.toLowerCase() + "Val-" + nextSlot).html(
			'<div class="input-group my-2">' + 
				'<input class="form-control text-center px-0 py-0" value="" readonly />' +
			'</div>'
		);
		// CLEAR NEW SKILL MODAL
		$("#NSM-begin").html(
			'<div class="row bg-dark">' +
			'<div class="col-4">' +
			'<h6 class="font-weight-bold text-center text-white my-2">SKILL</h6>' +
			'</div>' +
			'<div class="col-8">' +
			'<h6 class="font-weight-bold text-center text-white my-2">DSCRPT</h6>' +
			'</div>' +
			'</div>'
		);
		$("#newSkillsModal").modal("hide");
		// CLEAR SUB SKILL MODAL
		$("#SSM-begin").html(
			'<div class="row bg-dark">' +
			'<div class="col-4">' +
			'<h6 class="font-weight-bold text-center text-white my-2">SKILL</h6>' +
			'</div>' +
			'<div class="col-8">' +
			'<h6 class="font-weight-bold text-center text-white my-2">DSCRPT</h6>' +
			'</div>' +
			'</div>'
		);
		$("#subSkillsModal").modal("hide");
		altText(lg);
	});

	// CANCEL NEW SKILL BUTTON
	$("#NSM-cancelBtn, #SSM-cancelBtn").click(function () {
		$("#NSM-begin").html(
			'<div class="row bg-dark">' +
				'<div class="col-4">' +
					'<h6 class="font-weight-bold text-center text-white my-2">SKILL</h6>' +
				'</div>' +
				'<div class="col-8">' +
					'<h6 class="font-weight-bold text-center text-white my-2">DSCRPT</h6>' +
				'</div>' +
			'</div>'
		); $("#SSM-begin").html(
			'<div class="row bg-dark">' +
			'<div class="col-4">' +
			'<h6 class="font-weight-bold text-center text-white my-2">SKILL</h6>' +
			'</div>' +
			'<div class="col-8">' +
			'<h6 class="font-weight-bold text-center text-white my-2">DSCRPT</h6>' +
			'</div>' +
			'</div>'
		);
	});
}); // END DOCUMENT READY