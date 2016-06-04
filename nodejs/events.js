/**
 * Created by Chris, Z on 3/28/2016 7:29 AM.
 */
var events = require("events");

var eventEmitter = new events.EventEmitter();

var connectHandler = function connected() {
    console.log("connection successful.");
    eventEmitter.emit("data_received");
};

eventEmitter.on("connection", connectHandler);

eventEmitter.on("data_received", function () {
    console.log("data received successful.");
});

eventEmitter.emit("connection");

console.log("Program Ended.");