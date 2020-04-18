/**
 * Created by Chris, Z on 6/5/2016 10:05 PM.
 */
var path = require("path");

module.exports = {
    entry: {
        modules: "./modules.js"
    },
    output: {
        path: "./",
        filename: "[name].bundle.js"
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