
oncast = (function() {
    var name = null,
        peer = null;

    return function(pattern, data) {
        if (pattern === "peer") {
            peer = data;
        } else if (pattern === "message") {
            console.log(data[0] + " " + data[1] + " ");
            data[1] = data[1] + 1;
            //setTimeout(function() {
            peer.cast("message", data);
            //}, 1000);
        }
    }
})();
