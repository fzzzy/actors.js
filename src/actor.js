
var actor_id = null,
    child_id = 0,
    messages = [];

function postMessage(msg) {
    messages.push(JSON.stringify(msg));
}

var console = {
    log: function() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        postMessage(args.join(" "));
    }
}

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

function spawn(script) {
    var num = child_id++,
        name = actor_id + "-" + num;
    postMessage(["spawn", name, script]);
    return new Address(name);
}

function setTimeout(func, timeout) {
    // In spidermonkey I can't do async timeouts yet,
    // so just fake it for now.
    var args = [];
    for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    sleep(timeout / 1000);
    func.apply(null, args);
}


