/**
 * Created by Chris, Z on 2015/12/22 14:45.
 */
(function (window, undefined) {
    window.sorting = window.sorting = {
        bubble: function (arr, ascending) {// 1、冒泡排序
            for (var i = arr.length - 1, ceil = -1/* 优化一 */; i > 0; i--) {
                var isOrdered = true;// 优化二
                for (var j = 0; j < i; j++) {
                    if (arr[j + 1] - arr[j] < 0 === ascending) {
                        swap(arr, j, ceil = j + 1);
                        isOrdered = false;
                    }
                }
                if (isOrdered) break;// 优化二：如果某次遍历发现没有进行过交换操作，那么说明该数组已经有序。
                i = ceil;// 优化一：该数组从ceil往后已经有序，所以只需要对ceil之前的部分进行排序即可
            }
        },
        select: function (arr, ascending) {// 2、选择排序
            for (var i = 0; i < arr.length - 1; i++) {
                var selected = i;
                for (var j = i + 1; j < arr.length; j++) {
                    if (arr[j] - arr[selected] < 0 === ascending) {
                        selected = j;
                    }
                }
                swap(arr, i, selected);
            }
        },
        insert: function (arr, ascending) {// 3、插入排序
            for (var i = 1; i < arr.length; i++) {
                var tmp = arr[i], j;
                for (j = i - 1; j >= 0; j--) {
                    var res = arr[j] - tmp;
                    if (res === 0 || res < 0 == ascending) break;
                    arr[j + 1] = arr[j];
                }
                arr[j + 1] = tmp;
            }
        },
        shell: function (arr, ascending) {// 4、希尔排序
            var gap = 1, divider = 3;
            while (gap < arr.length / divider) {
                gap = gap * divider + 1;
            }
            while (gap >= 1) {
                for (var i = gap; i < arr.length; i++) {
                    var tmp = arr[i], j;
                    for (j = i - gap; j >= 0; j -= gap) {
                        var res = arr[j] - tmp;
                        if (res === 0 || res < 0 === ascending) break;
                        arr[j + gap] = arr[j];
                    }
                    arr[j + gap] = tmp;
                }
                gap = Math.floor(gap / divider);// 这里一定要舍精度，否则就会粗大事！
            }
        },
        merge: function (arr, ascending) {// 5、归并排序
            sort(arr, 0, arr.length, ascending);

            function sort(arr, start, end, ascending) {
                var length = end - start;
                if (length <= 50) {
                    for (var i = start + 1; i < end; i++) {
                        var tmp = arr[i], j;
                        for (j = i - 1; j >= start; j--) {
                            var res = arr[j] - tmp;
                            if (res === 0 || res < 0 === ascending) break;
                            arr[j + 1] = arr[j];
                        }
                        arr[j + 1] = tmp;
                    }
                    return;
                }
                var middle = Math.round((start + end) / 2);
                sort(arr, start, middle, ascending);
                sort(arr, middle, end, ascending);
                merge(arr, start, middle, end, ascending);
            }

            function merge(arr, start, middle, end, ascending) {
                var leftEndCompareToRightStart = arr[middle - 1] - arr[middle];
                if (leftEndCompareToRightStart === 0 || leftEndCompareToRightStart < 0 === ascending) return;

                var length = end - start, kakashi = arr.slice(start, end);
                var leftIdx = 0, splitIdx = middle - start, rightIdx = splitIdx, index = start;
                while (leftIdx < splitIdx && rightIdx < length) {
                    if (kakashi[leftIdx] === kakashi[rightIdx]) {
                        arr[index++] = kakashi[leftIdx++];
                        arr[index++] = kakashi[rightIdx++];
                    } else if (kakashi[leftIdx] - kakashi[rightIdx] < 0 === ascending) {
                        arr[index++] = kakashi[leftIdx++];
                    } else if (kakashi[rightIdx] - kakashi[leftIdx] < 0 === ascending) {
                        arr[index++] = kakashi[rightIdx++];
                    }
                }
                if (leftIdx < splitIdx) {
                    Array.prototype.splice.apply(arr, [index, splitIdx - leftIdx].concat(kakashi.slice(leftIdx, splitIdx)));
                } else if (rightIdx < length) {
                    Array.prototype.splice.apply(arr, [index, length - rightIdx].concat(kakashi.slice(rightIdx, length)));
                }
            }
        },
        quick: function (arr, ascending) {// 6、快速排序
            sort(arr, 0, arr.length, ascending);

            function sort(arr, start, end, ascending) {
                if (start >= end - 1) return;// 跳出递归
                var holeIndex = start, holeValue = arr[holeIndex], leftIndex = start + 1, rightIndex = end - 1, leftToRight = false;
                while (leftIndex <= rightIndex) {
                    if (leftToRight) {
                        while (leftIndex <= rightIndex && arr[leftIndex] - holeValue > 0 !== ascending) leftIndex++;
                        if (leftIndex <= rightIndex) {
                            arr[holeIndex] = arr[leftIndex];
                            holeIndex = leftIndex++;
                            leftToRight = false;
                        }
                    } else {
                        while (leftIndex <= rightIndex && arr[rightIndex] - holeValue < 0 !== ascending) rightIndex--;
                        if (leftIndex <= rightIndex) {
                            arr[holeIndex] = arr[rightIndex];
                            holeIndex = rightIndex--;
                            leftToRight = true;
                        }
                    }
                }
                arr[holeIndex] = holeValue;
                sort(arr, start, holeIndex, ascending);
                sort(arr, holeIndex + 1, end, ascending);
            }
        },
        heap: function (arr, ascending) {// 7、堆排序
            sort(arr, 3, ascending);

            function sort(arr, N, ascending) {
                buildNTree(arr, N, ascending);// 构建N叉堆
                for (var i = arr.length - 1; i > 0; i--) {
                    swap(arr, 0, i);
                    sink(arr, 0, i, N, ascending);
                }
            }

            /**
             * 数组元素从0开始依次和N叉堆从上到下从左到右的树节点一一对应，所以构建的N叉堆其实是完全N叉堆
             * @param arr
             * @param ascending
             * @param N
             * @param <T>
             */
            function buildNTree(arr, N, ascending) {
                for (var i = Math.floor((arr.length - 2) / N); i >= 0; i--) {
                    sink(arr, i, arr.length, N, ascending);
                }
            }

            /**
             * 以arr[start]节点为根节点开始执行N叉堆重构
             * @param arr
             * @param start
             * @param length
             * @param N
             * @param ascending
             */
            function sink(arr, start, length, N, ascending) {
                var holeIndex = start, holeValue = arr[start], index = start * N + 1;
                while (index < length) {
                    var rightChild = index + N - 1;
                    for (var i = index + 1; i < length && i <= rightChild; i++) {
                        if (arr[i] - arr[index] > 0 === ascending) index = i;
                    }
                    if (arr[index] - holeValue > 0 === ascending) {// 挖到新坑洞
                        arr[holeIndex] = arr[index];
                        holeIndex = index;
                        index = index * N + 1;// 继续找新坑洞
                    } else break;
                }
                arr[holeIndex] = holeValue;
            }
        }
    };

    function swap(arr, i, j) {
        if (i === j) return;
        arr[i] = arr[i] + arr[j];
        arr[j] = arr[i] - arr[j];
        arr[i] = arr[i] - arr[j];
    }

})(window);