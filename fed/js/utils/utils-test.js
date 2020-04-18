const {throttle} = require('./throttle');

let count = 0;
const func = throttle(() => {
    console.log(`NASA: ${count}`);
}, 2000);

setInterval(() => {
    count++;
    func();
}, 1000);