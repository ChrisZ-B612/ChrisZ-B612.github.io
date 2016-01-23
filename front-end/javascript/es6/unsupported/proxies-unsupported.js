/**
 * Created by Chris, Z on 2016/1/23 18:39.
 */
console.info("Proxying a normal object");
var target = {};
var handler = {
    get: function (receiver, name) {
        return `Hello, ${name}!`;
    }
};

var p1 = new Proxy(target, handler);
console.log(`p1.world: ${p1.world}`);

console.info("Proxying a function object");
var target = function () {
    return "I am the target";
};
var handler = {
    apply: function (receiver, ...args) {
        return "I am the proxy";
    }
};

var p2 = new Proxy(target, handler);
console.log(`p2: ${p2.world}`);