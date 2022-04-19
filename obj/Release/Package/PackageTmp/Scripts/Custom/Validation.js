$(document).ready(function () {

    var usernameErr = false;
    var emailErr = false;
    var emailValidErr = false;
    var emailMatchErr = false;
    var passwordMatchErr = false;

    $('#username').on('change', function () {
        var message = $("#usernameMsg");
        $.ajax({
            type: "POST",
            url: '/Home/CheckUsername',
            data: '{Username: "' + $("#username").val() + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    message.css("color", "green");
                    message.html("AVAILABLE");
                    usernameErr = false;
                }
                else {
                    message.css("color", "red");
                    message.html("UNAVAILABLE");
                    usernameErr = true;
                    $("#submitBtn").prop("disabled", true);
                }
            }
        });

        if (usernameErr === false && emailErr === false && emailValidErr === false && emailMatchErr === false && passwordMatchErr === false) {
            $("#submitBtn").prop("disabled", false);
        }
    });

    $('#password').on('change', function () {
        var message = $("#confirmPWMsg");
        if ($('#password').val() !== $('#confirmPassword').val()) {
            message.css("color", "red");
            message.html("DON'T MATCH");
            passwordMatchErr = true;
            $("#submitBtn").prop("disabled", true);
        }
        else {
            message.css("color", "green");
            message.html("MATCH");
            passwordMatchErr = false;
        }

        if (usernameErr === false && emailErr === false && emailValidErr === false && emailMatchErr === false && passwordMatchErr === false) {
            $("#submitBtn").prop("disabled", false);
        }
    });

    $('#confirmPassword').on('change', function () {
        var message = $("#confirmPWMsg");
        if ($('#password').val() !== $('#confirmPassword').val()) {
            message.css("color", "red");
            message.html("DON'T MATCH");
            passwordMatchErr = true;
            $("#submitBtn").prop("disabled", true);
        }
        else {
            message.css("color", "green");
            message.html("MATCH");
            passwordMatchErr = false;
        }

        if (usernameErr === false && emailErr === false && emailValidErr === false && emailMatchErr === false && passwordMatchErr === false) {
            $("#submitBtn").prop("disabled", false);
        }
    });


    $('#email').on('change', function () {
        var message = $("#emailMsg");
        $.ajax({
            type: "POST",
            url: '/Home/CheckEmail',
            data: '{Email: "' + $("#email").val() + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    message.css("color", "green");
                    message.html("UNIQUE");
                    emailErr = false;
                    validate();
                }
                else {
                    message.css("color", "red");
                    message.html("ON RECORD");
                    emailErr = true;
                    $("#submitBtn").prop("disabled", true);
                    validate();
                }
            }
        });

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        function validate() {
            var email = $("#email").val();

            if (validateEmail(email)) {
                emailValidErr = false;
                message.append(" & VALID");
            }
            else {
                emailValidErr = true;
                message.css("color", "red");
                message.append(" & INVALID");
                $("#submitBtn").prop("disabled", true);
            }
            return false;
        }

        if ($('#email').val() !== $('#confirmEmail').val()) {
            $("#confirmEmailMsg").css("color", "red");
            $("#confirmEmailMsg").html("DON'T MATCH");
            emailMatchErr = true;
            $("#submitBtn").prop("disabled", true);
        }
        else {
            $("#confirmEmailMsg").css("color", "green");
            $("#confirmEmailMsg").html("MATCH");
            emailMatchErr = false;
        }

        if (usernameErr === false && emailErr === false && emailValidErr === false && emailMatchErr === false && passwordMatchErr === false) {
            $("#submitBtn").prop("disabled", false);
        }
    });

    $('#confirmEmail').on('change', function () {
        var message = $("#confirmEmailMsg");
        if ($('#email').val() !== $('#confirmEmail').val()) {
            message.css("color", "red");
            message.html("DON'T MATCH");
            emailMatchErr = true;
            $("#submitBtn").prop("disabled", true);
        }
        else {
            message.css("color", "green");
            message.html("MATCH");
            emailMatchErr = false;
        }

        if (usernameErr === false && emailErr === false && emailValidErr === false && emailMatchErr === false && passwordMatchErr === false) {
            $("#submitBtn").prop("disabled", false);
        }
    });

}); // $(document).ready


