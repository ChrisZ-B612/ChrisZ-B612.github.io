/**
 * Created by Chris, Z on 6/5/2016 10:05 PM.
 */
var path = require("path");

module.exports = {
    debug: true,
    entry: {
        bundle: "./entry.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: "style!css!autoprefixer-loader!sass-loader"// 'css-loader' is not working, use 'style!css' instead.
            },
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(png|jpg|gif)$/,
                //loader: "file-loader?name=images/[name]-[hash:6].[ext]"
                loader: "url-loader?limit=10000&name=images/[name]-[hash:6].[ext]"
            },
            {
                test: require.resolve("jquery"),
                loader: "expose?$"
            }
        ]
    },
    stats: {
        colors: true
    }
};