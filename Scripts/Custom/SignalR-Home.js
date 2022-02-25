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

                        $("#userList").append("<li class=" + css + ">" + user.Username + "</li>");
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

        // -- FUNCTIONS -- //
        // CONNECTION MONITORING -- NEED USERNAME CONNECTION HANDOFF ON LOGIN

        chat.client.Online = function (name, count) {
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>' + htmlEncode(name) + ' ONLINE</strong></li>');
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>ACTIVE USERS : '+ htmlEncode(count) +'</strong></li>');
            $("#chatLog li:last-child").focus();
            getActiveList();
        }

        chat.client.Offline = function (name) {
            $("#chatLog").append('<li class="text-secondary text-uppercase"><strong>' + htmlEncode(name) + ' OFFLINE</strong></li>');
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
        $.connection.hub.qs = { "username" : username };
        $.connection.hub.start().done(function () {
            $("#userInput").on("keypress", function (e) {
                if (e.which == 13) {
                    // Call the Send method on the hub. 
                    chat.server.sendMessage(username, $('#userInput').val());
                    // Clear text box and reset focus for next comment. 
                    $('#userInput').val('').focus();
                }
            })

            $('#sendMsgBtn').click(function () {
                // Call the Send method on the hub. 
                chat.server.sendMessage(username, $('#userInput').val());
                // Clear text box and reset focus for next comment. 
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



