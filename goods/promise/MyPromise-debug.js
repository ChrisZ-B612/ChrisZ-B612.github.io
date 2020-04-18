const MyPromise = require('./MyPromise');

let pro = new MyPromise((resolve, reject) => {
    resolve('1');
});
let pro1 = MyPromise.resolve(2);

setTimeout(() => {
    pro.then((res1) => {
        console.log(`NASA: res1(${res1})`);
        return pro1;
    }).then((res2) => {
        console.log(`NASA: res2(${res2})`);
    });
}, 0);

// MyPromise.all([
//     MyPromise.resolve(1),
//     MyPromise.resolve(2),
//     MyPromise.resolve(3),
// ]).then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log(err);
// });
