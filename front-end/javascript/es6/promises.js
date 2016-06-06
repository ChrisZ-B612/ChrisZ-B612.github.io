/**
 * Created by Chris, Z on 2016/1/24 15:19.
 */
function timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

var p = timeout(1000).then(() => {
    console.log("first");
    return timeout(2000);
}).then(() => {
    console.log("second");
    throw new Error("hmm");
}).catch(err => {
    console.log("err");
    return Promise.all([timeout(100), timeout(200)]);
});