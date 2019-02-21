const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

const config = {
  output: {
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [new BundleAnalyzerPlugin(), new webpack.NamedModulesPlugin()],
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
