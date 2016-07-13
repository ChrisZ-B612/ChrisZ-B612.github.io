/**
 * Created by Chris, Z on 2016/7/13 17:19.
 * https://webpack.github.io/docs/tutorials/getting-started/
 * webpack --progress --colors --watch (auto-compile& manual-refresh)
 * webpack-dev-server --progress --colors (auto-compile & auto-refresh, http://localhost:8080/webpack-dev-server/bundle)
 */
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};