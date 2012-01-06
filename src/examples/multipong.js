
function spawn_pair(name) {
    var a1 = spawn('examples/pingpongchild.js');
    var a2 = spawn('examples/pingpongchild.js');

    a1.cast("peer", a2);
    a2.cast("peer", a1);

    a1.cast("message", ["Hello, " + name, 0]);
}

spawn_pair("Fred Flintstone");

setTimeout(spawn_pair, 250, "Barney Rubble");
setTimeout(spawn_pair, 500, "George Jetson");
setTimeout(spawn_pair, 750, "Bigfoot");
