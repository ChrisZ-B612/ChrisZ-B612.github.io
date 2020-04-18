// abc
define(function (require, exports, module) {
    let a = require('./a');
    let b = require('./b');
    let c = require('./c');
    exports.haha = 'haha';
});

seajs.use(['abc'], function (abc) {

});
