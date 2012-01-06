
function make_onmessage(work, num) {
    work.onmessage = function(msg) {
        var message = msg.data;
        if (typeof message === "string") {
            try {
                var node = document.createElement("span");
                node.appendChild(
                    document.createTextNode(message));
                document.body.appendChild(node);
            } catch (e) {
                console.log(num, message);
            }
        } else if (message[0] === "cast" || message[0] === "castaddress") {
            var target = message[1],
                pattern = message[2],
                data = message[3];

            cast(target, pattern, data, message[0]);
        } else if (message[0] === "spawnchild") {
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

    if (mode === "castaddress") {
        worker.postMessage(["castaddress", id, pattern, data]);
    } else {
        worker.postMessage(["cast", id, pattern, data]);
    }
}

function Address(id) {
    this.id = id;
}

Address.prototype = {
    cast: function(pattern, data) {
        cast(this.id, pattern, data);
    }
}

function spawn(script) {
    var worknum = nextworker++,
        work = workers[worknum],
        num = actor_id++,
        address = new Address(worknum + "-" + num);

    if (nextworker > workers.length - 1) {
        nextworker = 0;
    }
    work.postMessage(["spawn", "" + worknum + "-" + num, script]);
    return address;
}

if (arguments.length) {
    for (var i = 0; i < arguments.length; i++) {
        spawn(arguments[i]);
    }
} else {
    spawn("examples/pingpong.js");
}
