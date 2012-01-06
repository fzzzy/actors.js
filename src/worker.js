

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
        "setTimeout": true,
        "sleep": true,
        "spawn": true,
        "onmessage": true
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
        this.id = actnum;
        this.cast = function(pattern, data) {
            if (data instanceof Address) {
                postMessage(["castaddress", actnum, pattern, data.id]);
            } else {
                postMessage(["cast", actnum, pattern, data]);
            }
        }
    }

    var actors = {};
    var childid = 0;
    var actor_id = null;

    function spawn(script) {
        var num = childid++,
            name = actor_id + "-" + num;
        postMessage(["spawnchild", name, script]);
        return new Address(name);
    }
    global.spawn = spawn;

    function populate_scope() {
        var scope = actors[actor_id];
        for (var name in scope) {
            global[name] = scope[name];
        }
    }

    function clean_scope() {
        var scope = actors[actor_id];
        for (var name in global) {
            if (allowed_global[name] !== true) {
                scope[name] = global[name];
                global[name] = undefined;
            }
        }
    }

    return function onmessage(msg) {
        var message = msg.data;
        var pattern = message[0],
            data = message[1];

        if (pattern === "spawn") {
            var scope = {};
            actor_id = data;
            actors[data] = scope;
            importScripts(message[2]);
            clean_scope();
        } else if (pattern === "cast") {
            if (actors[data] !== undefined) {
                actor_id = data;
                populate_scope();
                if (oncast !== undefined) {
                    oncast(message[2], message[3]);
                }
                clean_scope();
            }
        } else if (pattern === "castaddress") {
            if (actors[data] !== undefined) {
                var subpat = message[2],
                    address = new Address(message[3]);

                actor_id = data;
                populate_scope();
                if (oncast !== undefined) {
                    oncast(subpat, address);
                }
                clean_scope();
            }
        }
    }
})(this);

