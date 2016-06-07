/**
 * Created by Chris, Z on 2016/1/23 18:27.
 * Supported in Chrome & Firefox
 */
// Sets
let s = new Set();
s.add("hello").add("goodbye").add("hello");
console.log(`s.size: ${s.size}`);
console.log(`s.has("hello"): ${s.has("hello")}`);

// Maps
let m = new Map();
m.set("hello", 42);
m.set(s, 34);
console.log(`m.size: ${m.size}`);
console.log(`m.get(s): ${m.get(s)}`);

// Weak Maps
let wm = new WeakMap();
wm.set(s, {extra: 42});
console.log(`wm.size: ${wm.size}`);// 有点不明白……

// Weak Sets
let ws = new WeakSet();
ws.add({data: 42});
console.log(`ws.size: ${ws.size}`);// 有点不明白……
// Because the added object has no other references, it will not be held in the set.