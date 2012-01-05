
var a1 = spawn('pingpongchild.js');
var a2 = spawn('pingpongchild.js');

a1.cast("peer", a2);
a2.cast("peer", a1);

