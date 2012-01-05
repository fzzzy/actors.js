
var console = {
    log: function() {
        var foo = "";
        for (var i = 0; i < arguments.length; i++) {
            foo += arguments[i] + " ";
        }
        print(foo)
    }
};

load("scheduler.js");
