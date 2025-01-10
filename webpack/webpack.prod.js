const merge = require('webpack-merge')
const common = require('./webpack.common')
// const MinifyPlugin = require('babel-minify-webpack-plugin')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const library = 'app'
const entry = {
  app: path.resolve('src', 'index.ts'),
}

console.log('hoi')

module.exports = merge(common, {
  entry,
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..'),
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
    path: path.resolve(__dirname, '..', 'dist'),
    library,
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
})
