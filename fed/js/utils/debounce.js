export const debounce = function (func, wait, immediate) {
    let timeout;
    let result;

    let debounced = function () {
        // eslint-disable-next-line no-invalid-this
        let context = this;
        // eslint-disable-next-line prefer-rest-params
        let args = arguments;

        if (timeout) {
            clearTimeout(timeout);
        }
        if (immediate) {
            // 如果已经执行过，不再执行
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
            if (callNow) {
                result = func.apply(context, args);
            }
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }
        return result;
    };

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
};
