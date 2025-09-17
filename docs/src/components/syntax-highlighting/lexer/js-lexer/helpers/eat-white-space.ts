import { Lexer } from "../types"

export function eatWhiteSpace(lexer: Lexer): string
{
  const { source } = lexer

  let whiteSpace = ''

  while(source[lexer.index] === ' ' || source[lexer.index] === '\t') {
    whiteSpace += source[lexer.index++]
    lexer.col++
  }

  return whiteSpace
}