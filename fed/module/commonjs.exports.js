let obj = {
    a: 0,
    b: {
        c: 0,
    },
};

setInterval(() => {
    obj.b.c += 1;
    console.log(`commonjs.exports: ${obj.b.c}`);
}, 1000);

module.exports = obj;
