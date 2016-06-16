/**
 * Created by Chris, Z on 6/13/2016 2:07 PM.
 * webpack-dev-server --inline --hot
 */
var webpack = require('webpack');
var path = require('path');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var production = process.env.NODE_ENV === 'production';

var plugins = [
    new ExtractTextPlugin('bundle.css', {allChunks: true}/* 'false' led to error */),
    new webpack.optimize.CommonsChunkPlugin({
        name:      'main', // Move dependencies to our main file
        children:  true, // Look for common dependencies in all children,
        minChunks: 2, // How many times a dependency must come up before being extracted
    })
];

if (production) {
    plugins = plugins.concat([
        // Cleanup the builds/ folder before compiling our final assets
        new CleanPlugin('builds'),

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
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'builds/'
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
                    presets: ["es2015"]
                }
            },
            {
                test: /\.scss/,
                //loader: 'style!css!sass',
                loader: ExtractTextPlugin.extract('style', 'css!sass'),
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