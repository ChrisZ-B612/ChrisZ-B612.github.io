/**
 * Created by Chris, Z on 2016/1/21 11:39.
 */
var now = Date.now;
var eol = {
    // __proto__
    __proto__: {toString() {return "super";}},
    // Shorthand for "now: now"
    now,
    // Methods
    toString() {
        "use strict";
        // Super calls
        return "eol " + super.toString();
    },
    // Computed (dynamic) property names
    ["prop_" + (i => Math.pow(2, i))(10)]: 1024
};

console.dir(`eol.__proto__: ${eol.__proto__}`);
console.dir(`eol.now(): ${eol.now()}`);
console.dir(`eol.toString(): ${eol.toString()}`);