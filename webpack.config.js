var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        app: "./index.js",
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "audio.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
            },
        ],
    },
};
