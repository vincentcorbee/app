import { Lexer } from "../types"

export function eatChar(lexer: Lexer, count = 1): string
{
  let result = ''

  while (count) {
    result += lexer.source[lexer.index++]

    lexer.col++

    count --
  }

  return result
}