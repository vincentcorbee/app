import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { hasData } from './has-data'
import { isAsciiAz } from './is-ascii-az'

export function eatIdentifer(lexer: Lexer): string {
  let idenifier = ''

  while (hasData(lexer)) {
    const char = lexer.source[lexer.index]

    if (!(isAsciiAz(char) || char === '$')) break

    idenifier += eatChar(lexer)
  }

  return idenifier
}
