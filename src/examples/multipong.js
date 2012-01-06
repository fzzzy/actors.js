
function spawn_pair(name) {
    var a1 = spawn('examples/pingpongchild.js');
    var a2 = spawn('examples/pingpongchild.js');

    a1.grant("peer", a2);
    a2.grant("peer", a1);

    a1.cast("message", ["Hello, " + name, 0]);
}

for (var i = 0; i < 20; i++) {
    spawn_pair("Fred Flintstone" + i);
}

