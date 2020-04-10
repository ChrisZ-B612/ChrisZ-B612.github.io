export const throttle = function (func, wait, options = {
    leading: true, // 是否需要头部，false表示不需要
    trailing: true, // 是否需要最后一次执行，false表示不需要
}) {
    let timeout;
    let context;
    let args;
    let previous = 0;

    let later = function () {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) {
            // eslint-disable-next-line no-multi-assign
            context = args = null;
        }
    };

    let throttled = function () {
        let now = new Date().getTime();
        if (!previous && options.leading === false) {
            previous = now;
        }
        let remaining = wait - (now - previous);
        // eslint-disable-next-line no-invalid-this
        context = this;
        // eslint-disable-next-line prefer-rest-params
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) {
                // eslint-disable-next-line no-multi-assign
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
};
