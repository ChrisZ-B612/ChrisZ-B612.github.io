/**
 * Created by Chris, Z on 6/5/2016 10:05 PM.
 */
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            }
        ]
    },
    stats: {
        colors: true
    }
};