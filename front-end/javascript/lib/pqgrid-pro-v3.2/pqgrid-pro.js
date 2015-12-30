$(function () {
    var rows = 200,
        cols = 20,
        toLetter = $.paramquery.toLetter,
        generateData = $.paramquery.generateData,
        data = generateData(rows, cols),
        CM = [],
        width = 60;

    for (var i = 0; i < 10; i++) {
        CM[i] = { title: toLetter(i), minWidth: width, width: width };
        CM[i].colModel = [];
        for (var j = 0; j < 2; j++) {
            CM[i].colModel.push({title: toLetter(j), minWidth: width, width: width});
        }
    }

    CM[4].hidden = true;

    var obj = {
        colModel: CM,
        width: 1600,
        height: 500,
        wrap: false,
        hwrap: false,
        freezeBorders: true,
        freezeCols: 2,
        flex: {
            on: true,
            one: false,
            all: false
        },
        resizable: true,
        virtualX: true,
        virtualY: true,
        selectionModel: {
            type: "cell",
            mode: "range",
            all: false,
            native: false,
            onTab: "nextFocus",
            row: true,
            column: true
        },
        scrollModel: {
            horizontal: true,
            pace: "fast",
            autoFit: true,
            lastColumn: "auto",
            flexContent: true
        },
        mergeCells: [
            { r1: 0, c1: 10, rc: 2, cc: 50, style: "background:red;", cls: "my-cls"},
            { r1: 5, c1: 4, rc: 100, cc: 2, cls: "my-cls"}
        ],
        title: "Cell merging",
        showTop: true,
        showToolbar: true,
        showHeader: true,
        showBottom: false,
        showTitle: true,
        numberCell: { width: 50 },
        dataModel: {
            data: data
        }
    };
    var pqgrid_pro = pq.grid("#pqgrid_pro", obj);
});
