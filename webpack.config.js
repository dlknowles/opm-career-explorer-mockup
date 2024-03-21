const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                options: {
                    knownHelpersOnly: false,
                    partialDirs: [path.join(__dirname, "src", "parts")]
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".hbs"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.hbs",
            filename: "./index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/intro.hbs",
            filename: "./intro.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/quiz.hbs",
            filename: "./quiz.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/results.hbs",
            filename: "./results.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/error.hbs",
            filename: "./error.html"
        })
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        },
        compress: true,
        port: 9000,
        watchFiles: ["src/**/*.hbs"]
    }
};
