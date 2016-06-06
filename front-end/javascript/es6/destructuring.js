/**
 * Created by Chris, Z on 2016/1/22 13:50.
 * Supported in Chrome, partial supported in Firefox
 */
"use strict";
// list matching
let [a, , b] = [1, 2, 3];
a === 1 && b === 3;

// object matching
let {name: name1, age: age1} = {name: "Chris, Z", age: 28};
let {gender} = {gender: "X-Men"};
console.log(`name1 = ${name1}, age1 = ${age1}, gender = ${gender}`);

// used in parameter position
function g({name: x}) {
    console.log(x);
}
g({name: 5});

// Fail-soft destructuring
let [c] = [];
c === undefined;

// Fail-soft destructuring with defaults
let [d = 1] = [];
d === 1;

// Destructuring + defaults arguments
function r({x, y, w = 10, h = 10}) {
    return x + y + w + h;
}
r({x: 1, y: 2}) === 23;