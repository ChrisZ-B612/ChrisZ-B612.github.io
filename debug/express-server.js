/**
 * Created by Chris, Z on 2016/7/20 17:15.
 */
var express = require('express');
var app = express(), port = 8192;

app.use(express.static('./'));

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}/`);
});