import { Lexer } from '../types'
import { eatChar } from './eat-char'
import { hasData } from './has-data'
import { isAsciiAz } from './is-ascii-az'
import { isInteger } from './is-integer'

export function eatIdentifer(lexer: Lexer): string {
  let idenifier = ''

  while (hasData(lexer)) {
    const char = lexer.source[lexer.index]

    if (!(isAsciiAz(char) || char === '-' || isInteger(char) || char === '_')) break

    idenifier += eatChar(lexer)
  }

  return idenifier
}
