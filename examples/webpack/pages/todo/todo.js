const path = require('path')

const cwd = process.cwd()

const template = {
  hash: true,
  template: path.resolve(cwd, 'src', 'pages', 'todo', 'index.html'),
  inect: 'head',
  chunks: ['todo'],
}
const entry = [path.resolve(cwd, 'src', 'pages', 'todo', 'todo.ts')]

module.exports = {
  template,
  entry,
}
