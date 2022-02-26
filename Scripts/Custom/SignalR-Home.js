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
                            $("#userList").append("<button class='btn btn-block border border-dark font-weight-bold text-center mt-1 " + css + " im-btn' data-user='"+ user.Username +"'>" + user.Username + "</button>");
                        }
                        else $("#userList").append("<button class='btn btn-block border border-dark font-weight-bold text-center mt-1 " + css + " im-btn' data-user='" + user.Username + "' disabled >" + user.Username + "</button>");
                    }
                }
        });
    }
    getActiveList();

    // -- SignalR -- //
    // CHATROOM
    $(function () {
        // Reference the auto-generated proxy for the hub.  
        var chat = $.connection.globalHub;

        // -- CLIENT (RECEIVING) FUNCTIONS -- //
        chat.client.NotifyOnline = function (name, count) {
            if (username == name) $("#chatLog").append('<li class="text-info text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' ONLINE</strong></li>');
            else $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' ONLINE</strong></li>');
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ACTIVE USERS ('+ htmlEncode(count) +')</strong></li>');
            $("#chatLog li:last-child").focus();
            getActiveList();
        }

        chat.client.NotifyOffline = function (name, count) {
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ' + htmlEncode(name) + ' OFFLINE</strong></li>');
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>SERVER: ACTIVE USERS (' + htmlEncode(count) + ')</strong></li>');
            $("#chatLog li:last-child").focus();
            getActiveList();
        }

        // LOBBY CHATROOM
        chat.client.NewMessage = function (name, message) { 
            if (name == username) $('#chatLog').append('<li class="text-primary"><strong>' + htmlEncode(name) + '</strong>: ' + htmlEncode(message) + '</li>');
            else $('#chatLog').append('<li><strong>' + htmlEncode(name) + '</strong>: ' + htmlEncode(message) + '</li>');
            $("#chatLog li:last-child").focus();
        };
        $('#userInput').focus();

        // USER TO USER IM
        chat.client.NewIM = function (sender, message) {

        }

        // -- START SIGNALR -- //
        chat.client.void = function () { };
        $.connection.hub.logging = true;

        $.connection.hub.qs = { "username": username };
        $.connection.hub.starting(function () {
            console.log(username);
        });

        $.connection.hub.start().done(function () {

        // -- SERVER (SENDING) FUNCTIONS -- //
            $("#userInput").on("keypress", function (e) {
                if (e.which == 13) {
                    chat.server.sendMessage(username, $('#userInput').val());
                    $('#userInput').val('').focus();
                }
            })

            $('#sendMsgBtn').click(function () { 
                chat.server.sendMessage(username, $('#userInput').val()); 
                $('#userInput').val('').focus();
            });

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



