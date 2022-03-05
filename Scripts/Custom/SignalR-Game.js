$(document).ready(function () {
    var url = window.location.href;
    var urlParams = new URLSearchParams(window.location.search);
    var username = urlParams.get("user");
    var gamename = urlParams.get("game");
    var charname;

    if (url.indexOf("Tell") >= 0) charname = "STORYTELLER";
    else charname = urlParams.get("char");

    //console.log("User ["+ username +"] logged into ["+ gamename +"] as ["+ charname +"]");

    var transferCount = 0;
    var messageCount = 0;
    var messageModals = 5;

    function getGameActiveList() {
        $.ajax({
            type: 'POST',
            url: 'GetGameActiveList',
            data: JSON.stringify({ Game: gamename }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success:
                function (results) {
                    for (i = 0; i < results.length; i++) {
                        var result = results[i];
                        $('#gameActiveUserList').html('');
                        if (result.Username == username) continue;
                        else if (result.Tell == true) $("#storyteller").val(result.Username);
                        else $("#gameActiveUserList").append("<button class='btn btn-block border border-dark font-weight-bold text-center mt-1 IM-btn' data-connection='" + result.Username + "'>" + result.Username + "</button>");
                    }
                }
        });
    }
    getGameActiveList();

    function getCharacterList() {
        $.ajax({
            type: 'POST',
            url: 'GetCharacterList',
            data: JSON.stringify({ Game: gamename }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success:
                function (results) {
                    for (i = 0; i < results.length; i++) {
                        var result = results[i];
                        $('#characterList').html('');
                        $('#characterList').append(
                            // PLAYER BUTTON FOR IM's
                            '<div class="col-2">' +
                            '<button class="btn btn-block btn-light rounded font-weight-bold text-center mt-1 IM-btn" data-connection="' + result.Username + '">' + result.Username + '</button>' +
                            '</div>' +
                            // CHARACTER BUTTON TO VIEW CHAR SHEET
                            '<div class="col-2">' +
                            '<button class="btn btn-block btn-warning border border-light rounded font-weight-bold text-center mt-1 characterBtn" data-username="' + result.Username + '" data-charname="' + result.CharacterName + '">' + result.CharacterName + '</button>' +
                            '</div>' +
                            // ID MARKS BUTTON
                            '<div class="col-2">' +
                            '<button class="btn btn-block btn-info border border-light font-weight-bold text-center mt-1 IDMarksBtn" data-username="'+ result.Username +'" data-charname="' + result.CharacterName + '" data-sex="'+ result.CharacterSex +'">VIEW</button>' +
                            '</div>' +
                            // EXPERIENCE INPUT TO AWARD
                            '<div class="col-2">' +
                            '<div class="input-group my-2">' +
                            '<input class="form-control text-center px-2 expInput" data-username="' + result.Username + '" data-charname="' + result.CharacterName + '" type="number" />' +
                            '</div>' +
                            '</div>' +
                            // AWARD EXPERIENCE BUTTON
                            '<div class="col-2">' +
                            '<button class="btn btn-block btn-success border border-light font-weight-bold text-center mt-1 awardExpBtn" data-username="' + result.Username + '" data-charname="' + result.CharacterName + '">AWARD</button>' +
                            '</div>'
                        );
                    }
                }
        });
    }
    getCharacterList();

    function getExperience() {
        $.ajax({
            type: 'POST',
            url: 'GetExperience',
            data: JSON.stringify({ User: username, Charname: charname }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success:
                function (result) {
                    $('#expPool').val(result);
                }
        });
    }
    if (url.indexOf("Play") >= 0) getExperience();

    // -- ID MARKS BUTTONS (STORYTELLER) -- //
    $("body").on("click", ".IDMarksBtn", function () {
        var charSex = $(this).data("sex");
        if (charSex == "Female") {
            $("#idMarksBG").css("background-image", "url('../../Content/Images/Embed/VirtruvianWoman-1200x1200-50o.png')");
            $(".facialHairSlot").html("");
        }

        var charName = $(this).data('charname');
        var userName = $(this).data('username');

        $.ajax({
            type: 'POST',
            url: 'GetIDMarks',
            data: JSON.stringify({ Name: charName, User: userName }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success:
                function (results) {
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

    // -- CHARACTER SHEET BUTTONS (STORYTELLER) -- //
    $('body').on('click', '.characterBtn', function () {
        var userName = $(this).data("username");
        var charName = $(this).data("charname");

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

        $.ajax({
            type: 'POST',
            url: 'GetCharacterSheet',
            data: JSON.stringify({ Name: charName, User: userName }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success:
                function (results) {
                    console.log(results);
                    $('#background').val(results.Background);
                    $('#strategy').val(results.Strategy);
                    $('#history').val(results.History);
                    $('#habitat').val(results.Habitat);
                    $('#characterName').val(results.Name);
                    $('#willpower').val(results.Willpower);
                    $('#endurance').val(results.Endurance);
                    $('#birthdate').val(results.Birthdate);
                    $('#memory').val(results.Memory);
                    $('#strength').val(results.Strength);
                    $('#sex').val(results.Sex);
                    $('#logic').val(results.Logic);
                    $('#agility').val(results.Agility);
                    $('#ethnicity').val(results.Ethnicity);
                    $('#perception').val(results.Perception);
                    $('#speed').val(results.Speed);
                    $('#hairColor').val(results.HairColor);
                    $('#charisma').val(results.Charisma);
                    $('#beauty').val(results.Beauty);
                    $('#eyeColor').val(results.EyeColor);
                    $('#hairStyle').val(results.HairStyle);
                    $('#sequence').val(results.Sequence);
                    $('#actions').val(results.Actions);
                    $('#facialHair').val(results.FacialHair);

                    // -- SKILLS -- //
                    for (i = 0; i < results.Skills.length; i++) {

                        var skillName = results.Skills[i].Name;
                        var skillType = results.Skills[i].Type;
                        var skillClass = results.Skills[i].Class;
                        var skillValue = results.Skills[i].Value;

                        if (skillType == "Standard") $('input[name="Skill-' + skillName + '"]').val(skillValue);
                        else {
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

                            var nextSlot;
                            if (skillClass == "Combat") nextSlot = slotNum + 2;
                            else nextSlot = slotNum + 1;
                            // RENDER HTML FOR NEXT SKILL SLOT
                            $("#" + skillClass.toLowerCase() + "-" + slotNum).html(
                                '<h6 class="font-weight-bold text-center my-3 text-uppercase">' + skillName + '</h6>'
                            );
                            $("#" + skillClass.toLowerCase() + "Val-" + slotNum).html(
                                '<div class="input-group my-2">' +
                                '<input class="form-control text-center px-0 py-0" type="number" name="Skill-' + skillName + '" value="' + skillValue + '" readonly />' +
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

                    // ABILITIES
                    for (i = 0; i < results.Abilities.length; i++) {
                        var abilityName = results.Abilities[i].Name;
                        var abilityDescription = results.Abilities[i].Description;
                        var slot = i + 1;

                        // RENDER HTML FOR ABILITY SLOT
                        $("#ability-" + slot).html(
                            "<div class='input-group my-2'>" +
                            "<input class='form-control text-center px-0 py-0 font-weight-bold' name='Ability-" + slot + "' data-description='" + abilityDescription + "' type='text' value='" + abilityName + "' readonly>" +
                            "</div>"
                        );
                    }

                }
        });
        $('#charSheetModal').modal('toggle');
    });

    // -- IM BUTTONS -- //
    // FROM ONLINE LIST
    $("body").on("click", ".IM-btn", function () {
        var targetUser = $(this).data("connection");

        if ($(".IM-modal[data-connection='" + targetUser + "']").length > 0) $(".IM-modal[data-connection='" + targetUser + "']").modal("show");
        else {
            messageModals += 1;
            $("#IM-Modals").append(
                "<div class='modal fade IM-modal' data-connection='" + targetUser + "' tabindex='-" + messageModals + "' aria-labelledby='IM-ModalLabel-" + targetUser + "' aria-hidden='false'>" +
                "<div class='modal-dialog'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header bg-black'>" +
                "<h5 class='modal-title text-white font-weight-bold mx-auto' id='IM-ModalLabel-" + targetUser + "'>" + targetUser + "</h5>" +
                "</div>" + // modal-header
                "<div class='modal-body container-fluid'>" +
                "<div class='row'>" +
                "<div class='col-12'>" +
                "<ul class='IM-log border border-dark rounded overflow-auto' data-connection='" + targetUser + "'></ul>" +
                "</div>" + // col-12
                "</div>" + // row
                "<div class='row no-gutters'>" +
                "<div class='col-10'>" +
                "<div class='input-group my-2 text-center'>" +
                "<input class='form-control center px-0 py-0 IM-input' data-connection='" + targetUser + "' type='text' value='' />" +
                "</div>" + // input-group
                "</div>" + // col-10
                "<div class='col-2'>" +
                "<button type='button' class='btn btn-block btn-success sendIMBtn border border-dark my-2' data-connection='" + targetUser + "' >SEND</btn>" +
                "</div>" + // col-2
                "</div>" + // row
                "</div>" + // modal-body
                "<div class='modal-footer bg-light'>" +
                "<button type='button' class='btn btn-lg btn-danger border border-dark mx-auto' data-dismiss='modal'>CLOSE</button>" +
                "</div>" + // modal-footer
                "</div>" + // modal-content
                "</div>" + // modal-dialog
                "</div>" // modal
            );
            $(".IM-modal[data-connection='" + targetUser + "']").modal("show");
        }
    });
    // FROM MESSAGE LIST
    $("body").on("click", ".IM-dropdown-btn", function () {
        if ($(this).hasClass('unread')) {
            transferCount = $(this).data("transfers");
            messageCount -= transferCount;
            if (messageCount <= 0) {
                messageCount = 0;
                $("#messageCount").html("");
            }
            else $("#messageCount").html(messageCount);
            $(this).removeClass('unread bg-info');
        }
        var targetUser = $(this).data("connection");
        $(".IM-modal[data-connection='" + targetUser + "']").modal("show");
        transferCount = 0;
    });

    // -- SIGNALR -- //
    $(function () {
        var chat = $.connection.globalHub;

        // -- CLIENT (RECEIVING) FUNCTIONS -- //
        // CHATROOM & PLAY
        chat.client.NotifyOnline = function (name, count) {
            $("#gameChatLog li:last-child").focus();
            if (username != name) {
                getGameActiveList();
                getCharacterList();
            }
        }

        chat.client.NotifyOffline = function (name, count) {
            $("#gameChatLog li:last-child").focus();
            if (username != name) {
                getGameActiveList();
                getCharacterList();
            }
        }

        chat.client.NewGameMessage = function (name, charname, game, message, dice) {
            //console.log("Message Received [Name:"+ name +"] [Game:"+ game +"] [Character:"+ charname +"] [Dice:"+ dice +"]");
            if (gamename == game) {
                if (charname == "STORYTELLER") $('#gameChatLog').append('<li class="text-red"><strong>' + htmlEncode(name) + ' [' + htmlEncode(charname) + ']</strong>: ' + htmlEncode(message) + '</li>');
                else if (dice == true) $('#gameChatLog').append('<li class="text-secondary"><strong>' + htmlEncode(name) + ' [' + htmlEncode(charname) + ']</strong>: ' + htmlEncode(message) + '</li>');
                else if (username == name && dice == false) $('#gameChatLog').append('<li class="text-info"><strong>' + htmlEncode(name) + ' ['+ htmlEncode(charname) +']</strong>: ' + htmlEncode(message) + '</li>');
                else $('#gameChatLog').append('<li><strong>' + htmlEncode(name) + ' [' + htmlEncode(charname) +']</strong>: ' + htmlEncode(message) + '</li>');
                $("#gameChatLog li:last-child").focus();
            }
        };

        chat.client.NotifyExpGain = function (name) {
            if (name == username) getExperience();
        }

        // USER TO USER IM
        chat.client.NewIM = function (sender, message) {
            console.log("IM Recieved from [" + sender + "]");
            // HANDLE COUNT
            if ($(".IM-dropdown-btn[data-connection='" + sender + "']").length > 0) {
                if ($('.IM-modal[data-connection="' + sender + '"]').hasClass("show")) {
                    messageCount = messageCount;
                    if (messageCount <= 0) {
                        messageCount = 0;
                        $('#messageCount').html('');
                    }
                    else $('#messageCount').html(messageCount);
                }
                else {
                    transferCount = $(".IM-dropdown-btn[data-connection='" + sender + "']").data("transfers");
                    $(".IM-dropdown-btn[data-connection='" + sender + "'").data("transfers", transferCount += 1).addClass("unread bg-info");
                    messageCount += 1;
                    $('#messageCount').html(messageCount);
                }
            }
            else {
                $("#IM-dropdown-menu").append("<button class='btn btn-block border border-dark font-weight-bold text-center IM-dropdown-btn unread bg-info' data-connection='" + sender + "' data-transfers='1' type='button'>" + sender + "</button>");
                messageCount += 1;
                $("#messageCount").html(messageCount);
            }
            // TRANSMIT MESSAGE
            if ($(".IM-modal[data-connection='" + sender + "']").length > 0) $(".IM-log[data-connection='" + sender + "']").append("<li><strong>" + sender + "</strong>: " + message + "</li>");
            else {
                messageModals += 1;
                $("#IM-Modals").append(
                    "<div class='modal fade IM-modal' data-connection='" + sender + "' tabindex='-" + messageModals + "' aria-labelledby='IM-ModalLabel-" + sender + "' aria-hidden='false'>" +
                    "<div class='modal-dialog'>" +
                    "<div class='modal-content'>" +
                    "<div class='modal-header bg-black'>" +
                    "<h5 class='modal-title text-white font-weight-bold mx-auto' id='IM-ModalLabel-" + sender + "'>" + htmlEncode(sender) + "</h5>" +
                    "</div>" + // modal-header
                    "<div class='modal-body container-fluid'>" +
                    "<div class='row'>" +
                    "<div class='col-12'>" +
                    "<ul class='IM-log border border-dark rounded overflow-auto' data-connection='" + sender + "'>" +
                    "<li><strong>" + htmlEncode(sender) + "</strong>: " + htmlEncode(message) + "</li>" +
                    "</ul >" +
                    "</div>" + // col-12
                    "</div>" + // row
                    "<div class='row no-gutters'>" +
                    "<div class='col-10'>" +
                    "<div class='input-group my-2 text-center'>" +
                    "<input class='form-control center px-0 py-0 IM-input' data-connection='" + sender + "' type='text' value='' />" +
                    "</div>" + // input-group
                    "</div>" + // col-10
                    "<div class='col-2'>" +
                    "<button type='button' class='btn btn-block btn-success sendIMBtn border border-dark my-2' data-connection='" + sender + "' >SEND</btn>" +
                    "</div>" + // col-2
                    "</div>" + // row
                    "</div>" + // modal-body
                    "<div class='modal-footer bg-light'>" +
                    "<button type='button' class='btn btn-lg btn-danger border border-dark mx-auto' data-dismiss='modal'>CLOSE</button>" +
                    "</div>" + // modal-footer
                    "</div>" + // modal-content
                    "</div>" + // modal-dialog
                    "</div>" // modal
                );
            }
        }

        // -- START SIGNALR -- //
        chat.client.void = function () { };
        $.connection.hub.logging = true;

        $.connection.hub.qs = { "username": username };
        $.connection.hub.start().done(function () {

            // -- SERVER (SENDING) FUNCTIONS -- //
            // CHATROOM
            $("#gameChatInput").on("keypress", function (e) {
                if (e.which == 13) {
                    //console.log('sendMessage called');
                    chat.server.sendGameMessage(username, charname, gamename, $('#gameChatInput').val());
                    $('#gameChatInput').val('').focus();
                }
            });

            $('#sendGameMsgBtn').click(function () {
                //console.log('sendMessage called');
                chat.server.sendGameMessage(username, charname, gamename, $('#gameChatInput').val());
                $('#gameChatInput').val('').focus();
            });
            // IM's
            $("body").on("keypress", ".IM-input", function (e) {
                if (e.which == 13) {
                    var targetUser = $(this).data("connection");
                    var input = $('.IM-input[data-connection="' + targetUser + '"]').val();
                    $('.IM-log[data-connection="' + targetUser + '"]').append('<li class="text-info"><strong>' + username + '</strong>: ' + input + '</li>');
                    chat.server.sendIM(username, targetUser, input);
                    $('.IM-input[data-connection="' + targetUser + '"]').val('').focus();
                }
            });

            $('body').on('click', '.sendIMBtn', function () {
                var targetUser = $(this).data("connection");
                var input = $('.IM-input[data-connection="' + targetUser + '"]').val();
                $('.IM-log[data-connection="' + targetUser + '"]').append('<li class="text-info"><strong>' + username + '</strong>: ' + input + '</li>');
                chat.server.sendIM(username, targetUser, input);
                $('.IM-input[data-connection="' + targetUser + '"]').val('').focus();
            });

            // DICE
            $('#twoD10Btn').click(function () {
                chat.server.roll2D10(username, charname, gamename);
            });

            $('#randomHitBtn').click(function () {
                chat.server.randomHit(username, charname, gamename);
            });

            $('#D100Btn').click(function () {
                chat.server.rollD100(username, charname, gamename);
            });

            $('#LoSBtn').click(function () {
                var value = $('#LoSValue').val();
                chat.server.likelihoodOfSx(value, username, gamename);
                $('#LoSValue').val('');
            });

            $('body').on('keypress', '.expInput', function (e) {
                if (e.which == 13) {
                    var userName = $(this).data('username');
                    var charName = $(this).data('charname');
                    var exp = $('.expInput[data-charname="' + charName + '"]').val();

                    $.ajax({
                        type: 'POST',
                        url: 'UpdateExperience',
                        data: JSON.stringify({ User: userName, Name: charName, Exp: exp }),
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        success:
                            function (result) {
                                chat.server.sendExpGain(userName);
                                $('.expInput[data-charname="' + charName + '"]').val('');
                            }
                    });
                }
            });

            $('body').on('click', '.awardExpBtn', function () {
                var userName = $(this).data('username');
                var charName = $(this).data('charname');
                var exp = $('.expInput[data-charname="' + charName + '"]').val();

                $.ajax({
                    type: 'POST',
                    url: 'UpdateExperience',
                    data: JSON.stringify({ User: userName, Name: charName, Exp: exp }),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    success:
                        function (result) {
                            chat.server.sendExpGain(userName);
                            $('.expInput[data-charname="' + charName + '"]').val('');
                        }
                });
            });
        });

    });
    // This optional function html-encodes messages for display in the page.
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
});