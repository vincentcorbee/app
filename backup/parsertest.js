import Parser from './helpers/parser/earlyParser'
import Lexer from './helpers/parser/lexer'
import Environment from './helpers/parser/Environment'
import grammer from './helpers/parser/grammer'
import tokens from './helpers/parser/tokens'
import Interpreter from './helpers/parser/Interpreter'
import ASI from './helpers/parser/ASI'
const code = `
for (var i = 0; i < 10; i += 1) {
  console.log(i)
  if (i === 5) {
    // does not work
    break
  }
}
`
const lexer = new Lexer()
const parser = new Parser(lexer)
lexer.tokens(tokens)
lexer.state('COMMENT', lexer => {
  lexer.tokens([
    {
      name: 'ENDCOMMENT',
      reg: /^\*\//,
      begin: 'INITIAL',
      cb: (substr, lexer) => (lexer.line += (substr.match(/\n/g) || []).length)
    }
  ])
  lexer.ignore(/^[ \t\v\r]+/)
  lexer.error(lexer => lexer.skip(1))
})
lexer.ignore(/^[ \t\v\r]+/)
lexer.ignore(/^\/\/.*/)
// Still have to create presidence
lexer.input(code)
parser.grammer(grammer)
parser.error = err => ASI(parser, err)
parser.parse(() => {
  const AST = parser.AST
  const interpreter = new Interpreter(AST)
  // Create a new global environment for the interpreter
  const env = new Environment(null)
  // inject console into the environment
  env.define('console')
  env.set('console', console)
  let out = interpreter.interpret(env)
  console.log(out)
  document.querySelector('.input').textContent = code
})
