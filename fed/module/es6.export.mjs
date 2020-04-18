let a = 0;

setInterval(() => {
    a += 1;
    console.log(`es6.export: ${a}`);
}, 1000);

export {
    a
};
