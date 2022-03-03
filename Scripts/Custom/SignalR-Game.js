$(document).ready(function () {
    var url = window.location.href;
    var urlParams = new URLSearchParams(window.location.search);
    var userName = urlParams.get("user");
    var gameName = urlParams.get("game");
    var charName;

    if (url.indexOf("Tell") >= 0) charName = "STORYTELLER";
    else charName = urlParams.get("char");

    console.log("User ["+ userName +"] logged into ["+ gameName +"] as ["+ charName +"]");

    var transferCount = 0;
    var messageCount = 0;
    var messageModals = 3;

    function getActive() {
        $.ajax({
            type: 'POST',
            url: 'GetActive',
            data: JSON.stringify({ Game: gameName }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success:
                function (results) {
                    for (i = 0; i < results.length; i++) {
                        var result = results[i];
                        if (result.Username == userName) continue;
                        else if (result.Tell == true) $("#storyteller").val(result.Username);
                        else $("#userList").append("<button class='btn btn-block border border-dark font-weight-bold text-center mt-1 IM-btn' data-connection='" + result.Username + "'>" + result.Username + "</button>");
                    }
                }
        });
    }
    getActive();

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
        var chat = $.connection.gameHub;

        // -- CLIENT (RECEIVING) FUNCTIONS -- //
        // CHATROOM
        chat.client.NotifyOnline = function (name, count) {
            console.log(name + " ONLINE -- ACTIVE USERS (" + count + ")");
            //$("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: '+ htmlEncode(name) +' ONLINE -- ACTIVE USERS ('+ htmlEncode(count) +')</strong></li>');
            $("#chatLog li:last-child").focus();
            if (userName != name) getActive();
        }

        chat.client.NotifyOffline = function (name, count) {
            console.log(name + " OFFLINE -- ACTIVE USERS (" + count + ")");
            //$("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' ONLINE -- ACTIVE USERS (' + htmlEncode(count) + ')</strong></li>');
            $("#chatLog li:last-child").focus();
            getActive();
        }

        chat.client.NewMessage = function (name, charname, game, message, dice) {
            console.log("Message Received [Name:"+ name +"] [Game:"+ game +"] [Character:"+ charname +"] [Dice:"+ dice +"]");
            if (gameName == game) {
                if (charname == "STORYTELLER") $('#chatLog').append('<li class="text-red"><strong>' + htmlEncode(name) + ' [' + htmlEncode(charname) + ']</strong>: ' + htmlEncode(message) + '</li>');
                else if (dice == true) $('#chatLog').append('<li class="text-secondary"><strong>' + htmlEncode(name) + ' [' + htmlEncode(charname) + ']</strong>: ' + htmlEncode(message) + '</li>');
                else if (name == userName && dice == false) $('#chatLog').append('<li class="text-info"><strong>' + htmlEncode(name) + ' ['+ htmlEncode(charname) +']</strong>: ' + htmlEncode(message) + '</li>');
                else $('#chatLog').append('<li><strong>' + htmlEncode(name) + ' [' + htmlEncode(charname) +']</strong>: ' + htmlEncode(message) + '</li>');
                $("#chatLog li:last-child").focus();
            }
        };

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

        $.connection.hub.qs = { "username": userName };
        $.connection.hub.start().done(function () {

            // -- SERVER (SENDING) FUNCTIONS -- //
            // CHATROOM
            $("#chatInput").on("keypress", function (e) {
                if (e.which == 13) {
                    console.log('sendMessage called');
                    chat.server.sendMessage(userName, charName, gameName, $('#chatInput').val());
                    $('#chatInput').val('').focus();
                }
            });

            $('#sendMsgBtn').click(function () {
                console.log('sendMessage called');
                chat.server.sendMessage(userName, charName, gameName, $('#chatInput').val());
                $('#chatInput').val('').focus();
            });
            // IM's
            $("body").on("keypress", ".IM-input", function (e) {
                if (e.which == 13) {
                    var targetUser = $(this).data("connection");
                    var input = $('.IM-input[data-connection="' + targetUser + '"]').val();
                    $('.IM-log[data-connection="' + targetUser + '"]').append('<li class="text-info"><strong>' + userName + '</strong>: ' + input + '</li>');
                    chat.server.sendIM(userName, targetUser, input);
                    $('.IM-input[data-connection="' + targetUser + '"]').val('').focus();
                }
            });

            $('body').on('click', '.sendIMBtn', function () {
                var targetUser = $(this).data("connection");
                var input = $('.IM-input[data-connection="' + targetUser + '"]').val();
                $('.IM-log[data-connection="' + targetUser + '"]').append('<li class="text-info"><strong>' + userName + '</strong>: ' + input + '</li>');
                chat.server.sendIM(userName, targetUser, input);
                $('.IM-input[data-connection="' + targetUser + '"]').val('').focus();
            });
            // DICE
            $('#twoD10Btn').click(function () {
                chat.server.roll2D10(userName, charName, gameName);
            });

            $('#randomHitBtn').click(function () {
                chat.server.randomHit(userName, charName, gameName);
            });

            $('#D100Btn').click(function () {
                chat.server.rollD100(userName, charName, gameName);
            });

            $('#LoSBtn').click(function () {
                var value = $('#LoSValue').val();
                chat.server.likelihoodOfSx(value, userName, gameName);
                console.log("LoS called with value of [" + value + "]");
                $('#LoSValue').val('');
            });
            // FORCING onDisconnect TO FIRE
            $("a").click(function () {
                chat.server.disconnect(username);
            });
        });

    });
    // This optional function html-encodes messages for display in the page.
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
});