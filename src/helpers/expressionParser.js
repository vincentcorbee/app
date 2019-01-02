import Parser from '../parser/Parser'
import Lexer from '../parser/Lexer'
import Environment from '../parser/Environment'
import grammer from '../parser/grammer'
import tokens from '../parser/tokens'
import Interpreter from '../parser/Interpreter'
import ASI from '../parser/ASI'

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
parser.grammer(grammer)
parser.error = err => ASI(parser, err)

export default (vm, expression, directive) => {
  let output = ''
  lexer.input(expression)
  parser.parse(() => {
    const AST = parser.AST
    const interpreter = new Interpreter(AST)
    // Create a new global environment for the interpreter
    const env = new Environment(null, vm)
    output = interpreter.interpret(env, directive)
  })
  lexer.reset()
  return output
}
