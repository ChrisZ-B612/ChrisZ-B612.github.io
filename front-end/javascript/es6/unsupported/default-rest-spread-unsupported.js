/**
 * Created by Chris, Z on 2016/1/23 15:43.
 */
console.info("Callee-evaluated default parameter values");
function f1(x, y = 12) {
    return x + y;
}
console.log(`f(3) == 15: ${f1(3) == 15}`);

console.info("Bind trailing parameters to an array");
function f2(x, ...y) {
    return x * y.length;
}
console.log(`f2(3, "hello", true) === 6: ${f2(3, "hello", true) === 6}`);

console.info("Turn an array into consecutive arguments in a function call");
function f3(x, y, z) {
    return x + y + z;
}
console.log(`f3(...[1, 2, 3]) === 6: ${f3(...[1, 2, 3]) === 6}`);