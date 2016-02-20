/**
 * Created by Chris, Z on 2016/1/29 18:05.
 */
describe("Sorting algorithms", function () {
    var srcArr, fakeArr = generateArray(1000000), ascending = true, sortingAlgorithm = window.sorting;

    beforeEach(function () {
        srcArr = fakeArr.slice(0);
    });

    xit("sorts array with bubble", function () {
        testSortAlgorithm("bubble");
    });

    xit("sorts array with select", function () {
        testSortAlgorithm("select");
    });

    xit("sorts array with insert", function () {
        testSortAlgorithm("insert");
    });

    it("sorts array with shell", function () {
        testSortAlgorithm("shell");
    });

    it("sorts array with heap", function () {
        testSortAlgorithm("heap");
    });

    it("sorts array with merge", function () {
        testSortAlgorithm("merge");
    });

    it("sorts array with quick", function () {
        testSortAlgorithm("quick");
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

    function testSortAlgorithm(type) {
        sortingAlgorithm[type](srcArr, ascending);
        expect(isOrdered(srcArr, ascending)).toBeTruthy();
    }
});