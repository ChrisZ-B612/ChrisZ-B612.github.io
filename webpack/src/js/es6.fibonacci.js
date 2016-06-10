/**
 * Created by Chris, Z on 6/10/2016 10:40 AM.
 */
// Generators
let fibonacci = {
    [Symbol.iterator]: function*() {
        var pre = 0,
            cur = 1;
        for (;;) {
            var temp = pre;
            pre = cur;
            cur += temp;
            yield cur;
        }
    }
};

module.exports = fibonacci;