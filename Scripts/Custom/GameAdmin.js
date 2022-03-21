$(document).ready(function () {

    $('#gateway').change(function () {
        $('#confirmModal').modal('toggle');
    });

    $('#submitConfirmBtn').click(function() {
        $('#confirmModal').modal('toggle');
    });

    $('#cancelConfirmBtn').click(function () {
        $('#gateway').val('False');
        $('#confirmModal').modal('toggle');
    });
    
});