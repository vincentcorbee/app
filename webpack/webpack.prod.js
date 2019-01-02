const merge = require('webpack-merge')
const common = require('./webpack.common')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const path = require('path')

const library = 'App'
const entry = {
  app: path.resolve(__dirname, path.join('..', 'src', 'models', 'App.js'))
}

module.exports = merge(common, {
  entry,
  optimization: {
    // minimize: false,
    minimizer: [
      new MinifyPlugin({
        keepClassName: true
      })
    ]
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'lib'),
    library,
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  }
})
