/**
 * Created by Chris, Z on 2016/1/23 18:51.
 * Supported in Chrome & Firefox
 */
class MyArray extends Array {
    constructor(...args) {
        super(...args);
    }
}

var arr = new MyArray();
arr[1] = 12;
console.log(`arr.length: ${arr.length}`);