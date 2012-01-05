
function make_onmessage(work, num) {
    work.onmessage = function(msg) {
        let message = msg.data;
        if (typeof message === "string") {
            console.log(message);
        } else if (message[0] === "cast") {
            let target = message[1],
                pattern = message[2],
                data = message[3];

            cast(target, pattern, data);
        }
    }
}

let workers = [];
let nextworker = 0;
let actor_id = 0;

for (var i = 0; i < 4; i++) {
    let work = new Worker("worker.js");
    make_onmessage(work, i);
    workers.push(work);
}

function cast(id, pattern, data) {
    let target = id.split('-'),
        worknum = target[0],
        actnum = target[1],
        worker = workers[worknum];

    if (data instanceof Address) {
        worker.postMessage(["castaddress", worknum + "-" + actnum, pattern, data.id]);
    } else {
        worker.postMessage(["cast", worknum + "-" + actnum, pattern, data]);
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
    let worknum = nextworker++,
        work = workers[worknum],
        num = actor_id++,
        address = new Address(worknum + "-" + num);

    if (nextworker > workers.length - 1) {
        nextworker = 0;
    }

    work.postMessage(["spawn", "" + worknum + "-" + num, script]);
    return address;
}

importScripts(arguments[0] ? arguments[0] : "main.js");
