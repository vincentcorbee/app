import { Parser, ASI } from '@digitalbranch/earley-parser'
import grammar from './grammar'
import tokens from './tokens'
import { Directive } from '../modules'
import { ComponentInstance } from '../types'
import { interpret } from './interpreter/interpret'
import { EnvironmentRecord } from './interpreter/environment-record'

const parser = new Parser()

let comments = []

parser.lexer.addTokens(tokens as any)

parser.lexer.setState('COMMENT', lexer => {
  lexer.setTokens([
    {
      name: 'ENDCOMMENT',
      test: /^\*\//,
      enterState: 'INITIAL',
      onEnter(lexer, value = '') {
        const numberOfLines = (value.match(/\n/g) || []).length

        comments.push({
          type: 'CommentBlock',
          value,
        })

        lexer.advanceLines(numberOfLines)
      },
    },
  ])

  lexer.ignoreTokens([/^[ \t\v\r]+/])

  lexer.onError(lexer => lexer.skip(1))
})

parser.lexer.ignoreTokens([/^[ \t\v\r]+/, /^\/\/.*/])

parser.setGrammar(grammar as any)

parser.onError = (error: any) => {
  console.log(error)
  console.log(
    parser.lexer.col,
    parser.lexer.line,
    parser.lexer.source[parser.lexer.index],
    parser.lexer.index,
    parser.lexer.peakToken()
  )
  try {
    return ASI(parser, error)
  } catch (ASIError) {
    console.log(ASIError)
  }
}

const expressionParser = (
  vm: ComponentInstance,
  expression: string,
  directive?: Directive
) => {
  return parser.parse(`${expression};`, result => {
    let value: any

    try {
      const [program] = result

      value = interpret(
        program,
        new EnvironmentRecord(null, {
          this: { value: vm, mutable: false },
          console: { value: console, mutable: false },
        }),
        directive
      )?.value
    } catch (error) {
      console.error(error)

      value = ''
    }

    parser.reset()

    return value
  })
}

export default expressionParser
