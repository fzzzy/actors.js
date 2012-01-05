
var peer = null;

oncast = function(pattern, data) {
    if (pattern === "peer") {
        peer = data;
        data.cast("message", "Hello.");
    } else if (pattern === "message") {
        console.log(data);
    }
}

