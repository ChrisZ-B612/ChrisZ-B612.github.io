/**
 * Created by Chris, Z on 2016/1/23 18:39.
 * Supported in Chrome & Firefox
 */
// Proxying a normal object
let target1 = {};
let handler1 = {
    get: function (receiver, name) {
        return `Hello, ${name}!`;
    }
};

let p1 = new Proxy(target1, handler1);
console.log(`p1.world: ${p1.world}`);

// Proxying a function object
let target2 = function () {
    return "I am the target2";
};
let handler2 = {
    apply: function (receiver, ...args) {
        return `I am the proxy: ${args.join(", ")}`;
    }
};

let p2 = new Proxy(target2, handler2);
console.log(p2.call({name: "Chris", toString() {return this.name;}}, "Z"));

/**
 * There are traps available for all of the runtime-level meta-operations:

 let handler =
 {
   // target.prop
   get: ...,
   // target.prop = value
   set: ...,
   // 'prop' in target
   has: ...,
   // delete target.prop
   deleteProperty: ...,
   // target(...args)
   apply: ...,
   // new target(...args)
   construct: ...,
   // Object.getOwnPropertyDescriptor(target, 'prop')
   getOwnPropertyDescriptor: ...,
   // Object.defineProperty(target, 'prop', descriptor)
   defineProperty: ...,
   // Object.getPrototypeOf(target), Reflect.getPrototypeOf(target),
   // target.__proto__, object.isPrototypeOf(target), object instanceof target
   getPrototypeOf: ...,
   // Object.setPrototypeOf(target), Reflect.setPrototypeOf(target)
   setPrototypeOf: ...,
   // for (let i in target) {}
   enumerate: ...,
   // Object.keys(target)
   ownKeys: ...,
   // Object.preventExtensions(target)
   preventExtensions: ...,
   // Object.isExtensible(target)
   isExtensible :...
 }

**/