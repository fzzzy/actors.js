
var a1 = spawn('examples/pingpongchild.js');
var a2 = spawn('examples/pingpongchild.js');

var revoke1 = a1.grant("peer", a2),
    revoke2 = a2.grant("peer", a1);

a1.cast("message", ["Hello, World", 0]);

/*setTimeout(function() {
    revoke1();
    revoke2();
}, 20000);
*/