/**
 * Created by Chris, Z on 2016/1/29 19:12.
 */
describe("Base64 algorithm", function () {
    var input = "keep calm and carry on", output = "a2VlcCBjYWxtIGFuZCBjYXJyeSBvbg==";

    it("encode 'keep calm and carry on'", function () {
        expect(base64.encode(input)).toEqual(output);
    });

    it("decode 'keep calm and carry on'", function () {
        expect(base64.decode(output)).toEqual(input);
    });

});