const path = require("path");

module.exports = {
    // entry: "./src/client.ts",
    entry: {
        main: "./src/client.ts",
        test: "./src/test.js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        hashFunction: "xxhash64",
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
    },
};
