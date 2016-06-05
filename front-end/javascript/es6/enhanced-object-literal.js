/**
 * Created by Chris, Z on 2016/1/21 11:39.
 */
"use strict";
var now = Date.now;
var eol = {
    // __proto__
    __proto__: {toString() {return "super";}},
    // Shorthand for "now: now"
    now,
    // Methods
    toString() {
        // Super calls
        return `eol -> ${super.toString()}`;
    },
    // Computed (dynamic) property names
    ["prop_" + (i => Math.pow(2, i))(10)]: 1024
};

console.log(`eol.__proto__: ${eol.__proto__}`);
console.log(`eol.now(): ${eol.now()}`);
console.log(`eol.toString(): ${eol.toString()}`);
console.dir(`eol.prop_1024: ${eol.prop_1024}`);