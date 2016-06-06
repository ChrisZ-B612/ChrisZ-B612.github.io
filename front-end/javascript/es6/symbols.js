/**
 * Created by Chris, Z on 2016/1/23 18:48.
 * TODO:: Try again
 */
let MyClass = (function () {

    // module scoped symbol
    let key = Symbol("unique");
    typeof key === "symbol";
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

let c = new MyClass("hello");
console.log(`c.unique: ${c.unique}`);