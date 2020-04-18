const throttle = function (func, wait, options = {
    heading: true, // 是否需要头部，false表示不需要
    trailing: true, // 是否需要最后一次执行，false表示不需要
}) {
    let timeout;
    let context;
    let args;
    let pre = 0;

    let next = function () {
        pre = options.heading === false ? 0 : Date.now();
        func.apply(context, args);
        timeout = context = args = null;
    };

    let throttled = function () {
        let now = Date.now();
        if (!pre && options.heading === false) {
            pre = now;
        }
        let remaining = wait - (now - pre);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            timeout && clearTimeout(timeout);
            pre = now;
            func.apply(context, args);
            timeout = context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(next, remaining);
        }
    };

    return throttled;
};

module.exports = {
    throttle,
};