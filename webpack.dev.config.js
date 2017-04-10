const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './client/index.jsx',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/index.jsx')
  ],
  output: {
    path: path.join(__dirname, './client/dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader'
      },
      { test: /\.(jpg|png|svg|jpeg)$/,
        loader: 'file-loader?name=[document-management2].[jpg]'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.join(__dirname, './client/index.html')
    }),
    new ExtractTextPlugin('main.css')
  ],
};
