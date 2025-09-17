import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { hasData } from './has-data'
import { peekAt } from './peek-at'
import { peekChar } from './peek-char'

export function eatComment(lexer: Lexer): string {
  let comment = eatChar(lexer, 2)

  while (hasData(lexer)) {
    const nextChar = peekChar(lexer)

    if (nextChar === '*' && peekAt(lexer, 1) === '/') {
      comment += eatChar(lexer, 2)

      lexer.state = 'initial'

      break
    }

    if (nextChar === '\n') break

    comment += eatChar(lexer, 1)
  }

  return comment
}
