import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { hasData } from './has-data'
import { peekChar } from './peek-char'

export function eatAttributeName(lexer: Lexer): string {
  let name = ''

  while (hasData(lexer)) {
    const char = peekChar(lexer)

    if (char === '=' || char === ' ' || char === '>' || char === '/') break

    name += eatChar(lexer)
  }

  return name
}
