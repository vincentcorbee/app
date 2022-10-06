import Parser from '@digitalbranch/early-parser/src/Parser'
import Lexer from '@digitalbranch/early-parser/src/Lexer'
import Environment from '@digitalbranch/early-parser/src/Environment'
import ASI from '@digitalbranch/early-parser/src/ASI'
import grammer from './grammer'
import tokens from './tokens'
import Interpreter from './interpreter/interpreter'

const lexer = new Lexer()
const parser = new Parser(lexer)
let comments = []

lexer.tokens(tokens)

lexer.state('COMMENT', lexer => {
  lexer.tokens([
    {
      name: 'ENDCOMMENT',
      reg: /^\*\//,
      begin: 'INITIAL',
      cb: (substr, lexer) => {
        const match = substr.match(/\n/g) || []

        comments.push({
          type: 'CommentBlock',
          value: substr,
        })

        return (lexer.line += match.length)
      },
    },
  ])

  lexer.ignore(/^[ \t\v\r]+/)
  lexer.error(lexer => lexer.skip(1))
})

lexer.ignore(/^[ \t\v\r]+/)
lexer.ignore(/^\/\/.*/)

parser.grammer(grammer)

parser.error = err => {
  try {
    return ASI(parser, err)
  } catch (ASIError) {
    console.log(ASIError)
  }
}

export default (vm, expression, directive) => {
  lexer.input(expression)

  parser.reset()

  // Create a new global environment for the interpreter

  return parser.parse(({ AST }) =>
    new Interpreter(AST).interpret(new Environment(null, vm), directive)
  )
}
