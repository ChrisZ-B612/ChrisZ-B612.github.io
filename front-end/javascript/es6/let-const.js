/**
 * Created by Chris, Z on 2016/1/23 16:04.
 * Supported in Chrome & Firefox
 */
(function () {
    {
        //console.log(`x = ${x}`);// ReferenceError: x is not defined
        let x = "xxx";
        {
            const y = "Chris, Z";
            //y = "foo";// TypeError: Assignment to constant variable.
            const z = {
                name: "z",
                toString() {
                    return this.name;
                }
            };
            z.name = "Chris, Z";// Changed
            console.log(z);
        }
        console.log(`x = ${x}`);
    }
})();