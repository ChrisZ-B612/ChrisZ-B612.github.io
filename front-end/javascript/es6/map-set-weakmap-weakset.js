/**
 * Created by Chris, Z on 2016/1/23 18:27.
 */
console.info("Set");
var s = new Set();
s.add("hello").add("goodbye").add("hello");
console.log(`s.size === 2: ${s.size === 2}`);
console.log(`s.has("hello"): ${s.has("hello")}`);

console.info("Map");
var m = new Map();
m.set("hello", 42);
m.set(s, 34);
console.log(`m.size: ${m.size}`);
console.log(`m.get(s) === 34: ${m.get(s) === 34}`);

console.info("Weak Map");
var wm = new WeakMap();
wm.set(s, {extra: 42});
console.log(`wm.size: ${wm.size}`);

console.info("Weak Set");
var ws = new WeakSet();
ws.add({data: 42});
console.log(`ws.size: ${ws.size}`);