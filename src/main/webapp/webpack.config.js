const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: [ "@babel/env" ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?.*)?$/,
                use: "file-loader"
            },
            {
                test: /\.(png|jpg)$/,
                use: 'url-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "../resources/assets"),
        filename: "bundle.js",
        publicPath: "/"
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html"
        }),
        new FaviconsWebpackPlugin({
            logo: "./src/assets/logo.svg"
        })
    ],
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': { "target": 'http://127.0.0.1:8081', xfwd: true }
        }
    }
};
