const {a} = require('./commonjs.exports.js');

setInterval(() => {
    console.log(`commonjs.require: ${a}`);
}, 1000);
