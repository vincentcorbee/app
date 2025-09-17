import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { hasData } from './has-data'
import { isAsciiAz } from './is-ascii-az'
import { peekChar } from './peek-char'

export function eatTagName(lexer: Lexer): string {
  let name = ''

  while (hasData(lexer)) {
    const char = peekChar(lexer)

    if (!isAsciiAz(char) && char !== '-') break

    name += eatChar(lexer)
  }

  return name
}
