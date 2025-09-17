import { Lexer } from "../types";

export function peekAt(lexer: Lexer, pos: number): string
{
  return lexer.source[lexer.index + pos] ?? ''
}