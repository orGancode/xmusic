const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    bundle: './src/index.es6',
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(es6|js)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[ext]'
　　　　}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html-withimg-loader!' + __dirname + "/src/index.html"
    }),
    new ExtractTextPlugin("style.css")
  ]
};