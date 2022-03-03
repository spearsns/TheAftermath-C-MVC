$(document).ready(function () {

    var username;
    var d = new Date();
    var h = d.getHours();
    if (h < 10) h = "0" + h;
    var m = d.getMinutes();
    if (m < 10) m = "0" + m;
    var s = d.getSeconds();
    if (s < 10) s = "0" + s;

    if ($("#sessionUsername").length > 0) username = $("#sessionUsername").html();
    else username = "Visitor [" + h + ":" + m + ":" + s + "]";

    $('#indexChatLogArea').attr('overflow', 'auto');

    var transferCount = 0;
    var messageCount = 0;
    var messageModals = 0;

    function getActiveList() {
        $.ajax({
            type: 'GET',
            url: 'Home/GetActiveList',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success:
                function (results) {
                    $("#userList").html("");

                    for (var i = 0; i < results.length; i++) {
                        var user = results[i];
                        var css;

                        if (user.Username == username) continue;

                        if (user.Play == true) css = "text-success";
                        else if (user.Admin == true) css = "text-danger";
                        else if (user.Tell == true) css = "text-primary";
                        else css = "text-dark";

                        if ($("#sessionUsername").length > 0) {
                            $("#userList").append("<button class='btn btn-block border border-dark font-weight-bold text-center mt-1 " + css + " IM-btn' data-connection='"+ user.Username +"'>" + user.Username + "</button>");
                        }
                        else $("#userList").append("<button class='btn btn-block border border-dark font-weight-bold text-center mt-1 " + css + " IM-btn' data-connection='" + user.Username + "' disabled >" + user.Username + "</button>");
                    }
                }
        });
    }
    getActiveList();

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
        chat.client.NotifyOnline = function (name, count) {
            if (username == name) $("#chatLog").append('<li class="text-info text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' ONLINE</strong></li>');
            else $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' ONLINE</strong></li>');
            //$("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ACTIVE USERS ('+ htmlEncode(count) +')</strong></li>');
            $("#chatLog li:last-child").focus();
            getActiveList();
        }

        chat.client.NotifyOffline = function (name, count) {
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' OFFLINE</strong></li>');
            //$("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ACTIVE USERS (' + htmlEncode(count) + ')</strong></li>');
            $("#chatLog li:last-child").focus();
            getActiveList();
        }

        // LOBBY CHATROOM
        chat.client.NewMessage = function (name, message) { 
            if (name == username) $('#chatLog').append('<li class="text-info"><strong>' + htmlEncode(name) + '</strong>: ' + htmlEncode(message) + '</li>');
            else $('#chatLog').append('<li><strong>' + htmlEncode(name) + '</strong>: ' + htmlEncode(message) + '</li>');
            $("#chatLog li:last-child").focus();
        };
        $('#userInput').focus();

        // USER TO USER IM
        chat.client.NewIM = function (sender, message) {
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
                    transferCount = $(".IM-dropdown-btn[data-connection='"+ sender +"']").data("transfers");
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
            if ($(".IM-modal[data-connection='" + sender + "']").length > 0) $(".IM-log[data-connection='" + sender + "']").append("<li><strong>"+ sender + "</strong>: " + message + "</li>");
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
                                                "<li><strong>" + htmlEncode(sender) + "</strong>: " + htmlEncode(message) +"</li>"+
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
            $("#userInput").on("keypress", function (e) {
                if (e.which == 13) {
                    chat.server.sendMessage(username, $('#userInput').val());
                    $('#userInput').val('').focus();
                }
            });

            $('#sendMsgBtn').click(function () {
                chat.server.sendMessage(username, $('#userInput').val());
                $('#userInput').val('').focus();
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