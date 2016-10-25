/**
 * Created by Chris, Z on 2016/7/13 17:19.
 * https://webpack.github.io/docs/tutorials/getting-started/
 * webpack --progress --colors --watch (auto-compile & manual-refresh)
 * webpack-dev-server --progress --colors (auto-compile & auto-refresh)
 */
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './entry.js',
    output: {
        path: './static/',
        publicPath: '/sc/',
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html'
        })
    ],
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' }
        ]
    },
    devServer: {
        contentBase: './abc/'   // 没什么用？
    }
};