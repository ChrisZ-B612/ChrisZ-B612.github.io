/**
 * Created by Chris, Z on 2016/1/24 15:19.
 */
function timeout(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, reject);
    });
}

var p = timeout(1000).then(() => {
    console.log("111");
    return timeout(2000);
}).then(() => {
    console.log("222");
    throw new Error("hmm");
}).catch(err => {
    console.log("333");
    return Promise.all([timeout(100), timeout(200)]);
});