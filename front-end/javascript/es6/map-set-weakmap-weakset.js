/**
 * Created by Chris, Z on 2016/1/23 18:27.
 * Supported in Chrome & Firefox
 */
// Sets
var s = new Set();
s.add("hello").add("goodbye").add("hello");
console.log(`s.size: ${s.size}`);
console.log(`s.has("hello"): ${s.has("hello")}`);

// Maps
var m = new Map();
m.set("hello", 42);
m.set(s, 34);
console.log(`m.size: ${m.size}`);
console.log(`m.get(s): ${m.get(s)}`);

// Weak Maps
var wm = new WeakMap();
wm.set(s, {extra: 42});
console.log(`wm.size: ${wm.size}`);

// Weak Sets
var ws = new WeakSet();
ws.add({data: 42});
console.log(`ws.size: ${ws.size}`);
// Because the added object has no other references, it will not be held in the set.