/**
 * Created by Chris, Z on 6/13/2016 2:07 PM.
 * Webpack your bags (https://blog.madewithlove.be/post/webpack-your-bags/)
 * webpack-dev-server --inline --hot (http://localhost:8080/webpack-dev-server/)
 * http://localhost:8080/webpack-dev-server/ -> http://localhost:8080/webpack-dev-server/index.html
 * http://localhost:8080/webpack-dev-server/bundle -> http://localhost:8080/webpack-dev-server/bundle.js
 */
var webpack = require('webpack');
var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var production = process.env.NODE_ENV === 'production';

var plugins = [
    new ExtractTextPlugin('bundle.css', {allChunks: true}/* 'false' led to error */),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'main', // Move dependencies to our main file
        async: 'commons', // (boolean|string)设置async后，name的设置就失效了
        children:  true, // Look for common dependencies in all children
        minChunks: 2, // How many times a dependency must come up before being extracted
    }),
    new CopyWebpackPlugin([{from: 'src/index.html'}])
];

if (production) {
    plugins = plugins.concat([
        new CleanWebpackPlugin('builds'),

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugin optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),

        // This plugin minifies all the javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle:   true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),

        // This plugin defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__:      !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__:    !production,
            'process.env':   {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),

    ]);
}

module.exports = {
    entry:  './src',
    output: {
        path:     'builds',
        filename: production ? '[name]-[hash].js' : 'bundle.js',
        chunkFilename: '[name].bundle.js',
        //publicPath: 'builds/'
    },
    plugins: plugins,
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'baggage?[file].html=template&[file].scss'
            }
        ],
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss/,
                //loader: 'style!css!sass',
                loader: ExtractTextPlugin.extract('style', 'css!sass'),// No Hot Module Replacement!!
            },
            {
                test: /\.html/,
                loader: 'html-loader'
            },
            {
                test:   /\.(png|gif|jpe?g|svg)$/i,
                loader: 'url?limit=10000',
            },
        ]
    },
    debug: !production,
    devtool: production ? false : 'eval'
};