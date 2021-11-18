$(document).ready(function () {
    var emailErr = false;
    var emailValidErr = false;

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
                    message.css("color", "red");
                    message.html("NO RECORD FOUND");
                    emailErr = true;
                    $("#submitBtn").prop("disabled", true);
                    validate();
                }
                else {
                    message.css("color", "green");
                    message.html("ON RECORD");
                    emailErr = false;
                    validate();
                    if (emailErr == false && emailValidErr == false) {
                        $("#submitBtn").prop("disabled", false);
                    }
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
        
    });

});

