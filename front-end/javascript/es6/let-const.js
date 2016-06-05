/**
 * Created by Chris, Z on 2016/1/23 16:04.
 */
"use strict";
function f() {
    {
        //console.log(`x = ${x}`);// ReferenceError: x is not defined
        let x = "x-man";
        {
            const y = "Chris, Z";
            //y = "foo";// TypeError: Assignment to constant variable.
            const z = {
                name: "foo",
                toString() {
                    return this.name;
                }
            };
            z.name = "Chris, Z";// Changed
            console.log(z);
        }
        console.log(`x = ${x}`);
        //let x = 11;// error, already declared in block
    }
}

f();