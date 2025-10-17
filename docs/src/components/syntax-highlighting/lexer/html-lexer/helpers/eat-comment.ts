import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { hasData } from './has-data'
import { peekAt } from './peek-at'
import { peekChar } from './peek-char'

export function eatComment(lexer: Lexer): string {
  let comment = ''

  if (lexer.state === 'comment') {
    lexer.state = 'inComment'

    comment += eatChar(lexer, 4)
  }

  while (hasData(lexer)) {
    const nextChar = peekChar(lexer)

    if (nextChar === '-' && peekAt(lexer, 1) === '-' && peekAt(lexer, 2) === '>') {
      comment += eatChar(lexer, 4)

      lexer.state = 'initial'

      break
    }

    if (nextChar === '\n') break

    comment += eatChar(lexer, 1)
  }

  return comment
}
