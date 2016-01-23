/**
 * Created by Chris, Z on 2016/1/22 13:50.
 */
console.info("list matching");
var [a, , b] = [1, 2, 3];
console.log(`[a, , b] = [1, 2, 3]: a = ${a}, b = ${b}`);

console.info("object matching");
var {name: name, age: age} = {name: "Chris, Z", age: 28};
var {name, age} = {name: "Chris, Z", age: 28};
console.log(`name = ${name}, age = ${age}`);

console.info("Used in parameter position");
function g({name: x}) {
    "use strict";
    console.log(x);
}
g({name: 5});

console.info("Fail-soft destructuring");
var [a] = [];
console.log(`a === undefined: ${a === undefined}`);

console.info("Fail-soft destructuring with defaults");
var [a = 1] = [];
console.log(`a === 1: ${a === 1}`);
