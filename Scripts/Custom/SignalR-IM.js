$(document).ready(function () {
    var url = window.location.href;
    var urlParams = new URLSearchParams(window.location.search);
    
    var username;
    if ($("#sessionUsername").length > 0) {
        username = $("#sessionUsername").html();
    }

    function updateStatus() {
        if (url.indexOf('Characters') > 0 || url.substring(url.length - 5) === 'Games') {
            var targetUrl = '../Home/UpdateStatus';
            //console.log('updateStatus fired at [' + targetUrl + '] with [' + username + ']');
            
            $.ajax({
                type: 'POST',
                url: targetUrl,
                dataType: 'json',
                data: JSON.stringify({ User: username }),
                contentType: 'application/json; charset=utf-8',
                success:
                    function (result) {
                        console.log(result + " - Logged in as : " + username);
                    }
            });
        } else if (url.indexOf('Admin') > 0) {
            var targetUrl = '../Games/UpdateStatus';
            var gamename = urlParams.get("game");
            var charname = "ADMIN";

            //console.log('updateStatus fired at ['+ targetUrl +'] with ['+ username +'] ['+ charname +'] ['+ gamename +']');
            $.ajax({
                type: 'POST',
                url: targetUrl,
                dataType: 'json',
                data: JSON.stringify({ User: username, Character: charname, Game: gamename }),
                contentType: 'application/json; charset=utf-8',
                success:
                    function(result) {
                        console.log(result + " - Logged in as : " + username);
                    }
            });
        } else {
            targetUrl = 'UpdateStatus';
            console.log('updateStatus fired at [' + targetUrl + '] with [' + username + ']');

            $.ajax({
                type: 'POST',
                url: targetUrl,
                dataType: 'json',
                data: JSON.stringify({ User: username }),
                contentType: 'application/json; charset=utf-8',
                success:
                    function (result) {
                        console.log(result + " - Logged in as : " + username);
                    }
            });
        }
    }
    updateStatus();
    
    var transferCount = 0;
    var messageCount = 0;
    var messageModals = 0;

    if (url.toLowerCase().indexOf("charactermanagement") >= 0) messageModals = 7;
    if (url.toLowerCase().indexOf("newcharacter") >= 0) messageModals = 5;
    if (url.toLowerCase().indexOf("admin") >= 0) messageModals = 2;
    if (url.toLowerCase().indexOf("games/index") >= 0) messageModals = 3;
    if (url.toLowerCase().indexOf("play") >= 0) messageModals = 3;
    if (url.toLowerCase().indexOf("tell") >= 0) messageModals = 5;
            
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

    // MONITOR GAME ACCESSIBILITY
    function getGames() {
        $("#gameList").html("");

        $.ajax({
            type: 'GET',
            url: 'Games/GetGames',
            dataType: 'json',
            success:
                function (results) {
                    if (results.length === 0) $("#gameList").html("<h2 class='text-red text-center font-weight-bold'>NO RECORDS FOUND! RALLY SOME SURVIVORS AND TELL YOUR TALE!</div>");

                    //console.log(results);
                    for (var i = 0; i < results.length; i++) {
                        var obj = results[i];

                        if (obj.TellActive === false && obj.Locked === false) {
                            $("#gameList").append(
                                "<div class='row'>" +
                                "<div class='col-12 order-4 col-md-2 order-md-1'>" +
                                "<button class='btn btn-block btn-success font-weight-bold my-2 px-0 playBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>PLAY</button>" +
                                "</div>" +
                                "<div class='col-12 order-1 col-md-2 order-md-2'>" +
                                "<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Name + "</h5>" +
                                "</div>" +
                                "<div class='col-6 order-2 d-md-none'>" +
                                "<h5 class='font-weight-bold text-white text-center my-3'>POPULATION:</h4>" +
                                "</div>" +
                                "<div class='col-6 order-3 col-md-2 order-md-3'>" +
                                "<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.Population + "</h5>" +
                                "</div>" +
                                "<div class='col-12 order-5 col-md-2 order-md-4'>" +
                                "<button class='btn btn-block btn-light font-weight-bold my-2 px-0 descriptionBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>INFO</button>" +
                                "</div>" +
                                "<div class='col-12 order-6 col-md-2 order-md-5'>" +
                                "<button class='btn btn-block btn-primary font-weight-bold my-2 px-0 tellBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>TELL</button>" +
                                "</div>" +
                                "<div class='col-12 order-7 col-md-2 order-md-6'>" +
                                "<button class='btn btn-block btn-secondary font-weight-bold my-2 px-0 adminBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>ADMIN</button>" +
                                "</div>" +
                                "</div>" +
                                "<hr class='d-md-none'>"
                            );
                        }
                        else if (obj.Locked === true) {
                            $("#gameList").append(
                                "<div class='row'>" +
                                "<div class='col-12 order-4 col-md-2 order-md-1'>" +
                                "<img src='Content/Images/Icons/LockIcon-white-50x50.png' class='d-block mx-auto my-1' />" +
                                "</div>" +
                                "<div class='col-12 order-1 col-md-2 order-md-2'>" +
                                "<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Name + "</h5>" +
                                "</div>" +
                                "<div class='col-6 order-2 d-md-none'>" +
                                "<h5 class='font-weight-bold text-white text-center my-3'>POPULATION:</h4>" +
                                "</div>" +
                                "<div class='col-6 order-3 col-md-2 order-md-3'>" +
                                "<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.Population + "</h5>" +
                                "</div>" +
                                "<div class='col-12 order-5 col-md-2 order-md-4'>" +
                                "<button class='btn btn-block btn-light font-weight-bold my-2 px-0 descriptionBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>INFO</button>" +
                                "</div>" +
                                "<div class='col-12 order-6 col-md-2 order-md-5'>" +
                                "<img src='Content/Images/Icons/LockIcon-white-50x50.png' class='d-block mx-auto my-1' />" +
                                "</div>" +
                                "<div class='col-12 order-7 col-md-2 order-md-6'>" +
                                "<img src='Content/Images/Icons/LockIcon-white-50x50.png' class='d-block mx-auto my-1' />" +
                                "</div>" +
                                "</div>" +
                                "<hr class='d-md-none'>"
                            );
                        }
                        else if (obj.TellActive === true) {
                            $("#gameList").append(
                                "<div class='row'>" +
                                "<div class='col-12 order-4 col-md-2 order-md-1'>" +
                                "<button class='btn btn-block btn-success font-weight-bold my-2 px-0 playBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>PLAY</button>" +
                                "</div>" +
                                "<div class='col-12 order-1 col-md-2 order-md-2'>" +
                                "<h5 class='font-weight-bold my-3 px-0 text-uppercase text-center text-white'>" + obj.Name + "</h5>" +
                                "</div>" +
                                "<div class='col-6 order-2 d-md-none'>" +
                                "<h5 class='font-weight-bold text-white text-center my-3'>POPULATION:</h4>" +
                                "</div>" +
                                "<div class='col-6 order-3 col-md-2 order-md-3'>" +
                                "<h5 class='font-weight-bold my-3 px-0 text-center text-white'>" + obj.Population + "</h5>" +
                                "</div>" +
                                "<div class='col-12 order-5 col-md-2 order-md-4'>" +
                                "<button class='btn btn-block btn-light font-weight-bold my-2 px-0 descriptionBtn' data-id='" + obj.ID + "' data-name='" + obj.Name + "'>INFO</button>" +
                                "</div>" +
                                "<div class='col-12 order-6 col-md-2 order-md-5'>" +
                                '<img src="Content/Images/Icons/LockIcon-white-50x50.png" class="d-block mx-auto my-1" />' +
                                "</div>" +
                                "<div class='col-12 order-7 col-md-2 order-md-6'>" +
                                '<img src="Content/Images/Icons/LockIcon-white-50x50.png" class="d-block mx-auto my-1" />' +
                                "</div>" +
                                "</div>" +
                                "<hr class='d-md-none'>"
                            );
                        }
                    }
                }
        });
    }

    // -- SIGNALR -- //
    $(function () {
        var chat = $.connection.globalHub;

        chat.client.NotifyOnline = function (name, count) {
            if (url.toLowerCase().indexOf("games") > 0) getGames();
        }
        chat.client.NotifyOffline = function (name, count) {
            if (url.toLowerCase().indexOf("games") > 0) getGames();
        }
        chat.client.NotifyLock = function() {
            if (url.toLowerCase().indexOf("games") > 0) getGames();
        }

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



