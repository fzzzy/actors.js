
var a1 = spawn('pingpong.js');
var a2 = spawn('pingpong.js');

a1.cast("peer", a2);
a2.cast("peer", a1);
