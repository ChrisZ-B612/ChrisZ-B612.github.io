/**
 * Created by Chris, Z on 2016/1/23 18:48.
 * Supported in Chrome & Firefox
 */
let MyClass = (function () {

    // module scoped symbol
    let key = Symbol("key");
    console.log(`typeof key: ${typeof key}`);

    function  MyClass(privateData) {
        this[key] = privateData;
    }

    MyClass.prototype = {
        doStuff: function () {
            console.log(this[key]);
        }
    };

    return MyClass;
})();

let c = new MyClass("Hello Chris.");
c.doStuff();