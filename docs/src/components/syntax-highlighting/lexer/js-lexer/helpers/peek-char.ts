import { Lexer } from "../types";

export function peekChar(lexer: Lexer): string
{
  return lexer.source[lexer.index] ?? ''
}