/**
 * Created by Chris, Z on 2016/1/24 15:25.
 */
let O = {a: 1};
Object.defineProperty(O, 'b', {value: 2});
O[Symbol('c')] = 3;

for (let k of Reflect.ownKeys(O)) {// Reflect.ownKeys =? Object.getOwnPropertyNames + Object.getOwnPropertySymbols
    console.log(k);// ['a', 'b', Symbol(c)]
}

function C(a, b) {
    this.c = a + b;
}
let instance = Reflect.construct(C, [20, 22]);// =? 'new C(...[20, 22])'
console.log(`instance.c: ${instance.c}`);// 42