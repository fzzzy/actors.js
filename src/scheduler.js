
function make_onmessage(work, num) {
    work.onmessage = function(msg) {
        let message = msg.data;
        if (message[0] === "cast") {
            let target = message[1],
                pattern = message[2],
                data = message[3];
            var act = actors[target].cast(pattern, data);
        }
        if (typeof message === "string") {
            console.log(message);
        }
    }
}

let workers = [];
let actors = {};
let actor_id = 0;

for (var i = 0; i < 4; i++) {
    let work = new Worker("worker.js");
    make_onmessage(work, i);
    workers.push(work);
}

function Address(worker, actnum) {
    this.actnum = actnum;
    this.cast = function(pattern, data) {
        if (data instanceof Address) {
            worker.postMessage(["castaddress", actnum, pattern, data.actnum]);
        } else {
            worker.postMessage(["cast", actnum, pattern, data]);
        }
    }
}

function spawn(script) {
    let work = workers.shift(),
        num = actor_id++,
        address = new Address(work, num);

    actors[num] = address;
    work.postMessage(["spawn", num, script]);
    return address;
}

if (this.document !== undefined) {
    let script = document.createElement("script");
    script.src = "main.js";
    document.head.appendChild(script);
} else {
    load("main.js");
}
