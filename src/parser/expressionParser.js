import Parser from 'early-parser'
import Lexer from 'early-parser/src/Lexer'
import Environment from 'early-parser/src/Environment'
import ASI from 'early-parser/src/ASI'
import grammer from './grammer'
import tokens from './tokens'
import Interpreter from './interpreter/interpreter'

const lexer = new Lexer()
const parser = new Parser(lexer)

lexer.tokens(tokens)
lexer.state('COMMENT', lexer => {
  lexer.tokens([
    {
      name: 'ENDCOMMENT',
      reg: /^\*\//,
      begin: 'INITIAL',
      cb: (substr, lexer) => (lexer.line += (substr.match(/\n/g) || []).length),
    },
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
  lexer.input(expression)
  // Create a new global environment for the interpreter

  return parser.parse(() =>
    new Interpreter(parser.AST).interpret(new Environment(null, vm), directive)
  )
}
