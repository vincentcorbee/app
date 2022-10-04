const path = require('path')

const cwd = process.cwd()

const template = {
  hash: true,
  template: path.resolve(cwd, 'src', 'pages', 'signup', 'signup.html'),
  inject: 'head',
  chunks: ['signup'],
}
const entry = [path.resolve(cwd, 'src', 'pages', 'signup', 'signup.ts')]

module.exports = {
  template,
  entry,
}
