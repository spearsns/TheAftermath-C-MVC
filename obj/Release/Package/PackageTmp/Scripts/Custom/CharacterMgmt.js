﻿$(document).ready(function () {
	// MOBILE VIEW ADJUSTMENTS
	var lg = window.matchMedia("(min-width: 992px)");
	function altText(lg) {
		if (lg.matches) {
			$("h6[data-longTxt], h5[data-longTxt], h4[data-longTxt], button[data-longTxt]").each(function () {
				var text = $(this).attr("data-longTxt");
				$(this).html(text);
			});
		} else {
			$("h6[data-longTxt], h5[data-longTxt], h4[data-longTxt], button[data-longTxt]").each(function () {
				var text = $(this).attr("data-shortTxt");
				$(this).html(text);
			});
		}
	}
	altText(lg);
	lg.addListener(altText);

	/* -- EXPERIENCE GLOBALS -- */
	var exp = $("#expPool").val();
	var expTransfer = 0;
	var cost;

	
	/* -- ATTRIBUTE MANAGEMENT -- */
	// GLOBALS
	var memory = parseInt($("#memory").val());
	var logic = parseInt($("#logic").val());
	var perception = parseInt($("#perception").val());
	var willpower = parseInt($("#willpower").val());
	var charisma = parseInt($("#charisma").val());

	var strength = parseInt($("#strength").val());
	var endurance = parseInt($("#endurance").val());
	var agility = parseInt($("#agility").val());
	var speed = parseInt($("#speed").val());

	var omemory = memory;
	var ologic = logic;
	var operception = perception;
	var owillpower = willpower;
	var ocharisma = charisma;
	var ostrength = strength;
	var oendurance = endurance;
	var oagility = agility;
	var ospeed = speed;

	actions = Math.floor(speed / 2);
	sequence = Math.floor((perception + speed) / 2);

	$("#sequence").val(sequence);
	$("#actions").val(actions);

	// GLOBAL FUNCTIONS
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

		$("#sequence").val(sequence);
		$("#actions").val(actions);
	}

	// ADJUST ATTRIBUTES
	function checkAttrCost() {
		var value = parseInt($("#currentAttrVal").val());
		
		if (value <= 4) cost = 5000;
		else if (value >= 5 && value <= 8) cost = 2500;
		else if (value >= 9 && value <= 12) cost = 2000;
		else if (value >= 13 && value <= 16) cost = 2500;
		else cost = 5000; // value 17 to 20
		$("#attrCost").val(cost);
	}

	$(".attributeBtn").click(function () {
		var choice = $(this).data("attr");
		// MOBILE VIEW ADJUSTMENTS
		if (choice === "memory") $("#currentAttr").attr("data-shorttxt", "MEM").attr("data-longtxt", "MEMORY");
		if (choice === "logic") $("#currentAttr").attr("data-shorttxt", "LOG").attr("data-longtxt", "LOGIC");
		if (choice === "perception") $("#currentAttr").attr("data-shorttxt", "PER").attr("data-longtxt", "PERCEPTION");
		if (choice === "willpower") $("#currentAttr").attr("data-shorttxt", "WILL").attr("data-longtxt", "WILLPOWER");
		if (choice === "charisma") $("#currentAttr").attr("data-shorttxt", "CHA").attr("data-longtxt", "CHARISMA");
		if (choice === "strength") $("#currentAttr").attr("data-shorttxt", "STR").attr("data-longtxt", "STRENGTH");
		if (choice === "endurance") $("#currentAttr").attr("data-shorttxt", "END").attr("data-longtxt", "ENDURANCE");
		if (choice === "agility") $("#currentAttr").attr("data-shorttxt", "AGL").attr("data-longtxt", "AGILITY");
		if (choice === "speed") $("#currentAttr").attr("data-shorttxt", "SPD").attr("data-longtxt", "SPEED");

		original = parseInt(eval("o" + choice));
		$("#originalAttrVal").val(original);
		$("#currentAttr").html(String(choice) + ":");
		$("#currentAttrVal").val(eval(choice));
		$("#attrConfirmBtn").data("attr", choice);
		$(".expPool").val(exp);

		checkAttrCost();
		$("#attributeModal").modal("toggle");
		altText(lg);
	});

	$("#incAttrBtn").click(function () {
		var value = parseInt($("#currentAttrVal").val());
		checkAttrCost();
		
		if (exp >= cost && value < 20) {
			value += 1;
			exp -= cost;
			expTransfer += cost;
			$(".expPool").val(exp);
			$("#currentAttrVal").val(value);
			checkAttrCost();
		}
		else alert("Cannot Increase Further");
	});

	$("#decAttrBtn").click(function () {
		var value = parseInt($("#currentAttrVal").val());

		if (value <= 5) cost = 5000;
		else if (value >= 6 && value <= 9) cost = 2500;
		else if (value >= 10 && value <= 13) cost = 2000;
		else if (value >= 14 && value <= 17) cost = 2500;
		else cost = 5000; // value 17 to 20

		if (exp >= 0 && value > original) {
			value -= 1;
			expTransfer -= cost;
			exp += cost;
			$(".expPool").val(exp);
			$("#currentAttrVal").val(value);
			checkAttrCost();
		}
		else alert("Cannot Decrease Further");
	});

	$("#attrConfirmBtn").click(function () {
		var choice = $(this).data("attr");
		var value = $("#currentAttrVal").val();
		$("#" + choice).val(value);
		$(".expPool").val(exp);
		setAttributes();
		expTransfer = 0;
		cost = 0;
		$("#attributeModal").modal("toggle");
	});

	$("#attrCancelBtn").click(function () {
		if (expTransfer === 0) $("#attributeModal").modal("toggle");
		else {
			exp += Number(expTransfer);
			cost = 0;
			expTransfer = 0;
            $(".expPool").val(exp);
			$("#attributeModal").modal("toggle");
        }
	});

	/* -- SKILL MANAGEMENT -- */
	// GLOBALS
	var newSkill = false;
	var nsName;
	var nsClass;
	var nsType;
	var nsShortTxt;
	var nsLongTxt;
	var nsSlotNum;

	var originalSkill;
	var skillMax;

	// GLOBAL FUNCTIONS
	function checkSkillCost() {
		var skill = $("#skillName").val();
		var skillType = $("#skillType").val();
		var value = $("#currentSkillVal").val();

		if (skillType === "Advanced") {
			if (skill === "OffHand") {
				if (value <= -80) cost = 1500;
				else if (value >= -79 && value <= -60) cost = 1000;
				else if (value >= -59 && value <= -40) cost = 750;
				else if (value >= -39 && value <= -20) cost = 500;
				else if (value >= -19 && value <= -10) cost = 1000;
				else cost = 1500; // value 9 - 0
			}
			else if (skill === "Dodge") {
				if (value <= -25) cost = 1000;
				else if (value >= -24 && value <= -10) cost = 750;
				else if (value >= -9 && value <= 10) cost = 500;
				else if (value >= 11 && value <= 25) cost = 750;
				else cost = 1000; // value 26 - 50
			}
			else {
				if (value <= 25) cost = 500;
				else if (value >= 26 && value <= 75) cost = 250;
				else if (value >= 76 && value <= 100) cost = 500;
				else if (value >= 101 && value <= 125) cost = 1000;
				else cost = 1500; // value 125 to 150
			}
		}
		else if (skillType === "General") {
			if (value <= 25) cost = 250;
			else if (value >= 26 && value <= 75) cost = 100;
			else if (value >= 76 && value <= 100) cost = 250;
			else if (value >= 101 && value <= 125) cost = 500;
			else cost = 1000; // value 125 to 150
		}
		// FOCUS NEEDS TWEAKING ON COSTS
		else cost = 100; // FOCUS
		$("#skillCost").val(cost);
	}

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
		var charName = $("input[name='Name']").val();

		$.ajax({
			type: 'POST',
			url: 'GetCurrentSkills',
			data: '{Name: "' + charName + '" }',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {

					for (i = 0; i < results.length; i++) {
						// SORT DATA
						var skill = results[i].Name;
						var shortTxt = results[i].ShortTxt;
						var longTxt = results[i].LongTxt;
						var skillClass = results[i].Class;
						var skillType = results[i].Type;
						var skillValue = results[i].Value;

						if (skillType === "Standard") continue;
						// DETERMINE SLOT
						var slotNum;
						if (skillClass === "Combat") slotNum = combatSlot;
						else if (skillClass === "Affiliation") { skillClass = "Social"; slotNum = socialSlot; }
						else if (skillClass === "Languages") { skillClass = "Social"; slotNum = socialSlot; }
						else if (skillClass === "Social") slotNum = socialSlot;
						else if (skillClass === "Covert") slotNum = covertSlot;
						else if (skillClass === "Survival") slotNum = survivalSlot;
						else if (skillClass === "Craftsman") slotNum = craftsmanSlot;
						else if (skillClass === "Construction") slotNum = constructionSlot;
						else if (skillClass === "Medical") slotNum = medicalSlot;
						else if (skillClass === "Science") slotNum = scienceSlot;
						else if (skillClass === "Technology") slotNum = technologySlot;
						else if (skillClass === "Transportation") slotNum = transportationSlot;
						// HTML PREP
						var border;
						if (skillType === "General") border = "border-warning";
						else if (skillType === "Advanced") border = "border-danger";
						else border = "border-secondary"; // skillClass == "Focus"

                        var nextSlot;
						if (skillClass === "Combat") nextSlot = slotNum + 2;
						else nextSlot = slotNum + 1;
						// RENDER HTML FOR NEXT SKILL SLOT
						$("#" + skillClass.toLowerCase() + "-" + slotNum).html(
							'<div class="input-group my-0">' +
							'<button class="btn btn-block border ' + border + ' bw-thick font-weight-bold my-1 px-0 text-uppercase adjSkillBtn" data-skill="' + skill + '" data-skillclass="' + skillClass + '" data-shortTxt="' + shortTxt + '" data-longTxt="' + longTxt + '" type="button">' + skill + '</button>' +
							'</div>'
						);
						$("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
							'<div class="input-group my-2">' +
							'<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skill + '" value="' + skillValue + '" readonly />' +
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
						if (skillClass === "Combat") combatSlot += 1;
						else if (skillClass === "Social") socialSlot += 1;
						else if (skillClass === "Covert") covertSlot += 1;
						else if (skillClass === "Survival") survivalSlot += 1;
						else if (skillClass === "Medical") medicalSlot += 1;
						else if (skillClass === "Science") scienceSlot += 1;
						else if (skillClass === "Technology") technologySlot += 1;
						else if (skillClass === "Transportation") transportationSlot += 1;
					}
				}
		});
		altText(lg);
	}
	getCurrentSkills();

	// ADJUST SKILLS
	// POPULATE SKILL MODAL
	function popAdjSkillModal() {
		var skill;
		var skillType;
		var skillClass;
		var value;
		var shortTxt;
		var longTxt;

		if (newSkill === true) {
			skill = nsName;
			skillType = nsType;
			skillClass = nsClass;
			value = 0;
			shortTxt = nsShortTxt;
			longTxt = nsLongTxt;
		}
		else { // NEW SKILL FALSE
			skill = $(this).data("skill");
			value = parseInt($("input[name='Skill-" + skill + "']").val());
			shortTxt = $(this).data("shorttxt");
			longTxt = $(this).data("longtxt");
			// DETERMINE TYPE
			if ($(this).hasClass("border-danger")) skillType = "Advanced";
			else if ($(this).hasClass("border-warning")) skillType = "General";
			else skillType = "Focus";
        }
		
		$(".expPool").val(exp);
		original = value;
		$("#originalSkillVal").val(original);
		$("#currentSkill").attr("data-shortTxt", shortTxt);
		$("#currentSkill").attr("data-longTxt", longTxt);
		$("#currentSkill").html(skill);
		
		$("#currentSkillVal").val(value);
		$("#skillConfirmBtn").data("skill", skill);
		$("#skillName").val(skill);
		$("#skillType").val(skillType);
		checkSkillCost();
		$("#skillModal").modal("toggle");
		altText(lg);
    }

	$("body").on("click", ".adjSkillBtn", function () {
		var skill = $(this).data("skill");
		var value = parseInt($("input[name='Skill-" + skill + "']").val());
		var skillType;
		var	shortTxt = $(this).data("shorttxt");
		var	longTxt = $(this).data("longtxt");

		if ($(this).hasClass("border-danger")) skillType = "Advanced";
		else if ($(this).hasClass("border-warning")) skillType = "General";
		else skillType = "Focus";

		$(".expPool").val(exp);
		original = value;
		$("#originalSkillVal").val(original);
		// SEPARATED IN CASE THERE IS NO SHORT/LONG TXT
		$("#currentSkill").attr("data-shortTxt", shortTxt);
		$("#currentSkill").attr("data-longTxt", longTxt);
		$("#currentSkill").html(skill);
		
		$("#currentSkillVal").val(value);
		$("#skillConfirmBtn").data("skill", skill);
		$("#skillName").val(skill);
		$("#skillType").val(skillType);
		checkSkillCost();
		$("#skillModal").modal("toggle");
		altText(lg);
	});

	$("#incSkillBtn").click(function () {
		var skill = $("#skillName").val();
		var value = parseInt( $("#currentSkillVal").val() );
		var type = $("#skillType").val();

		if (type === "Focus") skillMax = 75;
		else if (skill === "OffHand") skillMax = 0;
		else if (skill === "Dodge") skillMax = 50;
		else skillMax = 150;

		if (exp >= cost && value < skillMax) {
			value += 1;
			exp -= cost;
			expTransfer += cost;
			$(".expPool").val(exp);
			$("#currentSkillVal").val(value);
			checkSkillCost();
		}
		else alert("Cannot Increase Further");
	});

	$("#decSkillBtn").click(function () {
		var skill = $("#skillName").val();
		var value = parseInt( $("#currentSkillVal").val() );
		var type = $("#skillType").val();
		if (type === "Advanced") {
			if (skill === "OffHand") {
				if (value <= -79) cost = 1500;
				else if (value >= -78 && value <= -59) cost = 1000;
				else if (value >= -58 && value <= -39) cost = 750;
				else if (value >= -38 && value <= -19) cost = 500;
				else if (value >= -18 && value <= -9) cost = 1000;
				else cost = 1500; // value 8 - 0
			}
			else if (skill === "Dodge") {
				if (value <= -26) cost = 1000;
				else if (value >= -25 && value <= -9) cost = 750;
				else if (value >= -8 && value <= 11) cost = 500;
				else if (value >= 12 && value <= 26) cost = 750;
				else cost = 1000; // value 26 - 50
			}
			else {
				if (value <= 26) cost = 500;
				else if (value >= 26 && value <= 76) cost = 250;
				else if (value >= 76 && value <= 101) cost = 500;
				else if (value >= 102 && value <= 126) cost = 1000;
				else cost = 1500; // value 127 - 150
			}
		}
		else if (type === "General") {
			if (value <= 26) cost = 250;
			else if (value >= 27 && value <= 76) cost = 100;
			else if (value >= 77 && value <= 101) cost = 250;
			else if (value >= 102 && value <= 126) cost = 500;
			else cost = 1000; // value 126 - 150
		}
		else cost = 100; // type == focus
		$("#skillCost").val(cost);

		if (exp >= 0 && value > original) {
			value -= 1;
			expTransfer -= cost;
			exp += cost;
			$(".expPool").val(exp);
			$("#currentSkillVal").val(value);
		}
		else alert("Cannot Decrease Further");
	});

	$("#skillConfirmBtn").click(function () {
		if (newSkill === true) {
			// HTML PREP FOR NEW SKILL
			var skill = nsName;
			var skillClass = nsClass;
			var skillType = nsType;
			var shortTxt = nsShortTxt;
			var longTxt = nsLongTxt;
			var slotNum = nsSlotNum;
			var skillValue = $("#currentSkillVal").val();

			var border;
			if (skillType === "General") border = "border-warning";
			else if (skillType === "Advanced") border = "border-danger";
			else border = "border-secondary"; // skillClass == "Focus"

			if (skillClass === "Affiliation" || skillClass == "Languages") skillClass = "Social";

			var nextSlot;
			if (skillClass === "Combat") nextSlot = slotNum + 2;
			else nextSlot = slotNum + 1;

			if (skillValue >= 1) {
				// RENDER HTML FOR NEW SKILL
				$("#" + skillClass.toLowerCase() + "-" + slotNum).html(
					'<div class="input-group my-0">' +
					'<button class="btn btn-block border ' + border + ' bw-thick font-weight-bold my-1 px-0 adjSkillBtn" data-skill="' + skill + '" data-skillclass="' + skillClass + '" data-shortTxt="' + shortTxt + '" data-longTxt="' + longTxt + '" type="button">' + skill + '</button>' +
					'</div>'
				);
				$("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
					'<div class="input-group my-2">' +
					'<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skill + '" value="' + (skillValue) + '" readonly />' +
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
			}
			// CLEAR MODALS & TRANSFER DATA
			newSkill = false;
			nsName = null;
			nsClass = null;
			nsType = null;
			nsShortTxt = null;
			nsLongTxt = null;
			nsSlotNum = null;
			clearNSModals();
		}
		else { // ADJ EXISTING SKILL
			var choice = $(this).data("skill");
			var value = $("#currentSkillVal").val();
			$("input[name='Skill-" + choice + "']").val(value);
        }

		// CLEAR ADJ VARIABLES
		expTransfer = 0;
		cost = 0;
		$(".expPool").val(exp);
		$("#skillModal").modal("toggle");
	});

	$("#skillCancelBtn").click(function () {
		if (expTransfer === 0) {
			$("#skillModal").modal("toggle");
		}
		else {
			exp += Number(expTransfer);
			// CLEAR ADJ VARIABLES
			expTransfer = 0;
			cost = 0;
			if (newSkill === true) {
				newSkill = false;
				nsName = null;
				nsClass = null;
				nsType = null;
				nsShortTxt = null;
				nsLongTxt = null;
				nsSlotNum = null;
				clearNSModals();
			}

			$(".expPool").val(exp);
			$("#skillModal").modal("toggle");		
		}
	});

	// NEW SKILLS
	// POPULATE SELECTION MODAL
	$("body").on("click", ".addSkillBtn", function () {
		var parentID = $(this).parent().attr("id");
		var number = parentID.split("-")[1];
		var target = $(this).data("target");
		var skillClass = target.substring(0, target.length - 6);
		var slotID = String(skillClass).toLowerCase() + "-";
		if (skillClass === "Social") {
			$("#NSM-begin").append(
				"<div class='row bg-white'>" +
				"<div class='col-6'>" +
				"<div class='input-group my-1'>" +
				"<button class='btn btn-block btn-info border border-dark font-weight-bold my-1 px-0 addSubskillBtn' data-target='Languages' data-number='" + number + "' data-dismiss='modal' type='button'>LANGUAGES</button>" +
				"</div>" +
				"</div>" +
				"<div class='col-6'>" +
				"<div class='input-group my-1'>" +
				"<button class='btn btn-block btn-info border border-dark font-weight-bold my-1 px-0 addSubskillBtn' data-target='Affiliation' data-number='" + number + "' data-dismiss='modal' type='button'>AFFILIATIONS</button>" +
				"</div>" +
				"</div>" +
				"</div>"
			);
		}
		// GET EXISTING SKILLS
		var skillsArr = [];
		for (i = 0; i < 16; i++) {
			if ($("#" + slotID + i).children.length > 0) {
				var skill = String($("#" + slotID + i).children().children().data("skill"));
				if (skill !== "Undefined") skillsArr.push(skill);
			}
		}
		// GET JSON RETURN & RENDER HTML
		$.ajax({
			type: 'POST',
			url: 'GetNewSkills',
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
								"<button class='btn btn-block " + button + " border border-dark font-weight-bold my-1 px-0 selectSkillBtn'" + "data-skillclass='" + skillClass + "'" +
								"data-number='" + number + "' data-type='" + obj.Type + "' data-skill='" + obj.Name + "'  data-reqs='" + obj.Requirements + "' data-shortTxt='" + obj.ShortTxt + "' data-longTxt='" + obj.LongTxt + "' type='button'>" + obj.Name + "</button>" +
								"</div>" +
								"</div>" +
								"<div class='col-8'>" +
								"<p class='text-center my-2'>" + obj.Description + "</p>" +
								"</div>" +
								"</div>"
							);
						}
					}
					$("#newSkillsModal").modal("toggle");
				}
		});
	});

	// ADD SUBSKILLS BUTTONS (AFFILIATIONS OR LANGUAGES)
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
				if (skill !== "Undefined" && thisSkillClass === skillClass) skillsArr.push(skill);
			}
		}
		// GET JSON RETURN & RENDER HTML
		$.ajax({
			type: 'POST',
			url: 'GetNewSkills',
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
							if (obj.Type === "General") button = "btn-warning";
							else if (obj.Type === "Advanced") button = "btn-danger";
							else button = "btn-secondary";
							// HTML
							$("#SSM-begin").append(
								"<div class='row bg-white'>" +
								"<div class='col-4'>" +
								"<div class='input-group my-1'>" +
								"<button class='btn btn-block " + button + " border border-dark font-weight-bold my-1 px-0 selectSkillBtn'" + "data-skillclass='" + skillClass + "'" +
								"data-number='" + number + "' data-type='" + obj.Type + "' data-skill='" + obj.Name + "' data-formula='" + obj.Formula + "' data-reqs='" + obj.Requirements + "' data-shortTxt='" + obj.ShortTxt + "' data-longTxt='" + obj.LongTxt + "' type='button'>" + obj.Name + "</button>" +
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

	// SELECT SKILL BUTTON (CHOOSE NEW SKILL)
	$("body").on("click", ".selectSkillBtn", function () {
		nsName = $(this).data("skill");
		nsClass = $(this).data("skillclass");
		nsType = $(this).data("type");
		var skillReqs = $(this).data("reqs");
		nsSlotNum = $(this).data("number");
		nsShortTxt = $(this).data("shorttxt");
		nsLongTxt = $(this).data("longtxt");
		// CHECK SKILL REQUIREMENTS
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

			if (eval(reqs) === false) {
				alert("Minimum Requirements not met: " + reqs);
				throw new Error("Minimum Requirements not met: " + reqs);
			}
		}
		// POPULATE SKILL ADJ MODAL
		$("#newSkillsModal").modal("hide");
		$("#subSkillsModal").modal("hide");
		newSkill = true;
		popAdjSkillModal();
	});

	// CANCEL NEW SKILL BUTTON
	function clearNSModals() {
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
	}
	$("#NSM-cancelBtn, #SSM-cancelBtn").click(function () {clearNSModals();} );

	/* -- ABILITY MANAGEMENT -- */
	// GLOBALS
	var abilityNumber;

	// CURRENT ABILITIES
	function getCurrentAbilities() {
	var charName = $("input[name='Name']").val();

		$.ajax({
			type: 'POST',
			url: 'GetCurrentAbilities',
			data: '{Name: "' + charName + '" }',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {
					//console.log(results);
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
						// RENDER NEW ADD BUTTON HTML
						$("#ability-" + (slot + 1)).html(
							"<button class='btn btn-block btn-info border border-dark text-center font-weight-bold addAbilityBtn my-2 mx-auto w-50' type='button'>ADD</button>"
						);
					}
				}
		});
		altText(lg);
	}
	getCurrentAbilities();

	// -- NEW ABILITIES
	$("body").on("click", ".addAbilityBtn", function () {
		var parentID = $(this).parent().attr("id");
		abilityNumber = parentID.split("-")[1];
		$("#abilitiesModal").modal("toggle");
	});
	// POPULATE ABILITY TYPE MODAL
	$("body").on("click", ".abilityTypeBtn", function () {
		var target = $(this).data("target");
		// GET EXISTING ABILITIES
		var abilityArr = [];
		for (i = 0; i < 16; i++) {
			if ($("#ability" + i).children.length > 0) {
				var ability = String($("#ability" + i).children().children().data("ability"));
				if (ability !== "Undefined") abilityArr.push(ability);
			}
		}
		// GET JSON RETURN & RENDER HTML
		$.ajax({
			type: 'POST',
			url: 'GetAbilities',
			data: '{Target: "' + target + '"}',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success:
				function (results) {
					console.log(results);
					for (var i = 0; i < results.length; i++) {
						var obj = results[i];
						// COMPARE EXISTING TO RETURN AND OMIT RESULTS WHERE NECESSARY
						if (abilityArr.includes(obj.Name)) continue;
						else {
							// HTML
							$("#ATM-begin").append(
								"<div class='row bg-white'>" +
									"<div class='col-4'>" +
										"<div class='input-group my-1'>" +
											"<button class='btn btn-block btn-warning border border-dark font-weight-bold my-1 px-0 selectAbilityBtn' data-number='"+ abilityNumber +"' data-ability='"+ obj.Name +"'" +
											"data-description='"+ obj.Description +"' data-reqs='"+ obj.Requirements +"' data-cost='"+ obj.Cost +"' type='button' > " + obj.Name + "</button > " +
										"</div>" +
									"</div>" +
									"<div class='col-6'>" +
										"<p class='text-center my-2'>" + obj.Effects + "</p>" +
									"</div>" +
									"<div class='col-2'>" +
										"<p class='text-center my-2'>" + obj.Cost + "</p>" +
									"</div>" +
								"</div>"
							);
						}
					}
					$("#abilityTypeModal").modal("toggle");
				}
		});
	});

	// SELECT ABILITY BUTTON (CHOOSE NEW ABILITY)
	$("body").on("click", ".selectAbilityBtn", function () {
		var name = $(this).data("ability");
		var description = $(this).data("description");
		var effect = $(this).data("effect");
		var reqs = $(this).data("reqs");
		var slot = $(this).data("number");
		var cost = Number($(this).data("cost"));
		// CHECK SKILL REQUIREMENTS

		var unarmed = $("input[name='Skill-Unarmed']").val();
		var grapple = $("input[name='Skill-Grapple']").val();
		var short = $("input[name='Skill-Short']").val();
		var long = $("input[name='Skill-Long']").val();
		var twoHand = $("input[name='Skill-TwoHand']").val();
		var chain = $("input[name='Skill-Chain']").val();
		var shield = $("input[name='Skill-Shield']").val();

		var thrown = $("input[name='Skill-Thrown']").val();
		var archery = $("input[name='Skill-Archery'").val();
		var pistols = $("input[name='Skill-Pistols']").val();
		var rifles = $("input[name='Skill-Rifles']").val();

		var offHand = $("input[name='Skill-OffHand]'").val();

		if (eval(reqs) == false && exp >= cost) {
			alert("Minimum Requirements not met: " + reqs);
			throw new Error("Minimum Requirements not met: " + reqs);
		}
		else {
			// NEW ABILITY HTML
			$("#ability-" + slot).html(
				"<div class='input-group my-2'>" +
					"<input class='form-control text-center px-0 py-0 font-weight-bold' name='Ability-" + slot + "' data-description='"+ description +"' data-effect='"+ effect +"' type='text' value='" + name + "' readonly>" +
				"</div>"
			);
			// NEW ADD BUTTON HTML
			$("#ability-" + (Number(slot) + 1)).html(
				"<button class='btn btn-block btn-info border border-dark text-center font-weight-bold addAbilityBtn my-2 mx-auto w-50' type='button'>ADD</button>"
			);

			exp -= cost;
			$(".expPool").val(exp);
			clearATM();
        }
	});

	// CANCEL NEW ABILITY
	function clearATM() {
		// CLEAR ABILITY TYPE MODAL
		$("#ATM-begin").html(
			'<div class="row bg-dark">' +
			'<div class="col-4">' +
			'<h6 class="font-weight-bold text-center text-white my-2">ABILITY</h6>' +
			'</div>' +
			'<div class="col-6">' +
			'<h6 class="font-weight-bold text-center text-white my-2">EFFECT</h6>' +
			'</div>' +
			'<div class="col-2">' +
			'<h6 class="font-weight-bold text-center text-white my-2">COST</h6>' +
			'</div>' +
			'</div>'
		);
		$("#abilityTypeModal").modal("hide");
		altText(lg);
	}
	$(".abilityCancelBtn").click(function () { clearATM(); });
});