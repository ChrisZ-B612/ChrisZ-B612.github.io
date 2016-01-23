/**
 * Created by Chris, Z on 2016/1/23 16:04.
 */
"use strict";
function f() {
    {
        //console.log(`x = ${x}`);// ReferenceError: x is not defined
        let x = "x";
        {
            const y = "Chris, Z";
            //y = "foo";// TypeError: Assignment to constant variable.
            const z = {
                name: "Chris, Z",
                toString() {
                    return this.name;
                }
            };
            z.name = "foo";
            console.log(`y = ${y}, z = ${z}`);
        }
        console.log(`x = ${x}`);
    }
}
f();