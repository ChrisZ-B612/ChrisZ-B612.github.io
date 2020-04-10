/**
 * Created by Chris, Z on 2016/1/20 19:48.
 * Supported in Chrome & Firefox
 */
"use strict";

let arr = [2, 4, 6];

// Expression bodies
console.log("odds", arr.map(v => v + 1));
console.log("sums", arr.map((v, i) => v + i));
console.log("pairs", arr.map(v => ({even: v, odd: v + 1})));// parentheses are necessary to distinguish from function body declarations.

// Statement bodies(Is this statement? or still expression?)
arr.forEach(v => {
    console.log(`v * v = ${v * v}`);
});

// Lexical this
let bob = {
    name: "Steve Jobs",
    friends: ["Chris, Z", "ZhangBiao"],
    printFriends() {
        this.friends.forEach(friend => console.log(`${this.name} knows ${friend}.`));
    }
};
bob.printFriends();