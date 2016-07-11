/**
 * Created by Chris, Z on 2016/1/13 20:00.
 */
"use strict";
const http = require("http");
const fs = require("fs");
const url = require("url");

const port = 8192;

// Create a server
http.createServer(staticFilesServer).listen(port);

// Console will print the message
console.log(`Server running at http://127.0.0.1:${port}/`);

function staticFilesServer(request, response) {

    // Parse the request containing file name
    let pathname = url.parse(request.url).pathname;

    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");

    // Read the requested file content from file system
    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            console.error(err);
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {"Content-Type": "text/html"});
        } else {
            // Page found
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200, {"Content-Type": "text/html"});

            // Write the content of the file to response body
            response.write(data.toString());
        }
        // Send the response body
        response.end();
    });

}