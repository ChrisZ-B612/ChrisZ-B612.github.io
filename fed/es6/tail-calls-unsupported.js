/**
 * Created by Chris, Z on 2016/1/24 15:27.
 */
function factorial(n, acc = 1) {
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc);
}

// Stack overflow in most implementations today, but safe on arbitrary inputs in ES2015
factorial(100000);