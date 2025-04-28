const todo = require('./todo/todo')
const signup = require('./signup/signup')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  templates: [
    // new HtmlWebpackPlugin(todo.template),
    new HtmlWebpackPlugin(signup.template),
  ],
  entry: {
    signup: signup.entry,
    // todo: todo.entry,
  },
}
