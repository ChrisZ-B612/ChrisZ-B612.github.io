/**
 * Created by Chris, Z on 2016/1/20 19:48.
 */
var arr = [2, 4, 6];

console.info("Expression bodies:");
console.log(arr.map(v => v + 1));
console.log(arr.map((v, i) => v + i));
console.log(arr.map(v => ({even: v, odd: v + 1})));

console.info("Statement bodies:");
arr.forEach(v => {
    console.log(v * v);
});

console.info("Lexical this:");
var bob = {
    _name: "Bob",
    _friends: ["apple", "banana"],
    printFriends() {
        this._friends.forEach(friend => console.log(this._name + " knows " + friend));
    }
};
bob.printFriends();