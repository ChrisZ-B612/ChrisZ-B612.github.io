/**
 * Created by Chris, Z on 2016/1/22 10:22.
 */
console.info("Basic literal string creation");
console.log(`In JavaScript '\\n' is a line-feed.`);

console.info("Multiple strings");
console.log(`In JavaScript this is
not legal.`);

console.info("String interpolation");
var name = "Bob", time = "today";
console.log(`Hello ${name}, how are you ${time}?`);