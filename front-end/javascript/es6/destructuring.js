/**
 * Created by Chris, Z on 2016/1/22 13:50.
 */
"use strict";
// list matching
var [a, , b] = [1, 2, 3];
a === 1 && b === 3;

// object matching
var {name: name1, age: age1} = {name: "Chris, Z", age: 28};
var {gender} = {gender: "X-MAN"};
console.log(`name1 = ${name1}, age1 = ${age1}, gender = ${gender}`);

// used in parameter position
function g({name: x}) {
    console.log(x);
}
g({name: 5});

// Fail-soft destructuring
var [a] = [];
a === undefined;

// Fail-soft destructuring with defaults
var [a = 1] = [];
a === 1;

// Destructuring + defaults arguments
function r({x, y, w = 10, h = 10}) {
    return x + y + w + h;
}
r({x: 1, y: 2}) === 23;