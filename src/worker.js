
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
        global.setTimeout = function setTimeout(func, timeout) {
            // In spidermonkey I can't do async timeouts yet,
            // so just fake it for now.
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            sleep(timeout / 1000);
            func.apply(null, args);
        }
    }

    var stored_global = {};
    var globalnames = Object.getOwnPropertyNames(global);
    var allowed_global = {
        "Object": true,
        "Function": true,
        "Array": true,
        "postMessage": true,
        "console": true,
        "importScripts": true,
        "sleep": true
    };
    for (var i = 0; i < globalnames.length; i++) {
        var name = globalnames[i];
        stored_global[name] = global[name];
        if (allowed_global[name] !== true) {
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

    function spawn(script) {
        
    }

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

