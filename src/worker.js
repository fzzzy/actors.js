
var console = {
    log: function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        postMessage(args.join(" "));
    }
}

var actors = {};

onmessage = function onmessage(msg) {
    try {
        var message = msg.data;
        //console.log("work", message);
        var pattern = message[0],
            data = message[1];

        if (pattern === "onspawn") {
            var scope = evalcx("lazy");
            scope.sleep = sleep;
            evalcx(read('actor.js'), scope);
            evalcx('actor_id = "' + data + '"', scope);
            evalcx(read(message[2]), scope);
            actors[data] = scope;
        } else if (pattern === "oncast") {
            if (actors[data] !== undefined) {
                var scope = actors[data],
                    toeval = 'oncast("' + message[2] + '", ' + JSON.stringify(message[3]) + ');';
                evalcx(toeval, scope);
            }
        } else if (pattern === "ongrant") {
            if (actors[data] !== undefined) {
                var subpat = message[2],
                    address = message[3],
                    scope = actors[data],
                    toeval = 'oncast("' + subpat + '", new Address("' + address + '"));';

                evalcx(toeval, scope);
            }
        }
        if (scope === undefined) {
            return;
        }
        var messages = evalcx('messages', scope);
        evalcx('messages = [];', scope);
        messages.map(function(x) {
            postMessage(JSON.parse(x));
        });
    } catch (e) {
        console.log("Error:", e, e.stack);
    }
}
