/**
 * Created by Chris, Z on 2016/1/23 15:43.
 */
// Callee-evaluated default parameter values
function f1(x, y = 12) {
    return x + y;
}
f1(3) === 15;

// Bind trailing parameters to an array
function f2(x, ...y) {
    return x * y.length;
}
f2(3, "hello", true) === 6;

// Turn an array into consecutive arguments in a function call
function f3(x, y, z) {
    return x + y + z;
}
f3(...[1, 2, 3]) === 6;