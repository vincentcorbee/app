const fs = require('fs')
const path = require('path')
const loc = path.join(process.cwd(), 'lib', 'app.js')
fs.readFile(loc, 'utf8', (err, data) =>
  fs.writeFile(
    loc,
    data.replace(/\.\/src\/[^)'"]+/g, substr => substr.match(/[^/]+.js$/)[0]),
    'utf8',
    err => console.log(err)
  )
)
