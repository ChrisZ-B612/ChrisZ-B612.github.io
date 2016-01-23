/**
 * Created by Chris, Z on 2016/1/23 18:51.
 */
console.info("Number");
console.log(`Number.EPSILON: ${Number.EPSILON}`);
console.log(`Number.isInteger(Infinity): ${Number.isInteger(Infinity)}`);
console.log(`Number.isNaN("NaN"): ${Number.isNaN("NaN")}`);

console.info("Math");
console.log(`Math.acosh(3): ${Math.acosh(3)}`);
console.log(`Math.hypot(3, 4): ${Math.hypot(3, 4)}`);
console.log(`Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2): ${Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2)}`);

console.info("String");
console.log(`"abcde".includes("cd"): ${"abcde".includes("cd")}`);
console.log(`"abc".repeat(3): ${"abc".repeat(3)}`);

console.info("Array");
console.log(`Array.from(document.querySelectorAll('*')): ${Array.from(document.querySelectorAll('*'))}`);
console.log(`Array.of(1, 2, 3): ${Array.of(1, 2, 3)}`);
console.log(`[0, 0, 0].fill(7, 1): ${[0, 0, 0].fill(7, 1)}`);
console.log(`[1, 2, 3].find(x => x == 3): ${[1, 2, 3].find(x => x == 3)}`);
console.log(`[1, 2, 3].findIndex(x => x == 2): ${[1, 2, 3].findIndex(x => x == 2)}`);
console.log(`[1, 2, 3, 4, 5].copyWithin(3, 0): ${[1, 2, 3, 4, 5].copyWithin(3, 0)}`);
console.log(`["a", "b", "c"].entries(): ${["a", "b", "c"].entries()}`);
console.log(`["a", "b", "c"].keys(): ${["a", "b", "c"].keys()}`);
console.log(`["a", "b", "c"].values(): ${["a", "b", "c"].values()}`);

console.info("Object.assign");
Object.assign(Point, {origin: new Point(0, 0)});