
oncast = (function() {
    var name = null,
        peer = null;

    return function(pattern, data) {
        if (pattern === "peer") {
            peer = data;
        } else if (pattern === "message") {
            console.log(data);
            setTimeout(function() {
                peer.cast("message", data);
            }, 1000);
        }
    }
})();
