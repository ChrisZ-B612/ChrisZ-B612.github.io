/**
 * Created by Chris, Z on 2016/1/22 13:50.
 * Supported in Chrome, partial supported in Firefox
 */
"use strict";

// array matching
let [a, , b] = [1, 2, 3];

// object matching
let {name: name1, age: age1} = {name: "Chris, Z", age: 28};
let {gender} = {gender: "X-Men"};
console.log(`name1 = ${name1}, age1 = ${age1}, gender = ${gender}`);

// can be used in parameter position
function g({name: x}) {
    console.log(x);
}
g({name: "Chris, Z"});

// Fail-soft destructuring
let [c] = [];
console.log(`c: ${c}`);

// Fail-soft destructuring with defaults
let [d = 1] = [];
console.log(`d: ${d}`);

// Destructuring + defaults arguments
function r({x, y, w = 10, h = 10}) {// Unsupported in Firefox
    return x + y + w + h;
}
console.log(`r({x: 1, y: 2}): ${r({x: 1, y: 2})}`);