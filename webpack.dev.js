const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "./dist"),
        },
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            template: "./dist/index.html",
            filename: "index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
            chunks: [`index`],
        }),

        new HtmlWebpackPlugin({
            template: "./dist/play.html",
            filename: "play.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
            chunks: [`play`],
        }),

        //new UglifyJsPlugin(),
    ],
});
