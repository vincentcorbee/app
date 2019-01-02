const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

const config = {
  output: {
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..')
    })
  ],
  module: {
    rules: [
      {
        test: /\.[j|t]s$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}
module.exports = config
