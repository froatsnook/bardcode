var PROD = process.env.NODE_ENV === "production";

var path = require("path");
var webpack = require("webpack");

var plugins = [];

// definePlugin takes raw strings and inserts them, so you can put strings of
// JS if you want.
var defs = { };

defs.__DEV__ = PROD ? "false" : "true";

plugins.push(new webpack.DefinePlugin(defs));

if (!PROD) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
}

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      except: [
          "$super",
          "$",
          "exports",
          "require",
      ],
  }));
}

var entry = ["./index"];
if (!PROD) {
  entry.push("webpack-hot-middleware/client");
}

module.exports = {
  context: path.resolve(__dirname + "/src"),
  entry: entry,
  devtool: PROD ? null : "cheap-eval-source-map",
  target: "web",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        loader: `style!css`,
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./node_modules"),
        loader: "style!css",
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname + "/dist"),
    library: "browser",
    filename: "browser.js",
  },
  plugins: plugins,
  resolve: {
    root: path.resolve("./src"),
    alias: {
      common: path.resolve("./src/common"),
      collections: path.resolve("./src/common/collections"),
    },
  },
};

