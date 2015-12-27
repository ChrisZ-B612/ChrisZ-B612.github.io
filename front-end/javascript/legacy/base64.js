/**
 * Created by Chris, Z on 2015/12/21 15:20.
 */
(function (window, undefined) {
    window.base64 = {
        encode: function (input) {
            var length = input.length, output = [];
            for (var i = 0, j = 0; i < length; i += 3, j += 4) {
                var val = 0xff & input.charCodeAt(i), trip = false, quad = false, bits = 0x3f;
                val <<= 8;
                if (i + 1 < length) {
                    val |= 0xff & input.charCodeAt(i + 1);
                    trip = true;
                }
                val <<= 8;
                if (i + 2 < length) {
                    val |= 0xff & input.charCodeAt(i + 2);
                    quad = true;
                }
                output[j + 3] = alphabet[quad ? val & bits : 64];
                val >>= 6;
                output[j + 2] = alphabet[trip ? val & bits : 64];
                val >>= 6;
                output[j + 1] = alphabet[val & bits];
                val >>= 6;
                output[j] = alphabet[val & bits];
            }
            return output.join("");
        },
        decode: function (input) {
            var length = input.length, offset = 0, val = 0x00, index = 0, output = [];
            if (length % 4 !== 0) throw new Error("Invalid length of array : " + length);
            if (input[length - 1] === "=") length--;
            if (input[length - 1] === "=") length--;
            for (var i = 0; i < length; i++) {
                val <<= 6;
                val = val | codes[input.charCodeAt(i)];
                offset += 6;
                if (offset >= 8) {
                    offset -= 8;
                    output[index++] = String.fromCharCode(val >> offset & 0xff);
                }
            }
            return output.join("");
        }
    };

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var codes = (function () {
        var codes = [];
        for (var i = 0; i < 128; i++) {
            codes[i] = -1;
        }
        for (var i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
            codes[i] = i - "A".charCodeAt(0);
        }
        for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
            codes[i] = i - "a".charCodeAt(0) + 26;
        }
        for (var i = "0".charCodeAt(0); i <= "9".charCodeAt(0); i++) {
            codes[i] = i - "0".charCodeAt(0) + 52;
        }
        codes["+".charCodeAt(0)] = 62;
        codes["/".charCodeAt(0)] = 63;
        return codes;
    })();

})(window);