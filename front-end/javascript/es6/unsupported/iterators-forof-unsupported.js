/**
 * Created by Chris, Z on 2016/1/23 16:19.
 */
"use strict";
console.info("What the f**k is this??");
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

for (var n of fibonacci) {
    if (n > 1000) break;
    console.log(n);
}