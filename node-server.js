/**
 * Created by Chris, Z on 2016/1/13 20:00.
 */
"use strict";
let http = require("http");
var fs = require("fs");
var url = require("url");

var port = 8192, extRegex = /\.(\w+)$/;

const contentTypeMapper = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    jpg: "image/jpeg",
    png: "image/png"
};

http.createServer((request, response) => {

    var pathname = url.parse(request.url).pathname;
    var contentType = contentTypeMapper[pathname.match(extRegex)[1]];

    console.log("Request for " + pathname + " received.");

    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            console.error(err);
            response.writeHead(404, {"Content-Type": "text/html"});
        } else {
            response.writeHead(200, {"Content-Type": contentType});

            response.write(data.toString());
        }
        response.end();
    });

    just4fun();

}).listen(port);

console.log(`Server running at http://localhost:${port}/`);

function just4fun() {

}