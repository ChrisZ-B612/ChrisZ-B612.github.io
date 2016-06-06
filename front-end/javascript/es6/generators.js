/**
 * Created by Chris, Z on 2016/1/23 16:37.
 */
let fibonacci = {
    [Symbol.iterator]: function*() {
        let pre = 0, cur = 1;
        for (; ;) {
            let temp = pre;
            pre = cur;
            cur += temp;
            yield cur;
        }
    }
};

let arr = [];
for (let n of fibonacci) {
    // truncate the sequence at 1000
    if (n > 1000) break;
    arr.push(n);
}
console.log(`Generators: ${arr}`);