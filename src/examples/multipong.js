
function spawn_pair(name) {
    var a1 = spawn('examples/pingpongchild.js');
    var a2 = spawn('examples/pingpongchild.js');

    a1.grant("peer", a2);
    a2.grant("peer", a1);

    a1.cast("message", ["Hello, " + name, 0]);
}

spawn_pair("Fred Flintstone");
spawn_pair("Barney Rubble");
spawn_pair("George Jetson");
spawn_pair("Mighty Mouse");
spawn_pair("Powdered Toast Man");

