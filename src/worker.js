
var console = {
    log: function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        postMessage(args.join(" "));
    }
}

onmessage = (function(global) {
    if (global.importScripts === undefined) {
        global.importScripts = function importScripts() {
            for (var i = 0; i < arguments.length; i++) {
                stored_global.load(arguments[i]);
            }
        }
    }
    var stored_global = {};
    var globalnames = Object.getOwnPropertyNames(global);
    for (var i = 0; i < globalnames.length; i++) {
        var name = globalnames[i];
        stored_global[name] = global[name];
        if (name !== "Object" && name !== "Function" && name !== "Array"&& name !== "postMessage" && name !== "console" && name !== "importScripts") {
            try {
                Object.defineProperty(global, name, {value: undefined});
            } catch (e) {
                global[name] = undefined;
            }
        }
    }

    function Address(actnum) {
        this.cast = function(pattern, data) {
            postMessage(["cast", actnum, pattern, data]);
        }
    }

    var actors = {};

    return function onmessage(msg) {
        var message = msg.data;
        var pattern = message[0],
            data = message[1];

        if (pattern === "spawn") {
            var scope = {};
            actors[data] = scope;
            importScripts(message[2]);
        } else if (pattern === "cast") {
            if (actors[data] === undefined || oncast === undefined) return;
            oncast(message[2], message[3]);
        } else if (pattern === "castaddress") {
            if (actors[data] === undefined || oncast === undefined) return;

            var subpat = message[2],
                address = new Address(message[3]);

            oncast(subpat, address);
        }
    }
})(this);

