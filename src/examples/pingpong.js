
var a1 = spawn('examples/pingpongchild.js');
var a2 = spawn('examples/pingpongchild.js');

a1.cast("peer", a2);
a2.cast("peer", a1);

a1.cast("message", ["Hello, World", 0]);
