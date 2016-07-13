/**
 * Created by Chris, Z on 6/5/2016 10:05 PM.
 */
var path = require("path");

var entryPath = "./front-end/javascript/es6/modules/";

module.exports = {
    entry: {
        modules: `${entryPath}modules.js`
    },
    output: {
        path: path.resolve(__dirname, entryPath),
        filename: `[name].bundle.js`
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: "source-map"
};