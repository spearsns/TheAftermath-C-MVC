﻿$(document).ready(function () {
    var url = window.location.href;
        
    var username;
    var d = new Date();
    var h = d.getHours();
    if (h < 10) h = "0" + h;
    var m = d.getMinutes();
    if (m < 10) m = "0" + m;
    var s = d.getSeconds();
    if (s < 10) s = "0" + s;

    if ($("#sessionUsername").length > 0) {
        username = $("#sessionUsername").html();
        updateStatus();
    }
    else {
        username = "Visitor [" + h + ":" + m + ":" + s + "]";
        $("#introModal").modal("show");
        $("#introModal").on("hidden.bs.modal", function () {
            $("#aftermathIntro")[0].pause();
        });
    }
    function updateStatus() {
        $.ajax({
            type: 'POST',
            url: 'Home/UpdateStatus',
            dataType: 'json',
            data: JSON.stringify({ User: username }),
            contentType: 'application/json; charset=utf-8',
            success:
                function (result) {
                    console.log(result + " - Logged in as : " + username);
                }
        });
    }
    
    $('#indexChatLogArea').attr('overflow', 'auto');

    var transferCount = 0;
    var messageCount = 0;
    var messageModals = 1;
    
    function getActiveList() {
        $.ajax({
            type: 'GET',
            url: 'Home/GetActiveList',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success:
                function (results) {
                    $("#lobbyActiveUserList").html("");

                    for (var i = 0; i < results.length; i++) {
                        var user = results[i];
                        var css;

                        if (user.Username === username) continue;
                        else {
                            if (user.Play === true) css = "text-success border-success";
                            else if (user.Admin === true) css = "text-red border-red";
                            else if (user.Tell === true) css = "text-red border-red";
                            else css = "text-dark border-dark";

                            if ($("#sessionUsername").length > 0) {
                                $("#lobbyActiveUserList").append("<button class='btn btn-block border font-weight-bold text-center mt-1 " + css + " IM-btn' data-connection='" + user.Username + "'>" + user.Username + "</button>");
                            }
                            else $("#lobbyActiveUserList").append("<button class='btn btn-block border font-weight-bold text-center mt-1 " + css + " IM-btn' data-connection='" + user.Username + "' disabled >" + user.Username + "</button>");
                        }
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
        chat.client.NotifyOnline = function (name, location) {
            var urlData = location.substr(location.indexOf('?'), location.length);
            var targetParams = new URLSearchParams(urlData);
            var game = targetParams.get('campaign');
            var char = targetParams.get('char');
            
            if (location.toLowerCase().indexOf("play") > 0) {
                $('#lobbyChatLog').append('<li class="text-secondary font-weight-bold"><strong>SERVER: ' + name + ' joined '+ game +' as '+ char +'</strong></li>');
            }
            else if (location.toLowerCase().indexOf("tell") > 0) {
                $('#lobbyChatLog').append('<li class="text-secondary font-weight-bold"><strong>SERVER: ' + name + ' joined ' + game + ' as the Storyteller</strong></li>');
            }
            else if (username === name && location === url) $('#lobbyChatLog').append('<li class="text-info font-weight-bold"><strong>SERVER: ' + name + ' joined Lobby</strong></li>');
            else if (username !== name && location === url) $('#lobbyChatLog').append('<li class="text-secondary font-weight-bold"><strong>SERVER: ' + name + ' joined Lobby</strong></li>');
            getActiveList();
        }

        chat.client.NotifyOffline = function (name, location) {
            var urlData = location.substr(location.indexOf('?'), location.length);
            var urlParams = new URLSearchParams(urlData);
            var game = urlParams.get('campaign');

            if (location.toLowerCase().indexOf("play") > 0 || location.toLowerCase().indexOf("tell") > 0) {
                $('#lobbyChatLog').append('<li class="text-secondary font-weight-bold"><strong>SERVER: ' + name + ' left ' + game + '</strong></li>');
            }
            else if (location === url) $('#lobbyChatLog').append('<li class="text-info font-weight-bold"><strong>SERVER: ' + name + ' left Lobby</strong></li>');
            getActiveList();
        }

        // LOBBY CHATROOM
        chat.client.NewLobbyMessage = function (name, message) { 
            if (name === username) $('#lobbyChatLog').append('<li class="text-info"><strong>' + htmlEncode(name) + '</strong>: ' + htmlEncode(message) + '</li>');
            else $('#lobbyChatLog').append('<li><strong>' + htmlEncode(name) + '</strong>: ' + htmlEncode(message) + '</li>');
            $("#lobbyChatLog li:last-child").focus();
        };
        $('#lobbyChatInput').focus();

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

        $.connection.hub.qs = { "username": username, "location": url };
        $.connection.hub.start().done(function () {

        // -- SERVER (SENDING) FUNCTIONS -- //
            // CHATROOM
            $("#lobbyChatInput").on("keypress", function (e) {
                if (e.which === 13) {
                    chat.server.sendLobbyMessage(username, $('#lobbyChatInput').val());
                    $('#lobbyChatInput').val('').focus();
                }
            });

            $('#sendLobbyMsgBtn').click(function () {
                chat.server.sendLobbyMessage(username, $('#lobbyChatInput').val());
                $('#lobbyChatInput').val('').focus();
            });
            // IM's
            $("body").on("keypress", ".IM-input", function (e) {
                if (e.which === 13) {
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
        });

    });
    // This optional function html-encodes messages for display in the page.
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
});