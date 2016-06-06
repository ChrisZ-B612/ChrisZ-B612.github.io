/**
 * Created by Chris, Z on 2016/1/23 16:19.
 * Supported in Chrome & Firefox
 */
"use strict";
let fibonacci = {
    [Symbol.iterator]() {
        let pre = 0, cur = 1;
        return {
            next() {
                [pre, cur] = [cur, pre + cur];
                return {done: false, value: cur}
            }
        }
    }
};

let arr = [];
for (let n of fibonacci) {
    if (n > 1000) break;
    arr.push(n);
}
console.log(`Iterator: ${arr}`);