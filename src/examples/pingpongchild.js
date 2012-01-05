var name = null,
    peer = null;

oncast = function(pattern, data) {
    if (pattern === "name") {
        name = data;
    } else if (pattern === "peer") {
        peer = data;
    } else if (pattern === "message") {
        console.log(data);
        setTimeout(function() {
            peer.cast("message", "Hello.");
        }, 1000);
    }
}
