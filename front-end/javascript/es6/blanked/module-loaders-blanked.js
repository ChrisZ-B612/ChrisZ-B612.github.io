/**
 * Created by Chris, Z on 2016/1/23 16:50.
 */
// Dynamic loading – ‘System’ is default loader
System.import("lib/math").then(function (math) {
    alert("2π = " + math.sum(math.pi, math.pi));
});

// Create execution sandboxes – new Loaders
var loader = new Loader({
    global: fixup(window) // replace ‘console.log’
});
loader.eval("console.log('hello world!');");

// Directly manipulate module cache
System.get("jquery");
System.set("jquery", Module({$: $})); // WARNING: not yet finalized