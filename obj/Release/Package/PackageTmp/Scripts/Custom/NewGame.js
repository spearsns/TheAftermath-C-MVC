$(document).ready(function () {
    var gameNameErr = false;
    
    $('#gameName').on('change', function () {
        var message = $("#gameNameMsg");
        $.ajax({
            type: "POST",
            url: 'CheckGameName',
            data: '{Gamename: "' + $("#gameName").val() + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    message.css("color", "green");
                    message.html("AVAILABLE");
                    gameNameErr = false;
                    $("#submitBtn").prop("disabled", false);
                }
                else {
                    message.css("color", "red");
                    message.html("UNAVAILABLE");
                    gameNameErr = true;
                    $("#submitBtn").prop("disabled", true);
                }
            }
        });

        if (gameNameErr === false) {
            $("#submitBtn").prop("disabled", false);
        }
    });
});