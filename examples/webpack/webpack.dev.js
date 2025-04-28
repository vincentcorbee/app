const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const path = require('path')

const cwd = process.cwd()

const config = {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(cwd, 'dist'),
    overlay: true,
    port: 9005,
    historyApiFallback: true,
  },
}

module.exports = merge(common, config)
