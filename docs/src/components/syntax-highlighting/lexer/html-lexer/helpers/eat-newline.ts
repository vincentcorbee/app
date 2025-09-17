import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { isLineFeed } from './is-line-feed'

export function eatNewline(lexer: Lexer): string {
  const { source } = lexer

  let value = ''

  while (isLineFeed(source[lexer.index] ?? '')) {
    value += eatChar(lexer)

    lexer.line++
  }

  lexer.col = 0

  return value
}
