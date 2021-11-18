$(document).ready(function () {

    var target;

    $("li").click(function (event) {
        target = $(this).attr("data-target");
        promise = first().then(second).then(third);
    });

    function first() {
        d = new $.Deferred();
        $("div.show").removeClass("show");
        d.resolve();
        return d.promise()
    }
    
    function second() {
        d = new $.Deferred();
        $(target).children().click();
        d.resolve();
        return d.promise()
    }

    function third() {
        d = new $.Deferred();
        $([document.documentElement, document.body]).animate({ scrollTop: $(target).children().offset().top }, 600);
        d.resolve();
        return d.promise()
    }
});