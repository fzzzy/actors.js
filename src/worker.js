

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
            for (var i = 2; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            sleep(timeout / 1000);
            func.apply(null, args);
        }
    }

    var clean_names = {},
        stored_global = {},
        globalnames = Object.getOwnPropertyNames(global),
        allowed_global = {
        "Object": true,
        "Function": true,
        "Array": true,
        "postMessage": true,
        "console": true,
        "importScripts": true,
        "sleep": true,
        "spawn": true,
        "onmessage": true,
        "setTimeout": true
    };
    for (var i = 0; i < globalnames.length; i++) {
        var name = globalnames[i];
        stored_global[name] = global[name];
        if (allowed_global[name] !== true) {
            clean_names[name] = true;
            try {
                Object.defineProperty(global, name, {value: undefined});
            } catch (e) {
                global[name] = undefined;
            }
        }
    }
    stored_global.setTimeout = setTimeout;

    function Address(actnum) {
        this.id = actnum;
        this.cast = function(pattern, data) {
                postMessage(["cast", actnum, pattern, data]);
        }
        this.grant = function grant(pattern, data) {
            postMessage(["grant", actnum, pattern, data.id]);
            return function revoke() {
                postMessage(["revoke", actnum, pattern, data.id]);
            }
        }
    }

    var actors = {};
    var childid = 0;
    var actor_id = null;

    function spawn(script) {
        var num = childid++,
            name = actor_id + "-" + num;
        postMessage(["spawn", name, script]);
        return new Address(name);
    }
    global.spawn = spawn;

    function populate_scope() {
        //console.log("populate", actor_id);
        var scope = actors[actor_id];
        for (var name in scope) {
            //console.log("pop", name);
            global[name] = scope[name];
        }
    }

    function clean_scope() {
        //console.log("clean", actor_id);
        var scope = actors[actor_id],
            names = Object.getOwnPropertyNames(global);

        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if (allowed_global[name] !== true && clean_names[name] !== true) {
            //console.log("saving scope", name, clean_names[name]);
                scope[name] = global[name];
                global[name] = undefined;
            }
        }
    }

    return function onmessage(msg) {
        var message = msg.data;
        //console.log("work", message);
        var pattern = message[0],
            data = message[1];

        if (pattern === "onspawn") {
            var scope = {};
            actor_id = data;
            actors[data] = scope;
            importScripts(message[2]);
            clean_scope();
        } else if (pattern === "oncast") {
            //console.log("castttt", actors[data]);
            if (actors[data] !== undefined) {
                actor_id = data;
                populate_scope();
                //console.log("def", oncast !== undefined);
                if (global.oncast !== undefined) {
                    global.oncast(message[2], message[3]);
                }
                clean_scope();
            }
        } else if (pattern === "ongrant") {
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

