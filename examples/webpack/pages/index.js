const todo = require('./todo/todo')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  templates: [new HtmlWebpackPlugin(todo.template)],
  entry: {
    todo: todo.entry,
  },
}
