import { Lexer } from "../types";
import { eatChar } from "./eat-char";
import { isInteger } from "./is-integer";

export function eatInteger(lexer: Lexer): string
{
  let value = ''

  const { source } = lexer

  while (isInteger(source[lexer.index] ?? '')) value += eatChar(lexer);

  return value
}