const merge = require('webpack-merge')
const common = require('./webpack.common')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const library = 'App'
const entry = {
  App: path.resolve('src', 'index.js'),
}

module.exports = merge(common, {
  entry,
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve('..'),
    }),
  ],
  optimization: {
    minimize: false,
    // minimizer: [
    //   new MinifyPlugin({
    //     keepClassName: true,
    //   }),
    // ],
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
    library,
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
})
