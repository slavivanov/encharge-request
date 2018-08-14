"use strict";
var slsw = require("serverless-webpack");
var nodeExternals = require("webpack-node-externals");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var webpack = require("webpack");
module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    // Since 'aws-sdk' is not compatible with webpack,
    // we exclude all node dependencies
    externals: [nodeExternals()],
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    performance: {
    // Turn off size warnings for entry points
    // hints: false
    },
    // Run babel on all .js files and skip those in node_modules
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: __dirname,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: "src/views/**" }]),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": '"production"'
        })
    ]
};
//# sourceMappingURL=webpack.config.js.map