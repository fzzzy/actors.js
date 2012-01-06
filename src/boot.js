#!/usr/bin/env js
// For spidermonkey with --enable-threadsafe

var console = {
    log: function() {
        var foo = "";
        for (var i = 0; i < arguments.length; i++) {
            foo += arguments[i] + " ";
        }
        print(foo)
    }
};

function importScripts() {
    for (var i = 0; i < arguments.length; i++) {
        load(arguments[i]);
    }
}

importScripts("scheduler.js");
