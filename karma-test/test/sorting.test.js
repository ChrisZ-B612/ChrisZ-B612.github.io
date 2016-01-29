/**
 * Created by Chris, Z on 2016/1/29 18:05.
 */
describe("Sorting test", function () {
    var srcArr, ascending = true, sortingAlgorithm = window.sorting;

    beforeEach(function () {
        srcArr = generateArray(1000000);
    });

    xit("sorts array with bubble", function () {
        sortingAlgorithm.bubble(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    xit("sorts array with select", function () {
        sortingAlgorithm.select(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    xit("sorts array with insert", function () {
        sortingAlgorithm.insert(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    it("sorts array with shell", function () {
        sortingAlgorithm.shell(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    it("sorts array with heap", function () {
        sortingAlgorithm.heap(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    it("sorts array with merge", function () {
        sortingAlgorithm.merge(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    it("sorts array with quick", function () {
        sortingAlgorithm.quick(srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    });

    function isOrdered(arr, ascending) {
        var isOrdered = true;
        for (var i = 1; i < arr.length; i++) {
            var res = arr[i - 1] - arr[i];
            if (res !== 0 && res > 0 === ascending) {
                isOrdered = false;
                break;
            }
        }
        return isOrdered;
    }

    function generateArray(length) {
        var arr = [];
        for (var i = 0; i < length; i++) {
            arr.push(Math.round(Math.random() * length * 10));
        }
        return arr;
    }
});