/**
 * Created by Chris, Z on 2016/1/20 19:48.
 * Supported in Chrome & Firefox
 */
let arr = [2, 4, 6];

// Expression bodies
console.log(arr.map(v => v + 1));
console.log(arr.map((v, i) => v + i));
console.log(arr.map(v => ({even: v, odd: v + 1})));

// Statement bodies
arr.forEach(v => {
    console.log(`v * v = ${v * v}`);
});

// Lexical this
let bob = {
    name: "Bob",
    friends: ["Chris", "Steve"],
    printFriends() {
        this.friends.forEach(friend => console.log(`${this.name} knows ${friend}.`));
    }
};
bob.printFriends();