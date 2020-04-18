// 要求：一共 3 题，2h 内完成，如果实现困难可留空， 如果有多重实现思路，也可以都写上


/**
* 1. 模拟实现 Promise.all
*
* @param {Array<Promise>} arr
*/
function promiseAll(arr) {
    // 你的代码
    return new Promise((resolve, reject) => {
        let len = arr.length;
        let result = [];
        let count = 0;

        if (len === 0) {
            resolve(result);
            return;
        }

        arr.forEach((item, index) => {
            Promise.resolve(item).then((value) => {
                count++;
                result[index] = value;

                if (count === len) {
                    resolve(result)
                }
            }, reject);
        })
    })
}



/**
* 2. 实现 JSON parser，即实现 JSON.parse 函数
*
*/
const parser = (str) => {
    return eval("(" + str + ")");
}



/**
* 3. 你是专业小偷，今天你打算偷遍一整条街的房子，每间房子都有不同数量的钱可以偷，但是房子之间有报警系统，如果你连偷两间相邻的房子，就会引来警察。
* 这里有一个List，每个元素都代表这间房子内可以偷到的钱，你要如何安排计划才能偷到最多的钱而且不会惊动警察。
* 示例：
* [2,4,5,1,3]，最多可以偷到 2+5+3 = 10，因为4+5+3 = 12 虽然可以拿到比较多钱，但是会被警察抓。
*/
function steal(input) {
    const inner = (arr) => {
        if (arr.length === 0) return 0;

        return arr[0] + Math.max(inner(arr.slice(2)), inner(arr.slice(3)));
    };

    return inner([0, 0].concat(input));
}