const shortid = require('shortid');

let start = Date.now();

for (let index = 0; index < 1e5; index++) {
    shortid.generate();
}

console.log(Date.now() - start);