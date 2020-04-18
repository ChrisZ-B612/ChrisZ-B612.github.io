/**
 * Created by Chris, Z on 2016/1/21 11:39.
 * Supported in Chrome & Firefox
 */
"use strict";

let now = Date.now;
let enhancedObjectLiteral = {
    // __proto__, requires native support
    __proto__: {toString() {return "__proto__";}},
    // Shorthand for "now: now"
    now,
    // Methods
    toString() {
        // Super calls
        return `call super -> ${super.toString()}`;
    },
    // Computed (dynamic) property names
    ["prop_" + (i => Math.pow(2, i))(10)]: 1024
};

console.log(`enhancedObjectLiteral.__proto__: ${enhancedObjectLiteral.__proto__}`);
console.log(`enhancedObjectLiteral.now(): ${enhancedObjectLiteral.now()}`);
console.log(`enhancedObjectLiteral.toString(): ${enhancedObjectLiteral.toString()}`);
console.dir(`enhancedObjectLiteral.prop_1024: ${enhancedObjectLiteral.prop_1024}`);