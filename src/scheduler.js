
function make_onmessage(work, num) {
    work.onmessage = function(msg) {
        var message = msg.data;
        if (typeof message === "string") {
            try {
                var node = document.createElement("div");
                node.appendChild(
                    document.createTextNode(message));
                document.body.appendChild(node);
                while (document.body.childNodes.length > 50) {
                    document.body.removeChild(document.body.firstChild);
                }
            } catch (e) {
                console.log(num, message);
            }
        } else if (message[0] === "cast" || message[0] === "grant" || message[0] === "revoke") {
            var target = message[1],
                pattern = message[2],
                data = message[3];

            cast(target, pattern, data, message[0]);
        } else if (message[0] === "spawn") {
            var child = spawn(message[2]);
            children[message[1]] = child.id;
        }
    }
}

var workers = [];
var children = {};
var nextworker = 0;
var actor_id = 0;

for (var i = 0; i < 4; i++) {
    var work = new Worker("worker.js");
    make_onmessage(work, i);
    workers.push(work);
}

function cast(id, pattern, data, mode) {
    if (children[id] !== undefined) {
        id = children[id];
    }
    //console.log("cast", id, mode, pattern, data);
    var worker = workers[id.split('-')[0]];

    if (mode === "grant") {
        var nonce = id + ':' + data;
        children[nonce] = id;
        worker.postMessage(["ongrant", id, pattern, nonce]);
    } else if (mode === "revoke") {
        var nonce = id + ':' + data;
        children[nonce] = undefined;
    } else {
        worker.postMessage(["oncast", id, pattern, data]);
    }
}

function Address(id) {
    this.id = id;
}

Address.prototype = {
    cast: function(pattern, data) {
        cast(this.id, pattern, data);
    },
    grant: function(pattern, data) {
        cast(this.id, pattern, data, "grant");
    }
}

function spawn(script) {
    var worknum = nextworker++,
        work = workers[worknum],
        num = actor_id++,
        address = new Address(worknum + "-" + num);

    //console.log("spawn worknum", worknum);
    if (nextworker > workers.length - 1) {
        nextworker = 0;
    }
    work.postMessage(["onspawn", worknum + "-" + num, script]);
    return address;
}

if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
        spawn(arguments[i]);
    }
} else {
    spawn("examples/pingpong.js");
}
