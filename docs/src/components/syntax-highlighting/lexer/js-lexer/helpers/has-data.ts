import { Lexer } from "../types";

export function hasData(lexer: Lexer): boolean
{
  return !!lexer.source[lexer.index]
}