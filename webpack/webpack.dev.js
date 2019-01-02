const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const pkg = require('../package.json')

const dependencies = pkg.dependencies
const index = {
  hash: true,
  template: path.join('src', 'index.html'),
  chunks: ['app']
}
const entry = {
  app: ['@babel/polyfill', path.resolve(__dirname, path.join('..', 'src', 'app.js'))]
}

// if (dependencies !== undefined && Object.keys(dependencies).length) {
//   entry.vendor = Object.keys(dependencies)
//   index.chunks.unshift('vendor')
// }

module.exports = merge(common, {
  mode: 'development',
  entry,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist/'),
    overlay: true,
    port: 9002,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css'
    }),
    new HtmlWebpackPlugin(index),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '..', path.join('src', 'img')),
        to: path.resolve(__dirname, '..', path.join('dist', 'img'))
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'img/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  }
})
